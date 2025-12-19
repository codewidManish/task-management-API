import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect); // All routes protected

router.route("/")
    .get(getCategories)
    .post(createCategory);

router.route("/:id")
    .delete(deleteCategory);

export default router;
