import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { jobDescriptions } from "../../db/schema/jobDescriptions.schema.js";
import { matches } from "../../db/schema/matching.schema.js";
import { resumes } from "../../db/schema/resumes.schema.js";

export const findResumeForUser = async (userId, resumeId) => {
    const [resume] = await db.select().from(resumes).where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, userId),
    )).limit(1);
    return resume;
};

export const findJobDescriptionForUser = async (userId, jdId) => {
    const [jobDescription] = await db.select().from(jobDescriptions).where(and(
        eq(jobDescriptions.id, jdId),
        eq(jobDescriptions.userId, userId),
    )).limit(1);
    return jobDescription;
};

export const create = async (data) => {
    const [match] = await db.insert(matches).values(data).returning({
        id: matches.id,
        resumeId: matches.resumeId,
        jdId: matches.jdId,
        overallScore: matches.overallScore,
        matchResult: matches.matchResult,
        createdAt: matches.createdAt,
    });
    return match;
};
