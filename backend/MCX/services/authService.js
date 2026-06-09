const bcrypt = require("bcryptjs");

const User =
require("../models/User");

const {
    generateAccessToken
} = require("../utils/jwt");

const registerUser = async ({
    firstName,
    lastName,
    email,
    password,
    phone
}) =>
{
    const existingUser =
    await User.findOne({
        email: email.toLowerCase()
    });

    if (existingUser)
    {
        throw new Error(
            "User already exists"
        );
    }

    const hashedPassword =
    await bcrypt.hash(password, 10);

    const user =
    await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone
    });

    return user;
};

const loginUser = async (
    email,
    password
) =>
{
    const user =
    await User.findOne({
        email: email.toLowerCase()
    });

    if (!user)
    {
        throw new Error(
            "Invalid credentials"
        );
    }

    const isMatch =
    await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch)
    {
        throw new Error(
            "Invalid credentials"
        );
    }

    if (!user.isActive)
    {
        throw new Error(
            "Account disabled"
        );
    }

    const token =
    generateAccessToken(user);

    user.refreshToken = token;
    user.lastLogin = new Date();

    await user.save();

    return {
        user,
        token
    };
};

const logoutUser = async (
    userId
) =>
{
    const user =
    await User.findById(userId);

    if (!user)
    {
        throw new Error(
            "User not found"
        );
    }

    user.refreshToken = null;
    user.lastLogout = new Date();

    await user.save();

    return true;
};

module.exports =
{
    registerUser,
    loginUser,
    logoutUser
};