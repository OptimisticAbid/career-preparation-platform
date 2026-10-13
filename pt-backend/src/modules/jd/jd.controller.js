import asyncHandler from "../../utils/asyncHandler.js";
import { getUserJobDescriptions, uploadJobDescription } from "./jd.service.js";

export const uploadJobDescriptionController = asyncHandler(async (req, res) => {
    if(!req.file) {
        const error = new Error("No job description file uploaded.");
        error.statusCode = 400;
        throw error;
    }

    const document = await uploadJobDescription(req.user.id, req.file);
    res.status(201).json({ success: true, data: document });
});

export const listJobDescriptionsController = asyncHandler(async (req, res) => {
    const documents = await getUserJobDescriptions(req.user.id);
    res.status(200).json({ success: true, data: documents });
});
