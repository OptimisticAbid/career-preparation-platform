import { getStructuredResponse } from "../../services/ai/ai.service.js";

const resumeAnalysisSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          duration: { type: "string" },
          responsibilities: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["company", "role", "duration", "responsibilities"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          field: { type: "string" },
          duration: { type: "string" },
        },
        required: ["institution", "degree", "field", "duration"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          technologies: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "description", "technologies"],
      },
    },
    certifications: {
      type: "array",
      items: { type: "string" },
    },
    achievements: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
    "certifications",
    "achievements",
  ],
};

export const structuredDataFromText = async (extractedText) => {
    console.log("In strcturedDataFromText function");
    const analysis = await getStructuredResponse({
        systemPrompt: `You are a professional resume analysis system.
        Analyze the provided resume and extract only information that is actually present in the resume.
        Do not invent or assume information.`,

        userPrompt: `Analyze the following resume:  
        ${extractedText}`,

        schema: resumeAnalysisSchema,
    });
    console.log("Analysis Result:", analysis);
    return analysis;
}
