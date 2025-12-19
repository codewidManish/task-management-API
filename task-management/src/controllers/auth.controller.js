import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(409).json({ success: false, message: "User exists" });

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed });

    const token = generateToken({ id: user._id });

    res.status(201).json({
        success: true,
        data: { token }
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password)))
        return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken({ id: user._id });
    res.json({ success: true, data: { token } });
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ success: true, data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
};
