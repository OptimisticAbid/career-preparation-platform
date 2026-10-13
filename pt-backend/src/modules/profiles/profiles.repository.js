import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema/profiles.schema.js";
import { users } from "../../db/schema/users.schema.js";

export const findByUserId = async (userId) => {
    const [profile] = await db.select({
        id: users.id,
        name: users.name,
        leetcodeUsername: profiles.leetcodeUsername,
        githubUsername: profiles.githubUsername,
        codeforcesUsername: profiles.codeforcesUsername,
        codechefUsername: profiles.codechefUsername,
    }).from(users)
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .where(eq(users.id, userId));
    return profile;
};

export const userExists = async (userId) => {
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
    return Boolean(user);
};

export const findProfileRecord = async (userId) => {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
};

export const create = async (userId, data) => {
    const [profile] = await db.insert(profiles).values({ userId, ...data }).returning();
    return profile;
};

export const updateByUserId = async (userId, data) => {
    const [profile] = await db.update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .returning();
    return profile;
};
