import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    color: {
        type: String,
        default: "#000000"
    },
    taskCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Prevent duplicate category names for the same user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
