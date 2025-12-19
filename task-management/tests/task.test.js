import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Task from "../src/models/task.model.js";

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({ email: "tasktest@example.com" });
    await Task.deleteMany({});

    // Register and login to get token
    const res = await request(app).post("/api/auth/register").send({
        username: "tasktest",
        email: "tasktest@example.com",
        password: "Password123!"
    });
    token = res.body.data.tokens.accessToken;
});

describe("Task Endpoints", () => {
    it("should create a new task", async () => {
        const res = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Task",
                description: "Test Description",
                status: "todo",
                priority: "high"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.data.task).toHaveProperty("title", "Test Task");
    });

    it("should get all tasks", async () => {
        await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task 1" });

        const res = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.tasks.length).toBeGreaterThan(0);
    });

    it("should update task status", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task to Update" });

        const taskId = createRes.body.data.task._id;

        const res = await request(app)
            .put(`/api/tasks/${taskId}/status`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "completed" });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.task.status).toBe("completed");
    });

    it("should delete a task", async () => {
        const createRes = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task to Delete" });

        const taskId = createRes.body.data.task._id;

        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
    });
});
