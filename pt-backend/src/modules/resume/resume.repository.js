import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { resumes } from "../../db/schema/resumes.schema.js";

export const create = async (data) => {
    const [resume] = await db.insert(resumes).values(data).returning({
        id: resumes.id,
        userId: resumes.userId,
        fileName: resumes.fileName,
        fileType: resumes.fileType,
        createdAt: resumes.createdAt,
    });
    return resume;
};

export const findByUserId = async (userId) => db.select({
    id: resumes.id,
    fileName: resumes.fileName,
    fileType: resumes.fileType,
    createdAt: resumes.createdAt,
}).from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt));

export const findById = async (userId, resumeId) => {
    const [resume] = await db.select().from(resumes).where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, userId),
    )).limit(1);
    return resume;
};

export const updateStructuredData = async (resumeId, structuredData) => {
    const [resume] = await db.update(resumes)
        .set({ structuredData, updatedAt: new Date() })
        .where(eq(resumes.id, resumeId))
        .returning({
            id: resumes.id,
            fileName: resumes.fileName,
            fileType: resumes.fileType,
            structuredData: resumes.structuredData,
            updatedAt: resumes.updatedAt,
        });
    return resume;
};

export const deleteById = async (userId, resumeId) => {
    const [resume] = await db.delete(resumes).where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, userId),
    )).returning({ id: resumes.id, filePath: resumes.filePath });
    return resume;
};
