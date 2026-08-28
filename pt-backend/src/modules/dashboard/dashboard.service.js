import { db } from "../../db/index.js";
import { problems } from "../../db/schema/problems.schema.js";
import { users } from "../../db/schema/users.schema.js";
import { eq, sql, desc } from "drizzle-orm";

export const getDashboardOverviewService = async (userId) => {
    try {
        const [userInfo] = await db.select({
            name: users.name,
            email: users.email
        }).from(users).where(eq(users.id, userId));

        const totalProblems = await db.select({
            count: sql`COUNT(*)`
        }).from(problems).where(eq(problems.userId, userId));

        const solvedProblems = await db.select({
            count: sql`COUNT(*)`
        }).from(problems).where(
            sql`${problems.userId} = ${userId} AND ${problems.status} = 'solved'`
        );

        return {
            user: userInfo,
            totalProblems: totalProblems[0]?.count || 0,
            solvedProblems: solvedProblems[0]?.count || 0
        };
    } catch (error) {
        throw new Error(`Failed to get dashboard overview: ${error.message}`);
    }
};

export const getUserStatsService = async (userId) => {
    try {
        const stats = await db.select({
            totalProblems: sql`COUNT(*)`,
            solvedCount: sql`SUM(CASE WHEN ${problems.status} = 'solved' THEN 1 ELSE 0 END)`,
            unsolvedCount: sql`SUM(CASE WHEN ${problems.status} = 'unsolved' THEN 1 ELSE 0 END)`,
            revisingCount: sql`SUM(CASE WHEN ${problems.status} = 'revising' THEN 1 ELSE 0 END)`,
            needsRevisionCount: sql`SUM(CASE WHEN ${problems.needsRevison} = true THEN 1 ELSE 0 END)`,
            easyCount: sql`SUM(CASE WHEN ${problems.difficulty} = 1 THEN 1 ELSE 0 END)`,
            mediumCount: sql`SUM(CASE WHEN ${problems.difficulty} = 2 THEN 1 ELSE 0 END)`,
            hardCount: sql`SUM(CASE WHEN ${problems.difficulty} = 3 THEN 1 ELSE 0 END)`,
            avgTimeTaken: sql`AVG(${problems.timeTaken})`
        }).from(problems).where(eq(problems.userId, userId));

        return stats[0] || {};
    } catch (error) {
        throw new Error(`Failed to get user stats: ${error.message}`);
    }
};

export const getRecentActivityService = async (userId, limit = 10) => {
    try {
        const recentProblems = await db.select({
            id: problems.id,
            problemName: problems.problemName,
            difficulty: problems.difficulty,
            status: problems.status,
            createdAt: problems.createdAt,
            solvedAt: problems.solvedAt
        }).from(problems)
            .where(eq(problems.userId, userId))
            .orderBy(desc(problems.createdAt))
            .limit(limit);

        return recentProblems;
    } catch (error) {
        throw new Error(`Failed to get recent activity: ${error.message}`);
    }
};

export const getLearningProgressService = async (userId) => {
    try {
        const totalProblems = await db.select({
            count: sql`COUNT(*)`
        }).from(problems).where(eq(problems.userId, userId));

        const solvedProblems = await db.select({
            count: sql`COUNT(*)`
        }).from(problems).where(
            sql`${problems.userId} = ${userId} AND ${problems.status} = 'solved'`
        );

        const total = totalProblems[0]?.count || 0;
        const solved = solvedProblems[0]?.count || 0;
        const progressPercentage = total === 0 ? 0 : Math.round((solved / total) * 100);

        return {
            total,
            solved,
            remaining: total - solved,
            progressPercentage
        };
    } catch (error) {
        throw new Error(`Failed to get learning progress: ${error.message}`);
    }
};
