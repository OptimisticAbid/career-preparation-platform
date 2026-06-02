import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from './routes/user.routes.js';
import problemRoutes from './routes/problem.routes.js'
import Redis from 'ioredis';

const app = express()

// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');



app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// routes
app.use("/api/users", userRoutes)
app.use("/api/problems", problemRoutes)

// error middleware
app.use(errorMiddleware)



export default app;