import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

beforeAll(async () => {
    // Ideally use a test database
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteMany({ email: "test@example.com" });
});

describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "Password123!"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.data).toHaveProperty("tokens");
    });

    it("should login a user", async () => {
        // Register first
        await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "Password123!"
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "Password123!"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.data.tokens).toHaveProperty("accessToken");
    });

    it("should fail login with wrong password", async () => {
        await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "Password123!"
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "WrongPass"
            });

        expect(res.statusCode).toEqual(401);
    });
});
