import { createProblemService, problemExistsService } from "../problems/problems.service.js";
import { validateUserId } from "./leetcode.validation.js";
import { findUsernameByUserId } from "./leetcode.repository.js";

const LEETCODE_API = "https://alfa-leetcode-api.onrender.com";

const fetchJson = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`LeetCode API request failed: ${response.status}`);
    }

    return response.json();
};

const getUserLeetcodeUsername = async (userId) => {
    validateUserId(userId);

    const username = await findUsernameByUserId(userId);
    if (!username) {
        throw new Error("LeetCode profile not linked to user account");
    }

    return username;
};

export const leetcodeStatsService = async (userId) => {
    const username = await getUserLeetcodeUsername(userId);

    const [profile, solved, badges] = await Promise.all([
        fetchJson(`${LEETCODE_API}/${username}`),
        fetchJson(`${LEETCODE_API}/${username}/solved`),
        fetchJson(`${LEETCODE_API}/${username}/badges`).catch(() => []),
    ]);

    return {
        profile,
        stats: solved,
        badges,
    };
};

export const leetcodeSyncService = async (userId) => {
    const username = await getUserLeetcodeUsername(userId);
    const submissionsResponse = await fetchJson(`${LEETCODE_API}/${username}/acSubmission`);
    const submissions = Array.isArray(submissionsResponse?.submission)
        ? submissionsResponse.submission
        : [];

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const submission of submissions) {
        try {
            const sourceProblemId = submission.sourceProblemId || submission.titleSlug;
            const alreadyExists = await problemExistsService(userId, "Leetcode", String(sourceProblemId));

            if (alreadyExists) {
                skipped++;
                continue;
            }

            const problem = await fetchJson(`${LEETCODE_API}/select?titleSlug=${submission.titleSlug}`);

            const problemData = {
                userId,
                problemName: submission.title,
                sourceProblemId: String(problem.questionId || submission.titleSlug),
                difficulty: problem.difficulty || "Unknown",
                status: "Solved",
                platform: "leetcode",
                platformUrl: `https://leetcode.com/problems/${problem.titleSlug}`,
                solvedAt: new Date(Number(submission.timestamp) * 1000),
            };

            const result = await createProblemService(userId, problemData);

            if (!result?.skipped) {
                imported++;
            } else {
                skipped++;
            }
        } catch (error) {
            errors++;
        }
    }

    return {
        imported,
        skipped,
        errors,
        processed: imported + skipped + errors,
    };
};