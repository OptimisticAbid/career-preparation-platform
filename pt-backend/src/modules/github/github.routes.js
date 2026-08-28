import express from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import { githubStatsController, githubSyncController } from "./github.controller.js"

const router = express.Router()


router.use(authMiddleware)

router.post("/sync", githubSyncController)      // fetch/update latest data

router.get("/stats", githubStatsController)     // get stats for the user


export default router