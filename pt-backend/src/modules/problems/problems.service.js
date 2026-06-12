import { and, eq, like, desc, asc, ilike, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { problems } from "../../db/schema/problems.schema.js"
import asyncHandler from "../../utils/asyncHandler.js";

// Utility: Convert difficulty text to number
const normalizeDifficulty = (difficulty) => {
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    return difficultyMap[difficulty?.toLowerCase()]
};

export const createProblemService = async (userId, problemData) => {
    const [problem] = await db.insert(problems)
        .values({
            userId,
            problemName: problemData.problemName,
            difficulty: normalizeDifficulty(problemData.difficulty),
            status: problemData.status,
            platform: problemData.platform || null,
            platformUrl: problemData.platformUrl || null,
            pattern: problemData.pattern || null,
            notes: problemData.notes || null,
            needsRevison: problemData.needsRevison || false,
            solvedAt: problemData.solvedAt || null,
            timeTaken: problemData.timeTaken || null
        })
        .returning({
            problemName: problems.problemName,
            difficulty: problems.difficulty,
            status: problems.status,
            platform: problems.platform,
        });

    if (!problem) {
        throw new Error("Failed to create problem");
    }

    return problem;
};

export const fetchAllProblemsService = async(userId, filters = {}) => {
    const { 
        difficulty, 
        status, 
        pattern, 
        needsRevision, 
        search,
        sortBy,
        sortOrder,
        limit = 20,
        offset = 0 
    } = filters
    
    let query = db.select().from(problems).where(eq(problems.userId, userId))

    if (difficulty) {
        query = query.where(eq(problems.difficulty, normalizeDifficulty(difficulty)))
    }

    if (status) {
        query = query.where(eq(problems.status, status))
    }

    if (pattern) {
        query = query.where(eq(problems.pattern, pattern))
    }

    if (needsRevision !== undefined) {
        query = query.where(eq(problems.needsRevison, needsRevision))
    }

    if (search) {
        query = query.where(ilike(problems.problemName, `%${search}%`));
    }
    
     // Sorting
    if (sortBy && sortOrder) {
        const sortColumn = problems[sortBy] || problems.createdAt;
        const sortDirection = sortOrder.toLowerCase() === "asc" ? asc : desc;
        query = query.orderBy(sortDirection(sortColumn));
    }

    // Pagination
    query = query.limit(limit).offset(offset);

    const userProblems = await query

    if(!userProblems) {
        throw new Error("Failed to fetch problems")
    }

    return userProblems
}

export const getProblemByIdService = async (userId, problemId) => {
    const problem = await db.select().from(problems).where(
        and(
            eq(problems.id, problemId),
            eq(problems.userId, userId)
        )
    )

    if(!problem || problem.length === 0) {
        throw new Error("The problem does not exist")
    }

    return problem[0]
}

export const updateProblemService = async(userId, problemId, updateData) => {
    
    const [existingProblem] = await db.select().from(problems).where(
        and(
            eq(problems.id,problemId),
            eq(problems.userId, userId)
        )
    )

    if(!existingProblem) {
        throw new Error("Problem not found or unauthorized")
    }

    const updatePayload = {};
    
    if (updateData.problemName !== undefined) updatePayload.problemName = updateData.problemName;
    if (updateData.difficulty !== undefined) updatePayload.difficulty = normalizeDifficulty(updateData.difficulty);
    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.platform !== undefined) updatePayload.platform = updateData.platform;
    if (updateData.platformUrl !== undefined) updatePayload.platformUrl = updateData.platformUrl;
    if (updateData.pattern !== undefined) updatePayload.pattern = updateData.pattern;
    if (updateData.notes !== undefined) updatePayload.notes = updateData.notes;
    if (updateData.needsRevison !== undefined) updatePayload.needsRevison = updateData.needsRevison;
    if (updateData.solvedAt !== undefined) updatePayload.solvedAt = updateData.solvedAt;
    if (updateData.timeTaken !== undefined) updatePayload.timeTaken = updateData.timeTaken;

    const [updatedProblem] = await db.update(problems)
                        .set(updatePayload)
                        .where(eq(problems.id, problemId))
                        .returning()

    if(!updatedProblem) {
        throw new Error("Failed to update problem")
    }
    
    return updatedProblem
};

export const deleteProblemService =  async(userId, problemId) => {
    
    const [existingProblem] = await db.select().from(problems).where(
        and(
            eq(problems.id,problemId),
            eq(problems.userId, userId)
        )
    )

    if(!existingProblem) {
        throw new Error("Problem not found or unauthorized")
    }

    const [deletedProblem] = await db.delete(problems)
                        .where(
                            and(
                                eq(problems.id, problemId),
                                eq(problems.userId, userId)
                            )
                        )
                        .returning({
                            id: problems.id,
                            problemName: problems.problemName,
                        })

    if(!deletedProblem) {
        throw new Error("Failed to delete problem")
    }
    
    return deletedProblem
}

export const deleteBatchProblemsService = async(userId, problemIds) =>{
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new Error("Problem IDs must be a non-empty array");
    }

    const deletedProblems = await db.delete(problems)
                        .where(
                            and(
                                eq(problems.userId, userId),
                                inArray(problems.id, problemIds)
                            )
                        )
                        .returning({
                            id: problems.id,
                            problemName: problems.problemName,
                        })

    if(!deletedProblems) {
        throw new Error("Failed to delete problems")
    }

    return deletedProblems  
};