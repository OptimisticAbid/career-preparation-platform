import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
    leetcodeStatsController,
    leetcodeSyncController,
    healthCheckController,
} from "./leetcode.controller.js";

const router = express.Router();

/**
 * Public health check
 */
router.get("/health", healthCheckController);

/**
 * Protected routes - require authentication
 */
router.use(authMiddleware);

/**
 * Get comprehensive LeetCode stats (profile, solved, badges)
 * GET /api/leetcode/stats
 */
router.get("/stats", leetcodeStatsController);

/**
 * Sync LeetCode submissions with database
 * POST /api/leetcode/sync
 */
router.post("/sync", leetcodeSyncController);

export default router;