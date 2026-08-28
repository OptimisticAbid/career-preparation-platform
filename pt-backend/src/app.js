import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from './modules/auth/auth.routes.js';
import problemRoutes from './modules/problems/problems.routes.js'
import profileRoutes from './modules/profiles/profiles.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import githubRoutes from "./modules/github/github.routes.js"
import leetcodeRoutes from "./modules/leetcode/leetcode.routes.js"
import resumeRoutes from "./modules/resume/resume.routes.js"
import jdRoutes from "./modules/jd/jd.routes.js"
import Redis from 'ioredis';

const app = express()

// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use("/api/auth", userRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/profile", profileRoutes)         
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/github", githubRoutes)
app.use("/api/leetcode", leetcodeRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/jd", jdRoutes)
// error middleware
app.use(errorMiddleware)


export default app;