import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema/profiles.schema.js";

export const findUsernameByUserId = async (userId) => {
    const [profile] = await db.select({ leetcodeUsername: profiles.leetcodeUsername })
        .from(profiles)
        .where(eq(profiles.userId, userId));
    return profile?.leetcodeUsername ?? null;
};
