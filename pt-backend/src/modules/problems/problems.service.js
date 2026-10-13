import * as problemsRepository from "./problems.repository.js";

const difficultyValues = { easy: 1, medium: 2, hard: 3 };

const normalizeDifficulty = (difficulty) => {
    if (difficulty === undefined || difficulty === null) return undefined;
    if (typeof difficulty === "number") return difficulty;
    return difficultyValues[difficulty.toLowerCase()];
};

export const problemExistsService = async (userId, platform, sourceProblemId) => {
    const problem = await problemsRepository.findByPlatformSource(userId, platform, sourceProblemId);
    return Boolean(problem);
};

export const createProblemService = async (userId, problemData) => {
    if (problemData.sourceProblemId && problemData.platform) {
        const existing = await problemsRepository.findByPlatformSource(
            userId,
            problemData.platform,
            problemData.sourceProblemId,
        );
        if (existing) return { skipped: true, problem: existing };
    }

    const difficulty = normalizeDifficulty(problemData.difficulty);
    if (difficulty === undefined) throw new Error("Invalid difficulty");

    const problem = await problemsRepository.create({
        userId,
        problemName: problemData.problemName,
        difficulty,
        sourceProblemId: problemData.sourceProblemId,
        status: problemData.status,
        platform: problemData.platform || null,
        platformUrl: problemData.platformUrl || null,
        pattern: problemData.pattern || null,
        notes: problemData.notes || null,
        needsRevison: problemData.needsRevison ?? problemData.needsRevision ?? false,
        solvedAt: problemData.solvedAt || null,
        timeTaken: problemData.timeTaken ?? null,
    });

    if (!problem) throw new Error("Failed to create problem");
    return problem;
};

export const fetchAllProblemsService = async (userId, filters = {}) => {
    const difficulty = normalizeDifficulty(filters.difficulty);
    if (filters.difficulty && difficulty === undefined) throw new Error("Invalid difficulty filter");

    return problemsRepository.findAll(userId, {
        ...filters,
        difficulty,
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc",
        limit: Math.min(Math.max(Number(filters.limit) || 20, 1), 100),
        offset: Math.max(Number(filters.offset) || 0, 0),
    });
};

export const getProblemByIdService = async (userId, problemId) => {
    const problem = await problemsRepository.findById(userId, problemId);
    if (!problem) throw new Error("The problem does not exist");
    return problem;
};

export const updateProblemService = async (userId, problemId, updateData) => {
    const updatePayload = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    if (updatePayload.difficulty !== undefined) {
        updatePayload.difficulty = normalizeDifficulty(updatePayload.difficulty);
        if (updatePayload.difficulty === undefined) throw new Error("Invalid difficulty");
    }
    if (Object.keys(updatePayload).length === 0) throw new Error("No fields provided");

    const problem = await problemsRepository.updateById(userId, problemId, updatePayload);
    if (!problem) throw new Error("Problem not found or unauthorized");
    return problem;
};

export const deleteProblemService = async (userId, problemId) => {
    const problem = await problemsRepository.deleteById(userId, problemId);
    if (!problem) throw new Error("Problem not found or unauthorized");
    return problem;
};

export const deleteBatchProblemsService = async (userId, problemIds) => {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new Error("Problem IDs must be a non-empty array");
    }
    return problemsRepository.deleteByIds(userId, problemIds);
};
