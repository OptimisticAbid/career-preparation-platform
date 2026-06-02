import jwt from 'jsonwebtoken'  
import  asyncHandler  from '../utils/asyncHandler.js'
import { users } from '../db/schema.js'
import { db } from '../db/db.js'
import { eq } from 'drizzle-orm'

const authMiddleware = asyncHandler( async(req,res) => {
    let token ;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1] // Bearer "token"  - so split after space

        const decoded = jwt.verify(token, process.env.JWT_SECRET)    // payload when jwt is signed(created)

        const user = await db.select().from(users).where(eq(users.id,decoded.id))  // get user data
 
        if(!user) {
            res.status(400)
            throw new Error("User not found!")
        }
        req.user = user;        // attach user

        next()
    }
    else {
        res.status(401)
        throw new Error("No token provided");
    }
})

export default authMiddleware