import express from 'express'
import {
	analyzeResumeController,
	deleteResumeController,
	getResumeController,
	listResumesController,
	resumeUploadController,
} from './resume.controller.js'
import { uploadDocument } from '../../middlewares/upload.middleware.js'
import authMiddleware from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/upload', authMiddleware, uploadDocument.single("resume"), resumeUploadController)

router.get('/', authMiddleware, listResumesController)
 
router.post("/:id/analyze", authMiddleware, analyzeResumeController)

router.get('/:id', authMiddleware, getResumeController)

router.delete('/:id', authMiddleware, deleteResumeController)

export default router