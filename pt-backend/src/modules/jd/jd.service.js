import { unlink } from "node:fs/promises";
import { parseDocument } from "../../services/document-parser/document.parser.js";
import { structuredDataFromText } from "./jd.analysis.js";
import * as jdRepository from "./jd.repository.js";

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const removeUpload = async (filePath) => {
    try {
        await unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") console.error("Unable to remove JD upload:", error.message);
    }
};

export const uploadJobDescription = async (userId, file) => {
    if (!file) throw httpError(400, "No job description file uploaded.");

    try {
        const extractedText = (await parseDocument(file.path)).trim();
        
        if (!extractedText) throw httpError(422, "No readable text was extracted from this document.");

        const structuredData = await structuredDataFromText(extractedText);
        return await jdRepository.create({
            userId,
            fileName: file.originalname,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: file.size,
            extractedText,
            structuredData,
        });
    } catch (error) {
        console.error("AI ERROR:", error);
        console.error("AI ERROR MESSAGE:", error.message);
        console.error("AI ERROR RESPONSE:", error.response);
        throw httpError(500, "Could not process the jd document.");
    }
};

export const getUserJobDescriptions = (userId) => jdRepository.findByUserId(userId);
