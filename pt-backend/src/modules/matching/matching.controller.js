import asyncHandler from "../../utils/asyncHandler.js";
import { matchResumeToJdService } from "./matching.service.js";

export const createMatchController = asyncHandler(async (req, res) => {
    const { resumeId, jdId } = req.validatedBody;
    const match = await matchResumeToJdService(resumeId, jdId, req.user.id);

    return res.status(201).json({
        success: true,
        data: match
    });
});
