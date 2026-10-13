import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository.js";

const registerUserService = async (userData) => {
    const userExists = await authRepository.findByEmail(userData.email);

    if (userExists) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = await authRepository.create({ ...userData, password: hashedPassword });

    if (!newUser) {
        throw new Error("Failed to register");
    }

    return newUser;
};

const loginUserService = async (userData) => {
    const { email, password } = userData;

    const user = await authRepository.findByEmail(email);

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
    const userProfile = await authRepository.findProfileByEmail(email);

    if (!userProfile) {
        throw new Error("User profile not found");
    }
    
    return userProfile;
};

export { registerUserService, loginUserService, getUserProfileService };