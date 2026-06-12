import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const registerUserService = async (userData) => {
    const [userExists] = await db.select().from(users).where(eq(users.email, userData.email));

    if (userExists) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const [newUser] = await db.insert(users).values({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
    }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
    });

    if (!newUser) {
        throw new Error("Failed to register");
    }

    return newUser;
};

const loginUserService = async (userData) => {
    const { email, password } = userData;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
};

const getUserProfileService = async (email) => {
    const [userProfile] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email
    }).from(users).where(eq(users.email, email));

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    
    return userProfile;
};

export { registerUserService, loginUserService, getUserProfileService };