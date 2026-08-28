import asyncHandler from '../../utils/asyncHandler.js';
import { saveResumeData } from './resume.service.js';

const resumeUploadController = asyncHandler (async (req, res) => {
  const userId = req.user.id;

  const resumeFile = req.file; // Assuming you're using multer for file upload
  
  if (!resumeFile) {
      return res.status(400).json({
      success: false,
      message: "No resume file uploaded"
    });
  }

    const result = await saveResumeData(userId, resumeFile);

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data:  result 
    })
  

});

const getResumeController = async (req, res) => {

};

const deleteResumeController = async (req, res) => {
  // Implementation for deleting resume
};

export { resumeUploadController, getResumeController, deleteResumeController };