import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { createMatchController } from "./matching.controller.js";
import { validateMatchRequest } from "./matching.validation.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validateMatchRequest,
    createMatchController
);

export default router;
