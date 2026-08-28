import { getUserProfileService, updateUserProfileService } from "./profiles.service.js";

const getUserProfileController = async (req, res) => {
    const userId = req.user.id;

    const userProfile = await getUserProfileService(userId);

    res.status(200).json({
        success: true,
        message: "User profile retrieved",
        data: userProfile
    });
};

const updateUserProfileController = async (req, res) => {
    const userId = req.user.id;
    const { githubUsername, leetcodeUsername, codeforcesUsername, codechefUsername } = req.body;

    const profileData = {
        githubUsername,
        leetcodeUsername,
        codeforcesUsername,
        codechefUsername
    };

    const updatedProfile = await updateUserProfileService(userId, profileData);

    res.status(200).json({
        success: true,
        message: "User profile updated",
        data: updatedProfile
    });
};

export { getUserProfileController, updateUserProfileController }