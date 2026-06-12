import asyncHandler from "../../utils/asyncHandler.js";

const validDifficulties = ["easy", "medium", "hard"];
const validStatuses = ["solved", "unsolved", "revising"];

export const validateCreateProblem = asyncHandler(async (req, res, next) => {
    const { problemName, difficulty, status } = req.body;
    
    if (!problemName || !difficulty || !status) {
        throw new Error("problemName, difficulty, and status are required");
    }

    if (!validDifficulties.includes(difficulty.toLowerCase())) {
        throw new Error("Invalid difficulty");
    }
    
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }

    next();
});

export const validateUpdateProblem = asyncHandler(async (req, res, next) => {
    const { difficulty, status } = req.body;

    if (difficulty && !validDifficulties.includes(difficulty)) {
        throw new Error("Invalid difficulty");
    }

    if (status && !validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }

    next();
});
