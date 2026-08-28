import express from 'express';
import { uploadDocument } from '../../middlewares/upload.middleware.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { jdUploadController } from './jd.controller.js';
const router = express.Router();

router.post('/upload', authMiddleware, uploadDocument.single('jd') , jdUploadController);


export default router;