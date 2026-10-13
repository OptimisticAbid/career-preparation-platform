import { desc, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { jobDescriptions } from "../../db/schema/jobDescriptions.schema.js";


export const create = async (data) => {

    const [jobDescription] = await db
        .insert(jobDescriptions)
        .values(data)
        .returning({
            id: jobDescriptions.id,
            fileName: jobDescriptions.fileName,
            fileType: jobDescriptions.fileType,
            createdAt: jobDescriptions.createdAt,
        });

    return jobDescription;
};


export const findByUserId = async (userId) => {

    return await db
        .select({
            id: jobDescriptions.id,
            fileName: jobDescriptions.fileName,
            fileType: jobDescriptions.fileType,
            createdAt: jobDescriptions.createdAt,
        })
        .from(jobDescriptions)
        .where(
            eq(jobDescriptions.userId, userId)
        )
        .orderBy(
            desc(jobDescriptions.createdAt)
        );

};