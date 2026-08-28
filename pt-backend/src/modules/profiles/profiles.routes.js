import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getUserProfileController, updateUserProfileController } from "./profiles.controller.js";
import { validateUpdateProfile } from "./profiles.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getUserProfileController);

router.put("/", validateUpdateProfile, updateUserProfileController);

export default router;