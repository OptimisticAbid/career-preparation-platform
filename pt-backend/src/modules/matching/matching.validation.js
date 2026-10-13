import { z } from "zod";

const scoreSchema = z.number().min(0).max(100);

export const matchingResponseSchema = {
    type: "OBJECT",
    properties: {
        breakdown: {
            type: "OBJECT",
            properties: {
                skill_match_score: {
                    type: "NUMBER",
                    minimum: 0,
                    maximum: 100,
                },
                experience_match_score: {
                    type: "NUMBER",
                    minimum: 0,
                    maximum: 100,
                },
                education_match_score: {
                    type: "NUMBER",
                    minimum: 0,
                    maximum: 100,
                },
            },
            required: [
                "skill_match_score",
                "experience_match_score",
                "education_match_score",
            ],
            additionalProperties: false,
        },
        skill_analysis: {
            type: "OBJECT",
            properties: {
                matched_skills: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                },
                missing_skills: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                },
                additional_skills: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                },
            },
            required: [
                "matched_skills",
                "missing_skills",
                "additional_skills",
            ],
            additionalProperties: false,
        },

        gaps: {
            type: "ARRAY",
            items: { type: "STRING" },
        },

        relevance_summary: {
            type: "STRING",
        },
    },

    required: [
        "breakdown",
        "skill_analysis",
        "gaps",
        "relevance_summary",
    ],

    additionalProperties: false,

};

export const matchResultSchema = z.object({
    overall_score: z.number().int().min(0).max(100),
    breakdown: z.object({
        skill_match_score: scoreSchema,
        experience_match_score: scoreSchema,
        education_match_score: scoreSchema,
    }).strict(),
    skill_analysis: z.object({
        matched_skills: z.array(z.string()),
        missing_skills: z.array(z.string()),
        additional_skills: z.array(z.string()),
    }).strict(),
    gaps: z.array(z.string()),
    relevance_summary: z.string().trim().min(1),
}).strict();

export const matchRequestSchema = z.object({
    resumeId: z.uuid(),
    jdId: z.uuid(),
}).strict();

export const validateMatchRequest = (req, res, next) => {
    const result = matchRequestSchema.safeParse(req.body);
    if (!result.success) {
        const error = new Error("Valid resumeId and jdId are required.");
        error.statusCode = 400;
        return next(error);
    }

    req.validatedBody = result.data;
    next();
};
