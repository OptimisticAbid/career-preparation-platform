import multer from 'multer'
import {db} from "../../db/index.js"
import { resumes} from "../../db/schema/resumes.schema.js"
export const resumeStatus = {
    UPLOADED: "UPLOADED",
    PARSING: "PARSING",
    PARSED: "PARSED",
    ANALYZING: "ANALYZING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
};

export const saveResumeData = async (userId, resumeFile) => {
   if(!resumeFile) {
      throw new Error("No resume file uploaded");
   }

   const metaData = {
        userId: userId,
        fileName: resumeFile.filename,
        fileType: resumeFile.mimetype,
        filePath: resumeFile.path,
        fileSize: resumeFile.size,
        status: resumeStatus.UPLOADED,
   }
 
   const [newResume] = await db
        .insert(resumes)
        .values(metaData)
        .returning({
            userId : resumes.userId,
            file : resumes.fileName
        });

    return newResume;
}
