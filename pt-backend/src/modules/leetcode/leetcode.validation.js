export const validateUsername = (username) => {
    if (!username || typeof username !== "string") {
        throw new Error("LeetCode username is required");
    }

    const trimmed = username.trim();

    if (trimmed.length === 0) {
        throw new Error("Invalid LeetCode username");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        throw new Error("Username contains invalid characters");
    }

    return trimmed;
};

export const validateUserId = (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return userId;
};

export const validateSyncRequest = (userId) => {
    return validateUserId(userId);
};

export const validateStatsRequest = (userId) => {
    return validateUserId(userId);
};

export const validateBatchSize = (items, maxSize = 100) => {
    if (!Array.isArray(items)) {
        throw new Error("Items must be an array");
    }

    if (items.length > maxSize) {
        throw new Error(`Batch size exceeds limit of ${maxSize}`);
    }

    return items;
};
