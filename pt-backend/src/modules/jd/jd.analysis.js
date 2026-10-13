import { getStructuredResponse } from "../../services/ai/ai.service.js";

export const jdSchema = {
    type: "object",
    properties: {
        jobTitle: {
            type: "string",
            description: "The title of the job position."
        },
        company: {
            type: "string",
            description: "The company name mentioned in the job description."
        },
        location: {
            type: "string",
            description: "Job location, including remote/hybrid/on-site information if available."
        },
        employmentType: {
            type: "string",
            description: "Employment type such as full-time, part-time, internship, contract, or unknown."
        },
        summary: {
            type: "string",
            description: "A concise summary of the role and what the company is looking for."
        },
        requiredSkills: {
            type: "array",
            items: { type: "string" },
            description: "Skills explicitly required for the role."
        },
        preferredSkills: {
            type: "array",
            items: { type: "string" },
            description: "Skills listed as preferred or nice-to-have."
        },
        responsibilities: {
            type: "array",
            items: { type: "string" },
            description: "Main responsibilities and duties."
        },
        experienceRequirements: {
            type: "string",
            description: "Required experience level, including minimum/maximum years and details (e.g., '3-5 years in software engineering')."
        },
        educationRequirements: {
            type: "array",
            items: { type: "string" },
            description: "Required or preferred degrees or educational qualifications."
        },
        certifications: {
            type: "array",
            items: { type: "string" },
            description: "Certifications required or preferred."
        },
        softSkills: {
            type: "array",
            items: { type: "string" },
            description: "Soft skills required or preferred."
        }
    },
    required: [
        "jobTitle",
        "company",
        "location",
        "employmentType",
        "summary",
        "requiredSkills",
        "preferredSkills",
        "responsibilities",
        "experienceRequirements",
        "educationRequirements",
        "certifications",
        "softSkills"
    ]
};

export const structuredDataFromText = async (text) => {
    console.log("In structuredDataFromText function");
    if (!text || typeof text !== "string") {
        throw new Error("Invalid text input for structured data extraction");
    }
    const analysis = await getStructuredResponse({
        systemPrompt: `You are a professional job description analysis system.
        Analyze the provided job description and extract only information that is actually present in the job description.
        Do not invent or assume information.`,

        userPrompt: `Here is the extracted job description text: ${text}.Just Return the structured analysis based only on this text.`,

        schema: jdSchema,
    });

    return analysis;
};