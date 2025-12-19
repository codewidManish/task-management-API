import Task from "../models/task.model.js";
import { getIO } from "../sockets/task.socket.js";

export const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user.id
        });

        // Emit real-time event
        try {
            getIO().emit("task:created", task);
        } catch (e) {
            console.error("Socket emit error:", e.message);
        }

        res.status(201).json({ success: true, data: { task } });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const {
            status, priority, category, search,
            "dueDate[gte]": dueDateGte, "dueDate[lte]": dueDateLte,
            page = 1, limit = 10, sortBy = "dueDate:asc"
        } = req.query;

        const query = { user: req.user.id };

        if (status) query.status = { $in: status.split(",") };
        if (priority) query.priority = priority;
        if (category) query.category = category;

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (dueDateGte || dueDateLte) {
            query.dueDate = {};
            if (dueDateGte) query.dueDate.$gte = new Date(dueDateGte);
            if (dueDateLte) query.dueDate.$lte = new Date(dueDateLte);
        }

        const sort = {};
        if (sortBy) {
            const parts = sortBy.split(":");
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }

        const tasks = await Task.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("category", "name color");

        const total = await Task.countDocuments(query);

        const stats = await Task.aggregate([
            { $match: { user: req.user.id } }, // Only current user's stats
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const formattedStats = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
        // Ensure all statuses are present
        ["todo", "in-progress", "completed", "archived"].forEach(s => {
            if (!formattedStats[s]) formattedStats[s] = 0;
        });

        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / limit)
                },
                stats: formattedStats
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id }).populate("category");
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        res.json({ success: true, data: { task } });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        // Prevent updating user field
        delete req.body.user;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        try { getIO().emit("task:updated", task); } catch (e) { }

        res.json({ success: true, data: { task } });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        try { getIO().emit("task:deleted", task._id); } catch (e) { }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, message: "Status is required" });

        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        task.status = status;
        await task.save(); // This triggers the pre-save hook for completedAt

        res.json({ success: true, message: "Task status updated", data: { task } });
    } catch (error) {
        next(error);
    }
};

export const updateTaskPriority = async (req, res, next) => {
    try {
        const { priority } = req.body;
        if (!priority) return res.status(400).json({ success: false, message: "Priority is required" });

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { priority },
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        res.json({ success: true, message: "Task priority updated", data: { task } });
    } catch (error) {
        next(error);
    }
};
