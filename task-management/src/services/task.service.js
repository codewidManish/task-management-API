import Task from "../models/task.model.js";

export const createTask = async (data, userId) => {
    return await Task.create({ ...data, user: userId });
};
