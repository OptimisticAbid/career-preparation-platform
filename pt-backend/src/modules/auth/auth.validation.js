import asyncHandler from "../../utils/asyncHandler.js";

export const validateRegister = asyncHandler((req,res, next) => {
    const  {name, email, password} = req.body ;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Enter all fields!")
    }

    if(password.length < 6) {
        throw new Error("Password must be atleast 6 characters")
    }
    next()
})

export const validateLogin  = asyncHandler((req,res,next) => {
    const {email, password} = req.body

    if(!email || !password) {
        res.status(400)
        throw new Error("Enter all fields!")
    }
    next()
})

export const validateUserProfile = asyncHandler((req,res,next) => {
    const email = req.user.email

    if(!email) {
        res.status(400)
        throw new Error("Email not available")
    }
    next()
})