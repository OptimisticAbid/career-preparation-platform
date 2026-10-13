import * as dashboardRepository from "./dashboard.repository.js";

export const getDashboardOverviewService = async (userId) => {
    const [user, totalProblems, solvedProblems] = await Promise.all([
        dashboardRepository.findUserSummary(userId),
        dashboardRepository.countProblems(userId),
        dashboardRepository.countProblems(userId, "solved"),
    ]);

    return { user, totalProblems, solvedProblems };
};

export const getUserStatsService = (userId) => dashboardRepository.getProblemStats(userId);

export const getRecentActivityService = (userId, limit = 10) =>
    dashboardRepository.findRecentProblems(userId, limit);

export const getLearningProgressService = async (userId) => {
    const [total, solved] = await Promise.all([
        dashboardRepository.countProblems(userId),
        dashboardRepository.countProblems(userId, "solved"),
    ]);

    return {
        total,
        solved,
        remaining: total - solved,
        progressPercentage: total === 0 ? 0 : Math.round((solved / total) * 100),
    };
};
