import { body } from "express-validator";
import { validateResult } from "./auth.validator.js";

export const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"]).withMessage("Invalid priority value"),
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "completed", "archived"]).withMessage("Invalid status value"),
    body("dueDate")
        .optional()
        .isISO8601().withMessage("Invalid date format")
        .toDate()
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error("Due date must be in the future");
            }
            return true;
        }),
    validateResult
];

export const updateTaskStatusValidator = [
    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(["todo", "in-progress", "completed", "archived"]).withMessage("Invalid status value"),
    validateResult
];
