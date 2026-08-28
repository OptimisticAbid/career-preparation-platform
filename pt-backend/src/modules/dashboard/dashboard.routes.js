import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
    getDashboardDataController,
    getDashboardStatsController,
    getLearningProgressController,
    getRecentActivityController
} from "./dashboard.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Dashboard endpoints
router.get("/", getDashboardDataController);
router.get("/stats", getDashboardStatsController);
router.get("/progress", getLearningProgressController);
router.get("/activity", getRecentActivityController);

export default router;