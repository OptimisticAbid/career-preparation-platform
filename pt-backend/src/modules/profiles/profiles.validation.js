import asyncHandler from "../../utils/asyncHandler.js";

const validPlatforms = ["leetcode", "codeforces", "github", "codechef"];

export const validateUpdateProfile = asyncHandler(async (req, res, next) => {
    const { leetcodeUsername, githubUsername, codeforcesUsername, codechefUsername } = req.body;

    if (leetcodeUsername && typeof leetcodeUsername !== "string") {
        throw new Error("leetcodeUsername must be a string");
    }
    if (githubUsername && typeof githubUsername !== "string") {
        throw new Error("githubUsername must be a string");
    }
    if (codeforcesUsername && typeof codeforcesUsername !== "string") {
        throw new Error("codeforcesUsername must be a string");
    }
    if (codechefUsername && typeof codechefUsername !== "string") {
        throw new Error("codechefUsername must be a string");
    }

    next();
}); 