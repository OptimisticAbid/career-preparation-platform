import { and, asc, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { problems } from "../../db/schema/problems.schema.js";

const sortColumns = {
    problemName: problems.problemName,
    difficulty: problems.difficulty,
    status: problems.status,
    createdAt: problems.createdAt,
    solvedAt: problems.solvedAt,
};

export const findByPlatformSource = async (userId, platform, sourceProblemId) => {
    const [problem] = await db.select({ id: problems.id }).from(problems).where(and(
        eq(problems.userId, userId),
        eq(problems.platform, platform),
        eq(problems.sourceProblemId, sourceProblemId),
    )).limit(1);
    return problem;
};

export const create = async (data) => {
    const [problem] = await db.insert(problems).values(data).returning({
        problemName: problems.problemName,
        difficulty: problems.difficulty,
        status: problems.status,
        platform: problems.platform,
    });
    return problem;
};

export const findAll = async (userId, filters) => {
    const conditions = [eq(problems.userId, userId)];
    if (filters.difficulty !== undefined) conditions.push(eq(problems.difficulty, filters.difficulty));
    if (filters.status) conditions.push(eq(problems.status, filters.status));
    if (filters.pattern) conditions.push(eq(problems.pattern, filters.pattern));
    if (filters.needsRevision !== undefined) conditions.push(eq(problems.needsRevison, filters.needsRevision));
    if (filters.search) conditions.push(ilike(problems.problemName, `%${filters.search}%`));

    const sortColumn = sortColumns[filters.sortBy] ?? problems.createdAt;
    const sortDirection = filters.sortOrder === "asc" ? asc : desc;

    return db.select().from(problems)
        .where(and(...conditions))
        .orderBy(sortDirection(sortColumn))
        .limit(filters.limit)
        .offset(filters.offset);
};

export const findById = async (userId, problemId) => {
    const [problem] = await db.select().from(problems).where(and(
        eq(problems.id, problemId),
        eq(problems.userId, userId),
    )).limit(1);
    return problem;
};

export const updateById = async (userId, problemId, data) => {
    const [problem] = await db.update(problems)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(problems.id, problemId), eq(problems.userId, userId)))
        .returning();
    return problem;
};

export const deleteById = async (userId, problemId) => {
    const [problem] = await db.delete(problems)
        .where(and(eq(problems.id, problemId), eq(problems.userId, userId)))
        .returning({ id: problems.id, problemName: problems.problemName });
    return problem;
};

export const deleteByIds = async (userId, problemIds) => db.delete(problems)
    .where(and(eq(problems.userId, userId), inArray(problems.id, problemIds)))
    .returning({ id: problems.id, problemName: problems.problemName });
