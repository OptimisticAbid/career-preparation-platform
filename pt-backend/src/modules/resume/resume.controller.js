import asyncHandler from '../../utils/asyncHandler.js';
import {
  analyzeResume,
  deleteResume,
  getResumeById,
  getUserResumes,
  saveResumeData,
} from './resume.service.js';

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

    res.status(201).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: result
    })
  

});

const listResumesController = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.user.id);
  res.status(200).json({ success: true, data: resumes });
});

const getResumeController = asyncHandler(async (req, res) => {
  const resume = await getResumeById(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: resume });
});

const analyzeResumeController = asyncHandler(async (req, res) => {
  const analysis = await analyzeResume(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: analysis });
});

const deleteResumeController = asyncHandler(async (req, res) => {
  const result = await deleteResume(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: result });
});

export {
  resumeUploadController,
  listResumesController,
  getResumeController,
  analyzeResumeController,
  deleteResumeController,
};