import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { problems } from "../../db/schema/problems.schema.js";
import { users } from "../../db/schema/users.schema.js";

export const findUserSummary = async (userId) => {
    const [user] = await db.select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, userId));
    return user;
};

export const countProblems = async (userId, status) => {
    const where = status
        ? sql`${problems.userId} = ${userId} AND ${problems.status} = ${status}`
        : eq(problems.userId, userId);
    const [result] = await db.select({ count: sql`COUNT(*)` }).from(problems).where(where);
    return Number(result?.count ?? 0);
};

export const getProblemStats = async (userId) => {
    const [stats] = await db.select({
        totalProblems: sql`COUNT(*)`,
        solvedCount: sql`SUM(CASE WHEN ${problems.status} = 'solved' THEN 1 ELSE 0 END)`,
        unsolvedCount: sql`SUM(CASE WHEN ${problems.status} = 'unsolved' THEN 1 ELSE 0 END)`,
        revisingCount: sql`SUM(CASE WHEN ${problems.status} = 'revising' THEN 1 ELSE 0 END)`,
        needsRevisionCount: sql`SUM(CASE WHEN ${problems.needsRevison} = true THEN 1 ELSE 0 END)`,
        easyCount: sql`SUM(CASE WHEN ${problems.difficulty} = 1 THEN 1 ELSE 0 END)`,
        mediumCount: sql`SUM(CASE WHEN ${problems.difficulty} = 2 THEN 1 ELSE 0 END)`,
        hardCount: sql`SUM(CASE WHEN ${problems.difficulty} = 3 THEN 1 ELSE 0 END)`,
        avgTimeTaken: sql`AVG(${problems.timeTaken})`,
    }).from(problems).where(eq(problems.userId, userId));

    return stats ?? {};
};

export const findRecentProblems = async (userId, limit) => db.select({
    id: problems.id,
    problemName: problems.problemName,
    difficulty: problems.difficulty,
    status: problems.status,
    createdAt: problems.createdAt,
    solvedAt: problems.solvedAt,
}).from(problems)
    .where(eq(problems.userId, userId))
    .orderBy(desc(problems.createdAt))
    .limit(limit);
