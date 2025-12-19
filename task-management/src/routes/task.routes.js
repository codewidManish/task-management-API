import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createTask, getTasks, getTask, updateTask, deleteTask, updateTaskStatus, updateTaskPriority
} from "../controllers/task.controller.js";
import { createTaskValidator, updateTaskStatusValidator } from "../validators/task.validator.js";

const router = express.Router();

router.use(protect); // All routes protected

router.route("/")
    .get(getTasks)
    .post(createTaskValidator, createTask);

router.route("/:id")
    .get(getTask)
    .put(createTaskValidator, updateTask) // Reuse create validator for full update
    .delete(deleteTask);

router.patch("/:id/status", updateTaskStatusValidator, updateTaskStatus);
router.patch("/:id/priority", updateTaskPriority);

export default router;
