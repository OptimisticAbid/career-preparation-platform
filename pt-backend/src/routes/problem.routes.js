import express from 'express'
import {createNewProblem, fetchProblems}  from "../controllers/problems.controller.js"
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/", authMiddleware, createNewProblem);

router.get("/", authMiddleware, fetchProblems)

export default router;