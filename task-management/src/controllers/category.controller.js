import Category from "../models/category.model.js";
import Task from "../models/task.model.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.json({ success: true, data: { categories } });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        const category = await Category.create({
            name,
            color,
            user: req.user.id
        });
        res.status(201).json({ success: true, data: { category } });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Set category to null for tasks in this category
        await Task.updateMany({ category: req.params.id }, { category: null });

        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
};
