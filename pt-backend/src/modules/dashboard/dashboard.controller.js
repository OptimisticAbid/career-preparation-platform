import asyncHandler from "../../utils/asyncHandler.js";
import {
    getDashboardOverviewService,
    getUserStatsService,
    getRecentActivityService,
    getLearningProgressService
} from "./dashboard.service.js";

export const getDashboardDataController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [overview, stats, activity, progress] = await Promise.all([
        getDashboardOverviewService(userId),
        getUserStatsService(userId),
        getRecentActivityService(userId),
        getLearningProgressService(userId)
    ]);

    res.status(200).json({
        success: true,
        message: "Dashboard data retrieved successfully",
        data: {
            overview,
            stats,
            recentActivity: activity, 
            progress
        }
    });
});

export const getDashboardStatsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const stats = await getUserStatsService(userId);

    res.status(200).json({
        success: true,
        message: "User statistics retrieved successfully",
        data: stats
    });
});

export const getLearningProgressController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const progress = await getLearningProgressService(userId);

    res.status(200).json({
        success: true,
        message: "Learning progress retrieved successfully",
        data: progress
    });
});

export const getRecentActivityController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const activity = await getRecentActivityService(userId);

    res.status(200).json({
        success: true,
        message: "Recent activity retrieved successfully",
        data: activity
    });
});
