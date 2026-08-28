import asyncHandler from "../../utils/asyncHandler.js";
import { leetcodeStatsService, leetcodeSyncService } from "./leetcode.service.js";
import { LeetCodeAPIError, ValidationError } from "./leetcode.errors.js";
import { HTTP_STATUS } from "./leetcode.config.js";
import leetcodeLogger from "./leetcode.logger.js";

/**
 * Get LeetCode stats for the authenticated user
 * GET /api/leetcode/stats
 */
export const leetcodeStatsController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "User not authenticated",
        });
    }

    try {
        const stats = await leetcodeStatsService(userId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "LeetCode stats retrieved successfully",
            data: stats,
            cached: false, // Can be enhanced to track cache hits
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: error.message,
            });
        }

        if (error instanceof LeetCodeAPIError) {
            return res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }

        leetcodeLogger.error("Unexpected error in stats controller", {
            userId,
            error: error.message,
        });

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve LeetCode stats",
        });
    }
});

/**
 * Sync LeetCode submissions with database
 * POST /api/leetcode/sync
 */
export const leetcodeSyncController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "User not authenticated",
        });
    }

    try {
        const syncResult = await leetcodeSyncService(userId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "LeetCode submissions synced successfully",
            data: syncResult,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: error.message,
            });
        }

        if (error instanceof LeetCodeAPIError) {
            return res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }

        leetcodeLogger.error("Unexpected error in sync controller", {
            userId,
            error: error.message,
        });

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to sync LeetCode submissions",
        });
    }
});

/**
 * Health check endpoint
 * GET /api/leetcode/health
 */
export const healthCheckController = asyncHandler(async (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "LeetCode module is healthy",
        timestamp: new Date().toISOString(),
    });
});