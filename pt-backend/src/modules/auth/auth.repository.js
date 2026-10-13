import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.schema.js";

export const findByEmail = async (email) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
};

export const findById = async (userId) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
};

export const create = async ({ name, email, password }) => {
    const [user] = await db.insert(users).values({ name, email, password }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
    });
    return user;
};

export const findProfileByEmail = async (email) => {
    const [user] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
    }).from(users).where(eq(users.email, email));
    return user;
};
