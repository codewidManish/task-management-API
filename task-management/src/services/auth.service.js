const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/jwt.util");

exports.register = async (data) => {
    return await User.create(data);
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    return {
        user,
        accessToken: generateAccessToken({ id: user._id }),
        refreshToken: generateRefreshToken({ id: user._id }),
    };
};
