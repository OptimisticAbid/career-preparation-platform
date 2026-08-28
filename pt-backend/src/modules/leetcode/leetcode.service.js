import { eq } from "drizzle-orm";
import redis from "../../redis/redis.js";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema/profiles.schema.js";
import { problems } from "../../db/schema/problems.schema.js";
import { createProblemService, problemExistsService } from "../problems/problems.service.js";
import {
    fetchUserSubmissions,
    fetchProblemDetails,
    fetchAllStats,
} from "./leetcode-api.client.js";
import { validateStatsRequest, validateSyncRequest } from "./leetcode.validation.js";
import { CACHE_KEYS, LEETCODE_CONFIG, ERROR_MESSAGES } from "./leetcode.config.js";
import { LeetCodeAPIError, ValidationError } from "./leetcode.errors.js";
import leetcodeLogger from "./leetcode.logger.js";

/**
 * Get user's linked LeetCode username
 */
const getUserLeetcodeUsername = async (userId) => {
    try {
        const [userProfile] = await db
            .select({ leetcodeUsername: profiles.leetcodeUsername })
            .from(profiles)
            .where(eq(profiles.userId, userId));

        if (!userProfile?.leetcodeUsername) {
            throw new ValidationError(ERROR_MESSAGES.PROFILE_NOT_LINKED);
        }

        return userProfile.leetcodeUsername;
    } catch (error) {
        if (error instanceof ValidationError) throw error;
        throw new LeetCodeAPIError(
            "Failed to fetch user profile from database",
            500,
            error
        );
    }
};

/**
 * Get LeetCode stats with caching
 */
export const leetcodeStatsService = async (userId) => {
    try {
        validateStatsRequest(userId);

        const username = await getUserLeetcodeUsername(userId);
        const cacheKey = CACHE_KEYS.STATS(username);

        // Try cache first
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            leetcodeLogger.info(`Cache hit for stats: ${username}`);
            return JSON.parse(cachedData);
        }

        // Fetch from API
        leetcodeLogger.info(`Fetching stats for: ${username}`);
        const stats = await fetchAllStats(username);

        // Cache the result
        await redis.setex(
            cacheKey,
            LEETCODE_CONFIG.CACHE_TTL,
            JSON.stringify(stats)
        );

        return stats;
    } catch (error) {
        leetcodeLogger.error("Stats service error", { error: error.message });
        throw error;
    }
};

/**
 * Sync LeetCode submissions with database
 */
export const leetcodeSyncService = async (userId) => {
    const syncStartTime = Date.now();

    try {
        validateSyncRequest(userId);

        const username = await getUserLeetcodeUsername(userId);

        leetcodeLogger.info(`Starting sync for user: ${userId} (${username})`);

        // Fetch submissions
        const submissions = await fetchUserSubmissions(username);

        if (!Array.isArray(submissions) || submissions.length === 0) {
            return { imported: 0, skipped: 0, processed: 0 };
        }

        leetcodeLogger.info(
            `Found ${submissions.length} submissions for ${username}`
        );

        // Process submissions in batches
        let imported = 0;
        let skipped = 0;
        let errors = 0;

        // Process in chunks to avoid overwhelming the system
        for (let i = 0; i < submissions.length; i += LEETCODE_CONFIG.BATCH_SIZE) {
            const batch = submissions.slice(
                i,
                i + LEETCODE_CONFIG.BATCH_SIZE
            );

            await Promise.allSettled(
                batch.map(async (submission) => {
                    try {
                        const sourceProblemId = submission.sourceProblemId;

                        // Check if problem already exists
                        const exists = await problemExistsService(
                            userId,
                            "Leetcode",
                            sourceProblemId
                        );

                        if (exists) {
                            skipped++;
                            return;
                        }

                        // Fetch problem details
                        const problem = await fetchProblemDetails(
                            submission.titleSlug
                        );

                        if (!problem) {
                            errors++;
                            return;
                        }

                        // Prepare problem data
                        const problemData = {
                            userId,
                            problemName: submission.title,
                            sourceProblemId: problem.questionId,
                            difficulty: problem.difficulty || "Unknown",
                            status: "Solved",
                            platform: "leetcode",
                            platformUrl: `https://leetcode.com/problems/${problem.titleSlug}`,
                            solvedAt: new Date(
                                Number(submission.timestamp) * 1000
                            ),
                        };

                        // Save to database
                        const result = await createProblemService(
                            userId,
                            problemData
                        );

                        if (!result?.skipped) {
                            imported++;
                        } else {
                            skipped++;
                        }
                    } catch (error) {
                        errors++;
                        leetcodeLogger.error("Error processing submission", {
                            error: error.message,
                            submission: submission.title,
                        });
                    }
                })
            );
        }

        const duration = Date.now() - syncStartTime;

        leetcodeLogger.info("Sync completed", {
            userId,
            username,
            imported,
            skipped,
            errors,
            durationMs: duration,
        });

        return {
            imported,
            skipped,
            errors,
            processed: imported + skipped + errors,
            durationMs: duration,
        };
    } catch (error) {
        leetcodeLogger.error("Sync service error", {
            userId,
            error: error.message,
            durationMs: Date.now() - syncStartTime,
        });
        throw error;
    }
};