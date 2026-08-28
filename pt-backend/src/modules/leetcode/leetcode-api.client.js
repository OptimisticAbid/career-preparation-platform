import logger from "../../utils/logger.js";
import { LEETCODE_CONFIG, ENDPOINTS, ERROR_MESSAGES } from "./leetcode.config.js";
import { LeetCodeAPIError } from "./leetcode.errors.js";

/**
 * Fetch with timeout support
 */
const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LEETCODE_CONFIG.TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new LeetCodeAPIError(
                `API returned ${response.status}`,
                response.status
            );
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

/**
 * Retry mechanism with exponential backoff
 */
const fetchWithRetry = async (url, retries = LEETCODE_CONFIG.MAX_RETRIES) => {
    let lastError;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            logger.debug(`LeetCode API call: ${url} (attempt ${attempt + 1}/${retries})`);
            return await fetchWithTimeout(url);
        } catch (error) {
            lastError = error;

            if (attempt === retries - 1) {
                throw lastError;
            }

            // Exponential backoff: 1s, 2s, 4s
            const backoffMs = Math.pow(2, attempt) * 1000;
            logger.warn(
                `LeetCode API retry after ${backoffMs}ms:`,
                error.message
            );
            await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
    }

    throw lastError;
};

/**
 * Validate response has required fields
 */
const validateResponse = (data, requiredFields) => {
    if (!data || typeof data !== "object") {
        throw new LeetCodeAPIError(ERROR_MESSAGES.INVALID_RESPONSE, 502);
    }

    for (const field of requiredFields) {
        if (!(field in data)) {
            throw new LeetCodeAPIError(
                `Invalid response: missing field "${field}"`,
                502
            );
        }
    }

    return data;
};

/**
 * Get user profile (basic info)
 */
export const fetchUserProfile = async (username) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.PROFILE(username));

        validateResponse(data, ["username", "ranking"]);

        return {
            username: data.username,
            name: data.name || null,
            profileUrl: data.profileUrl || null,
            ranking: data.ranking || 0,
            reputation: data.reputation || 0,
            avatar: data.avatar || null,
            badge_count: data.badge_count || 0,
        };
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch profile for ${username}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Get user solved statistics
 */
export const fetchUserSolved = async (username) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.SOLVED(username));

        validateResponse(data, ["totalSolved"]);

        return {
            totalSolved: data.totalSolved || 0,
            easySolved: data.easySolved || 0,
            mediumSolved: data.mediumSolved || 0,
            hardSolved: data.hardSolved || 0,
            acceptanceRate: data.acceptanceRate || 0,
        };
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch solved stats for ${username}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Get user badges
 */
export const fetchUserBadges = async (username) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.BADGES(username));

        const badges = Array.isArray(data) ? data : data.badges || [];

        return badges.map((badge) => ({
            name: badge.name || "",
            displayName: badge.displayName || "",
            rarity: badge.rarity || "common",
            icon: badge.icon || null,
        }));
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch badges for ${username}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Get full profile details
 */
export const fetchFullProfile = async (username) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.FULL_PROFILE(username));
        return data;
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch full profile for ${username}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Get user submissions
 */
export const fetchUserSubmissions = async (username) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.SUBMISSIONS(username));

        validateResponse(data, ["submission"]);

        return Array.isArray(data.submission) ? data.submission : [];
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch submissions for ${username}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Get problem details
 */
export const fetchProblemDetails = async (titleSlug) => {
    try {
        const data = await fetchWithRetry(ENDPOINTS.PROBLEM_DETAILS(titleSlug));
        return data;
    } catch (error) {
        throw new LeetCodeAPIError(
            `Failed to fetch problem details for ${titleSlug}`,
            error.statusCode || 502,
            error
        );
    }
};

/**
 * Fetch all stats in parallel with graceful degradation
 */
export const fetchAllStats = async (username) => {
    const results = await Promise.allSettled([
        fetchUserProfile(username),
        fetchUserSolved(username),
        fetchUserBadges(username),
    ]);

    const [profileResult, solvedResult, badgesResult] = results;

    const response = {
        profile: profileResult.status === "fulfilled" ? profileResult.value : null,
        stats: solvedResult.status === "fulfilled" ? solvedResult.value : null,
        badges: badgesResult.status === "fulfilled" ? badgesResult.value : [],
    };

    // Log partial failures
    if (profileResult.status === "rejected") {
        logger.warn("Failed to fetch profile:", profileResult.reason.message);
    }
    if (solvedResult.status === "rejected") {
        logger.warn("Failed to fetch stats:", solvedResult.reason.message);
    }
    if (badgesResult.status === "rejected") {
        logger.warn("Failed to fetch badges:", badgesResult.reason.message);
    }

    // If all failed, throw error
    if (!response.profile && !response.stats && !response.badges) {
        throw new LeetCodeAPIError(
            `Could not fetch any data for ${username}`,
            502
        );
    }

    return response;
};
