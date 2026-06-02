import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { loginUser, registerUser } from '../controllers/user.controller.js'

const router = express.Router()


router.post('/auth/register', registerUser)

router.post('/auth/login', loginUser)


export default router