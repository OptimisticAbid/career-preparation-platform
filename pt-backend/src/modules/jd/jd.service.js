import { db } from "../../db/index.js";
import { jd } from "../../db/schema/jd.schema.js";

export const jdUploadService = async (userId, jdFile) => {
    if(!jdFile) {
        throw new Error("No JD file uploaded");
    }

    const metaData = {
        userId : userId,
        fileName : jdFile.originalname,
        filePath : jdFile.path,
        fileType : jdFile.mimetype,
        fileSize : jdFile.size,
        status : "UPLOADED"
    }

    const [newJD] = await db
        .insert(jd)
        .values(metaData)
        .returning({
            userId : jd.userId,
            fileName : jd.fileName
        });
        
    return newJD;
};