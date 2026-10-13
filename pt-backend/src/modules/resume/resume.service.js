import { unlink } from "node:fs/promises";
import { parseDocument } from "../../services/document-parser/document.parser.js";
import * as resumeRepository from "./resume.repository.js";
import { structuredDataFromText } from "./resume.analysis.js";

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const removeUpload = async (filePath) => {
    if (!filePath) return;
    try {
        await unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") console.error("Unable to remove resume upload:", error.message);
    }
};

export const saveResumeData = async (userId, resumeFile) => {
    if (!resumeFile) throw httpError(400, "No resume file uploaded.");

    try {
        const extractedText = (await parseDocument(resumeFile.path)).trim();
        if (!extractedText) throw httpError(422, "No readable text was extracted from this document.");

        const structuredData = await structuredDataFromText(extractedText);
        console.log("Structured Data:", structuredData);
        const resume = await resumeRepository.create({
            userId,
            fileName: resumeFile.originalname,
            filePath: resumeFile.path,
            fileType: resumeFile.mimetype,
            fileSize: resumeFile.size,
            extractedText,
            structuredData,
        });
        return resume;
    } catch (error) {
        await removeUpload(resumeFile.path);
        if (error.statusCode) throw error;
        throw httpError(422, "Could not process the resume document.");
    }
};

export const getUserResumes = (userId) => resumeRepository.findByUserId(userId);

export const getResumeById = async (userId, resumeId) => {
    const resume = await resumeRepository.findById(userId, resumeId);
    if (!resume) throw httpError(404, "Resume not found.");

    const { filePath, ...publicResume } = resume;
    return publicResume;
};

export const analyzeResume = async (userId, resumeId) => {
    const resume = await resumeRepository.findById(userId, resumeId);
    if (!resume) throw httpError(404, "Resume not found.");

    const structuredData = await structuredDataFromText(resume.extractedText);
    const updatedResume = await resumeRepository.updateStructuredData(resumeId, structuredData);
    if (!updatedResume) throw new Error("Failed to save resume analysis.");
    return updatedResume;
};

export const deleteResume = async (userId, resumeId) => {
    const deletedResume = await resumeRepository.deleteById(userId, resumeId);
    if (!deletedResume) throw httpError(404, "Resume not found.");

    await removeUpload(deletedResume.filePath);
    return { id: deletedResume.id };
};
