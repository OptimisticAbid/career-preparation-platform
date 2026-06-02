import asyncHandler from "../utils/asyncHandler.js"
import {db} from '../db/db.js'
import {users} from "../db/schema.js"
import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm"
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
}

const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password} = req.body ;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Enter all fields!")
    }

    const [userExists] = await db.select().from(users).where(eq(users.email,email))

    if(userExists) {
        res.status(400)
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await db.insert(users).values({
        name: name,
        email: email,
        password: hashedPassword
    }).returning()

    if(newUser) {
        res.status(201).json({
            id: newUser.id,
            success : true,
            message:"Registered successfully", 
            token: generateToken(newUser.id)
        })
    }
}) 

const loginUser = asyncHandler(async(req,res) => {
    const { email, password } = req.body

    if(!email || !password) {
        res.status(400)
        throw new Error("Enter all fields")
    }

    const [user] = await db.select().from(users).where(eq(users.email,email))

    if(user && (await bcrypt.compare(password,user.password))) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

const getUser = asyncHandler(async (req,res) => {
    const email = req.user.email

    const [user] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email
    }).from(users).where(eq(users.email, email))

    res.status(200).json({
        id:user.id,
        name: user.name,
        email: user.email
    })
})

export {registerUser, loginUser, getUser}