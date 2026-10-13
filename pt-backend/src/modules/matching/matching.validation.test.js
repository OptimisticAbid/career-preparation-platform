import test from "node:test";
import assert from "node:assert/strict";
import { matchRequestSchema, matchResultSchema } from "./matching.validation.js";

const validRequest = {
    resumeId: "5e9c86bb-5cc3-4b8e-b088-37136118cf81",
    jdId: "0b668b4d-52e9-4413-a056-31b9862362b9",
};

test("accepts a resume and JD UUID pair", () => {
    assert.equal(matchRequestSchema.safeParse(validRequest).success, true);
});

test("rejects missing, malformed, or unexpected match request fields", () => {
    assert.equal(matchRequestSchema.safeParse({ resumeId: validRequest.resumeId }).success, false);
    assert.equal(matchRequestSchema.safeParse({ ...validRequest, resumeId: "invalid" }).success, false);
    assert.equal(matchRequestSchema.safeParse({ ...validRequest, jdText: "unexpected" }).success, false);
});

test("validates score ranges and the complete persisted match result", () => {
    const result = {
        overall_score: 76,
        breakdown: { skill_match_score: 80, experience_match_score: 70, education_match_score: 60 },
        skill_analysis: { matched_skills: ["Node.js"], missing_skills: [], additional_skills: ["Docker"] },
        gaps: ["Education evidence is limited"],
        relevance_summary: "Relevant experience and skills.",
    };

    assert.equal(matchResultSchema.safeParse(result).success, true);
    assert.equal(matchResultSchema.safeParse({ ...result, overall_score: 110 }).success, false);
    assert.equal(matchResultSchema.safeParse({ ...result, unexpected: true }).success, false);
});
