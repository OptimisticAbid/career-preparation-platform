import * as profilesRepository from "./profiles.repository.js";

export const getUserProfileService = async (userId, profileData) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const userProfile = await profilesRepository.findByUserId(userId);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    
    return userProfile;
};

export const updateUserProfileService = async (userId, profileData) => {
  if (!(await profilesRepository.userExists(userId))) {
    throw new Error("User not found");
  }

  const updateData = Object.fromEntries(
    Object.entries(profileData).filter(
      ([_, value]) => value !== undefined
    )
  );

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields provided");
  }

  const existingProfile = await profilesRepository.findProfileRecord(userId);

  if (!existingProfile) {
    return profilesRepository.create(userId, updateData);
  }

  return profilesRepository.updateByUserId(userId, updateData);
};