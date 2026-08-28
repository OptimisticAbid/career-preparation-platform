import logger from "../../utils/logger.js";

/**
 * Enhanced error handling for LeetCode API
 */
export class LeetCodeAPIError extends Error {
    constructor(message, statusCode = 500, originalError = null) {
        super(message);
        this.name = "LeetCodeAPIError";
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

/**
 * Validation error
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 422;
    }
}

/**
 * Handle API errors with proper logging
 */
export const handleAPIError = (error, context = "") => {
    logger.error(`LeetCode API Error [${context}]:`, {
        message: error.message,
        status: error.statusCode || error.status,
        stack: error.stack,
    });

    if (error.name === "AbortError") {
        throw new LeetCodeAPIError("Request timeout", 504);
    }

    if (error instanceof LeetCodeAPIError) {
        throw error;
    }

    if (error instanceof ValidationError) {
        throw error;
    }

    throw new LeetCodeAPIError("Failed to fetch LeetCode data", 500, error);
};
