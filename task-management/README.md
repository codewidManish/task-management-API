# Task Management API

A robust RESTful API for managing tasks and categories, featuring user authentication (JWT), real-time updates (Socket.io), and advanced filtering options. Built with Node.js, Express, and MongoDB.

##  Features

*   **User Authentication**: Secure Register/Login using JWT and HTTP-only cookies (or Bearer tokens).
*   **Task Management**: Create, Read (with filters & pagination), Update, Delete tasks.
*   **Category Management**: Organize tasks into categories (Work, Personal, etc.).
*   **Real-time Updates**: Live updates for task creation, status changes, and deletion using Socket.io.
*   **Advanced Filtering**: Filter tasks by status, priority, category, due date ranges, and search keywords.
*   **Security**: Password hashing (bcrypt), input validation (express-validator), CORS, and Helmet headers.

##  Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt
*   **Real-time**: Socket.io
*   **Validation**: express-validator
*   **Testing**: Jest & Supertest

##  Project Structure & Code Explanation

Here is a detailed breakdown of the codebase and the purpose of each file:

```
src/
├── config/
│   ├── cors.config.js       # CORS configuration defining allowed origins.
│   ├── db.config.js         # Mongoose connection logic to MongoDB Atlas.
│   └── env.config.js        # Centralized environment variable loading.
├── controllers/
│   ├── auth.controller.js   # Handles Register, Login, Logout, and GetMe logic.
│   ├── category.controller.js # CRUD logic for Categories.
│   └── task.controller.js   # CRUD logic for Tasks, including emitting Socket events.
├── middlewares/
│   ├── auth.middleware.js   # Verifies JWT tokens and attaches user to request object.
│   └── error.middleware.js  # Global error handler to sanitize responses.
├── models/
│   ├── category.model.js    # Mongoose schema for Categories (Name, Color, User ref).
│   ├── task.model.js        # Mongoose schema for Tasks (Title, Status, User ref, Timestamps).
│   └── user.model.js        # Mongoose schema for Users (Username, Email, Hased Password).
├── routes/                  # Defines API endpoints and maps them to controllers.
│   ├── auth.routes.js       # /api/auth/*
│   ├── category.routes.js   # /api/categories/*
│   └── task.routes.js       # /api/tasks/*
├── sockets/
│   └── task.socket.js       # Initializes Socket.io server and exports 'getIO' for controllers.
├── utils/                   # Helper utility functions.
│   ├── api-response.util.js # Standardized success/error response classes (if used).
│   ├── jwt.util.js          # Functions to generate and verify Access/Refresh tokens.
│   ├── pagination.util.js   # Helper to calculate pagination metadata.
│   └── password.util.js     # Bcrypt wrappers for hashing and comparing passwords.
├── validators/              # Input validation rules using express-validator.
│   ├── auth.validator.js    # Validation for Login/Register inputs.
│   └── task.validator.js    # Validation for Task creation/updates.
├── app.js                   # Express app setup (Middleware, Routes, CORS).
└── server.js                # Entry point. Starts HTTP server and Database connection.
```

##  Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd task-management-API/task-management
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    *   Create a `.env` file in the root directory.
    *   Add the following variables (update `<password>` with your actual DB password):
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1d
    REFRESH_TOKEN_SECRET=your_refresh_secret_key
    REFRESH_TOKEN_EXPIRES_IN=7d
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Server will start on `http://localhost:5000`.

5.  **Run Tests**
    ```bash
    npm test
    ```

##  API Documentation

### Authentication

*   **POST /api/auth/register**
    *   Body: `{ "username": "user", "email": "user@test.com", "password": "Password123!" }`
*   **POST /api/auth/login**
    *   Body: `{ "email": "user@test.com", "password": "Password123!" }`
    *   Returns: `{ success: true, data: { tokens: { accessToken: "..." } } }`
*   **GET /api/auth/me** (Protected)
    *   Returns user profile.

### Tasks (Protected)

*   **GET /api/tasks**
    *   Query Params: `page`, `limit`, `status`, `priority`, `search`, `sortBy`
*   **POST /api/tasks**
    *   Body: `{ "title": "New Task", "priority": "high" }`
*   **PUT /api/tasks/:id**
    *   Update task details.
*   **DELETE /api/tasks/:id**
    *   Remove a task.
*   **PATCH /api/tasks/:id/status**
    *   Body: `{ "status": "completed" }`

### Categories (Protected)

*   **GET /api/categories**
*   **POST /api/categories**
    *   Body: `{ "name": "Work", "color": "#ff0000" }`

## 🔌 Real-time Events (Socket.io)

Connect to the root URL (e.g., `http://localhost:5000`). Listen for:
*   `task:created`: Data = New Task Object
*   `task:updated`: Data = Updated Task Object
*   `task:deleted`: Data = Deleted Task ID

##  Testing

The project includes integration tests using **Jest** and **Supertest**.
*   `tests/auth.test.js`: Verifies registration and login flows.
*   `tests/task.test.js`: Verifies task CRUD operations and security.