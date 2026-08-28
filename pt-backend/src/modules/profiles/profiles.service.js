import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema/profiles.schema.js";
import { users } from "../../db/schema/users.schema.js";

export const getUserProfileService = async (userId, profileData) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const [userProfile] = await db.select({
        id: users.id,
        name: users.name,
        leetcodeUsername: profiles.leetcodeUsername,
        githubUsername: profiles.githubUsername,
        codeforcesUsername: profiles.codeforcesUsername,
        codechefUsername: profiles.codechefUsername
    }).from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId));

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    
    return userProfile;
};

export const updateUserProfileService = async (userId, profileData) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
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

  const [existingProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));

  if (!existingProfile) {
    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId,
        ...updateData,
      })
      .returning();

    return newProfile;
  }

  const [updatedProfile] = await db
    .update(profiles)
    .set(updateData)
    .where(eq(profiles.userId, userId))
    .returning();

  return updatedProfile;
};