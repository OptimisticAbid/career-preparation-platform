import asyncHandler from "../../utils/asyncHandler.js";
import { jdUploadService } from "./jd.service.js";

const jdUploadController = asyncHandler(async (req, res) => {
    const jdFile = req.file
    const userId = req.user.id

    if(!jdFile) {
        return res.status(400).json({
            success: false,
            message: "No JD file uploaded"
        })
    }
        const result = await jdUploadService(userId, jdFile)
        
        res.status(200).json({
            success: true,
            message: "JD uploaded successfully",
            data: result
        })  
    
   
})

export { jdUploadController }