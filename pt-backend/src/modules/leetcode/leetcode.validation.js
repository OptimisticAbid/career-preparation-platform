import { ValidationError, LeetCodeAPIError } from "./leetcode.errors.js";
import { ERROR_MESSAGES } from "./leetcode.config.js";

/**
 * Validate username format
 */
export const validateUsername = (username) => {
    if (!username || typeof username !== "string") {
        throw new ValidationError(ERROR_MESSAGES.USERNAME_REQUIRED);
    }

    const trimmed = username.trim();

    if (trimmed.length === 0) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_USERNAME);
    }

    if (trimmed.length > 50) {
        throw new ValidationError("Username too long (max 50 characters)");
    }

    // LeetCode usernames are alphanumeric with hyphens and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        throw new ValidationError(
            "Username contains invalid characters"
        );
    }

    return trimmed;
};

/**
 * Validate user ID
 */
export const validateUserId = (userId) => {
    if (!userId) {
        throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
    }

    return userId;
};

/**
 * Validate sync request
 */
export const validateSyncRequest = (userId) => {
    validateUserId(userId);
    return userId;
};

/**
 * Validate stats request
 */
export const validateStatsRequest = (userId) => {
    validateUserId(userId);
    return userId;
};

/**
 * Validate batch operation
 */
export const validateBatchSize = (items, maxSize = 100) => {
    if (!Array.isArray(items)) {
        throw new ValidationError("Items must be an array");
    }

    if (items.length > maxSize) {
        throw new ValidationError(
            `Batch size exceeds limit of ${maxSize}`
        );
    }

    return items;
};
