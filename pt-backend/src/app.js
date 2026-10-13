import express from "express";
import "dotenv/config";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from './modules/auth/auth.routes.js';
import problemRoutes from './modules/problems/problems.routes.js'
import profileRoutes from './modules/profiles/profiles.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import githubRoutes from "./modules/github/github.routes.js"
import leetcodeRoutes from "./modules/leetcode/leetcode.routes.js"
import resumeRoutes from "./modules/resume/resume.routes.js"
import jdRoutes from "./modules/jd/jd.routes.js"
import matchingRoutes from "./modules/matching/matching.routes.js"
const app = express();

app.use((req, res, next) => {
  const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

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
app.use("/api/matching", matchingRoutes)
// error middleware
app.use(errorMiddleware)

export default app;