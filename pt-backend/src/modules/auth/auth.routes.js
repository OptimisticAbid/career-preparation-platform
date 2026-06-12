import express from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { loginUser, registerUser, getUserProfile, logoutUser, } from '../auth/auth.controller.js'
import { validateLogin, validateRegister, validateUserProfile } from './auth.validation.js'

const router = express.Router()


router.post('/register', validateRegister, registerUser)

router.post('/login', validateLogin,  loginUser)

router.post('/logout', authMiddleware, logoutUser)

router.get('/profile', authMiddleware, validateUserProfile, getUserProfile)

export default router