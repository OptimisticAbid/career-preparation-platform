import asyncHandler from "../../utils/asyncHandler.js";
import { githubStatsService, githubSyncService } from "./github.service.js";

const githubSyncController = asyncHandler (async(req, res) => {
    const userId = req.user.id

    const githubUser = await githubSyncService(userId)

    res.status(200).json({
        success: true,
        message: "Github Account retrieved",
        data: githubUser
    })

})

const githubStatsController = asyncHandler(async(req, res) => {
    const userId = req.user.id

    const githubStats = await githubStatsService(userId)

    res.status(200).json({
        success: true,
        message: "Github Stats retrieved",
        data: githubStats
    })
})

export {githubSyncController, githubStatsController}