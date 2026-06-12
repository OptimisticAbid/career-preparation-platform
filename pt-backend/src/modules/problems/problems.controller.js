import { eq } from "drizzle-orm"
import asyncHandler from "../../utils/asyncHandler.js"
import { db } from "../../db/index.js"
import { users } from "../../db/schema/users.schema.js"
import { problems } from "../../db/schema/problems.schema.js"
import { createProblemService, deleteProblemService, fetchAllProblemsService, getProblemByIdService, updateProblemService, deleteBatchProblemsService } from "./problems.service.js"

const createProblemController = asyncHandler( async(req, res) => {
    const userId = req.user.id

    if(!userId) {
        res.status(400)
        throw new Error("User not found")
    }

    const problemData = {
        problemName: req.body.problemName,
        difficulty: req.body.difficulty,
        status: req.body.status,
        platform: req.body.platform,
        platformUrl: req.body.platformUrl,
        pattern: req.body.pattern,
        notes: req.body.notes,
        needsRevison: req.body.needsRevison,
        solvedAt: req.body.solvedAt,
        timeTaken: req.body.timeTaken
    };

    const problem = await createProblemService(userId, problemData)
    
    res.status(201).json({
        success: true,
        message: "Problem created successfully",
        data: problem
    });
})

const getProblemByIdController = asyncHandler( async(req, res) => {
    const userId = req.user.id;
    const problemId = req.params.id; 

    const problem = await getProblemByIdService(userId,problemId)

    res.status(200).json({
        success: true,
        message: "Problem fetched successfully",
        data: problem
    });
})

const fetchAllProblemsController = asyncHandler(async (req, res) => {
    const userId  = req.user.id;

    const filters = {
        difficulty: req.query.difficulty,
        status: req.query.status,
        pattern: req.query.pattern,
        needsRevision: req.query.needsRevision === "true" ? true : req.query.needsRevision === "false" ? false : undefined,
        search: req.query.search,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
    };

    const userProblems = await fetchAllProblemsService(userId, filters)

    res.status(200).json({
        success: true,
        message: "Problems fetched successfully",
        data: userProblems
    });
});

const updateProblemController = asyncHandler( async(req, res) => {
    const userId = req.user.id

    const problemId = req.params.id

    const updatedData = {
        problemName: req.body.problemName,
        difficulty: req.body.difficulty,
        status: req.body.status,
        platform: req.body.platform,
        platformUrl: req.body.platformUrl,
        pattern: req.body.pattern,
        notes: req.body.notes,
        needsRevison: req.body.needsRevison,
        solvedAt: req.body.solvedAt,
        timeTaken: req.body.timeTaken
    }

    const updatedProblem = await updateProblemService(userId,problemId, updatedData);

    res.status(200).json({
        success: true,
        message: "Problem updated successfully",
        data: updatedProblem
    });
})

const deleteProblemController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const problemId = req.params.id;

    const deletedProblem = await deleteProblemService(userId, problemId);

    res.status(200).json({
        success: true,
        message: "Problem deleted successfully",
        data: deletedProblem
    });
});

const deleteBatchProblemsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { problemIds } = req.body;

    console.log("Received problemIds for deletion:", problemIds); // Debugging log
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        res.status(400);
        throw new Error("problemIds must be a non-empty array");
    }

    const deletedProblems = await deleteBatchProblemsService(userId, problemIds);

    res.status(200).json({
        success: true,
        message: `${deletedProblems.length} problems deleted successfully`,
        data: deletedProblems
    });
});

export {createProblemController, fetchAllProblemsController, getProblemByIdController, updateProblemController, deleteProblemController, deleteBatchProblemsController}