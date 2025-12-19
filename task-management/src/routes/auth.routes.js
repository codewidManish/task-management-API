import express from "express";
import { register, login, getMe, logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const router = express.Router();
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
