import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed", "archived"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    tags: [{
        type: String,
        trim: true
    }],
    estimatedHours: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

// Middleware to handle status changes
taskSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "completed") {
        this.completedAt = new Date();
    }
    next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
