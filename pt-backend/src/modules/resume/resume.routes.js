import express from 'express'
import { resumeUploadController, getResumeController, deleteResumeController } from './resume.controller.js'
import { uploadDocument } from '../../middlewares/upload.middleware.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/upload', authMiddleware, uploadDocument.single("resume"), resumeUploadController)

router.get('/get', authMiddleware, getResumeController)

router.delete('/delete', authMiddleware, deleteResumeController)

export default router