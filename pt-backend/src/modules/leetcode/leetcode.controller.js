import asyncHandler from "../../utils/asyncHandler.js";
import { leetcodeStatsService, leetcodeSyncService } from "./leetcode.service.js";

export const leetcodeStatsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const stats = await leetcodeStatsService(userId);

    res.status(200).json({
        success: true,
        message: "LeetCode stats retrieved successfully",
        data: stats,
    });
});

export const leetcodeSyncController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const syncResult = await leetcodeSyncService(userId);

    res.status(200).json({
        success: true,
        message: "LeetCode submissions synced successfully",
        data: syncResult,
    });
});

export const healthCheckController = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "LeetCode module is healthy",
        timestamp: new Date().toISOString(),
    });
});