import express from 'express'
import {updateProblemController, createProblemController, deleteProblemController, getProblemByIdController, fetchAllProblemsController, deleteBatchProblemsController}  from "./problems.controller.js"
import authMiddleware from '../../middlewares/auth.middleware.js';
import { validateCreateProblem, validateUpdateProblem  } from './problems.validation.js';

const router = express.Router();

router.use(authMiddleware)
// route -> authMiddleware -> validate -> controller -> service

router.post("/", validateCreateProblem, createProblemController);

// Get all problems with filters, search, sorting, and pagination
router.get("/", fetchAllProblemsController);

// Get a specific problem by ID
router.get("/:id", getProblemByIdController);

// Update a problem
router.put("/:id", validateUpdateProblem, updateProblemController);

// Delete a single problem
router.delete("/:id", deleteProblemController);

// Delete multiple problems
router.delete("/batch/delete", deleteBatchProblemsController);


export default router;