/**
 * LeetCode Configuration & Constants
 */

export const LEETCODE_CONFIG = {
    API_BASE_URL: process.env.LEETCODE_API_BASE_URL || "https://alfa-leetcode-api.onrender.com",
    TIMEOUT_MS: parseInt(process.env.LEETCODE_API_TIMEOUT || "15000"),
    MAX_RETRIES: parseInt(process.env.LEETCODE_API_RETRIES || "3"),
    CACHE_TTL: parseInt(process.env.LEETCODE_CACHE_TTL || "3600"), // 1 hour
    BATCH_SIZE: parseInt(process.env.LEETCODE_BATCH_SIZE || "10"),
};

export const ENDPOINTS = {
    PROFILE: (username) => `${LEETCODE_CONFIG.API_BASE_URL}/${username}`,
    FULL_PROFILE: (username) => `${LEETCODE_CONFIG.API_BASE_URL}/${username}/profile`,
    BADGES: (username) => `${LEETCODE_CONFIG.API_BASE_URL}/${username}/badges`,
    SOLVED: (username) => `${LEETCODE_CONFIG.API_BASE_URL}/${username}/solved`,
    SUBMISSIONS: (username) => `${LEETCODE_CONFIG.API_BASE_URL}/${username}/acSubmission`,
    PROBLEM_DETAILS: (titleSlug) => `${LEETCODE_CONFIG.API_BASE_URL}/select?titleSlug=${titleSlug}`,
};

export const CACHE_KEYS = {
    PROFILE: (username) => `leetcode:profile:${username}`,
    STATS: (username) => `leetcode:stats:${username}`,
    BADGES: (username) => `leetcode:badges:${username}`,
    SUBMISSIONS: (username) => `leetcode:submissions:${username}`,
};

export const ERROR_MESSAGES = {
    INVALID_USERNAME: "Invalid LeetCode username provided",
    USERNAME_REQUIRED: "LeetCode username is required",
    USER_NOT_FOUND: "User profile not found",
    PROFILE_NOT_LINKED: "LeetCode profile not linked to user account",
    USER_ID_REQUIRED: "User ID is required",
    API_ERROR: "Failed to fetch LeetCode data",
    NETWORK_ERROR: "Network error while fetching LeetCode data",
    TIMEOUT_ERROR: "Request to LeetCode API timed out",
    INVALID_RESPONSE: "Invalid response from LeetCode API",
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
