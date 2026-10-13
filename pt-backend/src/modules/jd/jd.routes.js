import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { uploadDocument } from "../../middlewares/upload.middleware.js";
import {
    listJobDescriptionsController,
    uploadJobDescriptionController,
} from "./jd.controller.js";

const router = express.Router();

router.get("/", authMiddleware, listJobDescriptionsController);

router.post("/upload", authMiddleware, uploadDocument.single("jd"), uploadJobDescriptionController);

export default router;
