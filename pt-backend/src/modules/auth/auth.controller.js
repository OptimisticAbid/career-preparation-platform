import asyncHandler from "../../utils/asyncHandler.js"
import {db} from '../../db/index.js'
import {users} from "../../db/schema/users.schema.js"
import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm"
import jwt from 'jsonwebtoken'
import { getUserProfileService, loginUserService, registerUserService } from "./auth.service.js"

const generateToken = (id) => {
    return jwt.sign(
        {id}, 
        process.env.JWT_SECRET, 
        { expiresIn: '10d' } 
    )
}

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    const userData = { name, email, password };

    const user = await registerUserService(userData);

    res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: user,
        token: generateToken(user.id)
    });
}); 

const loginUser = asyncHandler(async(req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    };

    const loggedUser = await loginUserService(userData);

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: loggedUser,
        token: generateToken(loggedUser.id)
    });
});

const logoutUser = asyncHandler(async(req,res) => {
    res.status(200).json({
        "success": true,
        "message": "Logged Out Successfully"
    })
})

const getUserProfile = asyncHandler(async (req, res) => {
    const email = req.user.email;
    
    const userProfile = await getUserProfileService(email);

    res.status(200).json({
        success: true,
        message: "User profile retrieved",
        data: userProfile
    });
});

export {registerUser, loginUser, getUserProfile, logoutUser}