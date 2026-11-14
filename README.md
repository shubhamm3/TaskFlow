# ⚡ TaskFlow – Full Stack MERN Task Management Application

A modern, responsive, and secure Full Stack Task Management web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## ✨ Features Implemented

1. **🔐 User Registration & Login**:
   - Secure account registration with input validation.
   - Password hashing using `bcryptjs` (salt rounds: 10).
   - Form validation with clear user-friendly error messages.

2. **🛡️ JWT Authentication**:
   - Stateless authentication with JSON Web Tokens (JWT).
   - Authentication middleware protecting all private task operations.
   - Client-side token storage with automatic Axios interceptors attaching `Authorization: Bearer <token>`.
   - Automatic logout and redirect when tokens expire.

3. **➕ Create New Task**:
   - Add tasks with title, detailed description, priority level, due date, and initial status.

4. **✏️ Edit & Delete Task**:
   - Interactive modal to modify task details, status, priority, and due dates.
   - Delete confirmation modal dialog to avoid accidental removals.

5. **✅ Mark Task as Completed**:
   - One-click completion toggle button with instant optimistic UI update.
   - Dynamic strikethrough styling and completed status badges.

6. **🎯 Task Priority (Low, Medium, High)**:
   - Color-coded badges for visual distinction:
     - 🟢 **Low Priority** (Emerald)
     - 🟡 **Medium Priority** (Amber)
     - 🔴 **High Priority** (Rose/Red)
   - Filter and sort tasks by priority levels.

7. **🔍 Filter & Search Tasks**:
   - **Status Tabs**: All, Pending, Completed.
   - **Priority Filter**: All Priorities, High, Medium, Low.
   - **Live Search**: Instant text filtering by title or description.
   - **Sorting**: Newest first, Oldest first, Due Date (earliest/latest).
   - "Clear all filters" shortcut.

8. **📊 Dashboard Metrics & Progress**:
   - Summary statistics cards:
     - 🗂️ **Total Tasks**
     - ⏳ **Pending Tasks**
     - 🎯 **Completed Tasks**
     - ⚠️ **High Priority Tasks**
   - **Overall Completion Rate Progress Bar** calculating percentage done.
   - Interactive stat cards that apply filters on click.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS** (Modern styling and animations)
- **Lucide React** (Clean, minimalist iconography)
- **Axios** (API requests with automatic JWT interceptors)
- **React Router Dom v7** (Protected routes and navigation)

### Backend
- **Node.js & Express.js** (RESTful API architecture)
- **MongoDB & Mongoose** (Data modeling and schema validation)
- **JWT (jsonwebtoken)** (Secure token generation and verification)
- **Bcrypt.js** (Password hashing)
- **CORS & Dotenv** (Security and environment configuration)

---

## 📁 Project Directory Structure

```text
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   └── taskController.js     # Task CRUD, stats, toggle status
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── errorMiddleware.js    # 404 & global error handling
│   ├── models/
│   │   ├── User.js               # User Mongoose model & password hashing
│   │   └── Task.js               # Task Mongoose model
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardStats.jsx# Metrics cards & progress bar
│   │   │   ├── Navbar.jsx        # Top navigation with user avatar & logout
│   │   │   ├── ProtectedRoute.jsx# Auth protection wrapper
│   │   │   ├── TaskCard.jsx      # Individual task card with actions
│   │   │   ├── TaskFilter.jsx    # Status tabs, search, priority & sort
│   │   │   └── TaskModal.jsx     # Create and edit task modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main task workspace
│   │   │   ├── Login.jsx         # Sign in page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Route configuration
│   │   ├── index.css             # Tailwind setup
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB** (Local MongoDB Community Server running at `mongodb://127.0.0.1:27017` OR free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)

### 2. Backend Configuration
Navigate to `backend/`:
```bash
cd backend
```
Review or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=taskflow_jwt_secret_key_987654321_secure
JWT_EXPIRE=30d
```
> **Note for MongoDB Atlas**: If using Atlas, replace `MONGO_URI` with your connection string:  
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority`

Start the backend server:
```bash
npm run dev
# Or: npm start
```
The backend will run at `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🐳 Running with Docker & Docker Compose

You can spin up the entire MERN stack (MongoDB 7 + Express Backend + Nginx-served React Frontend) with a single command:

```bash
docker compose up --build
```

- **Frontend**: Accessible at [http://localhost](http://localhost) or [http://localhost:3000](http://localhost:3000)
- **Backend API**: Accessible at [http://localhost:5000](http://localhost:5000)
- **MongoDB**: Accessible on port `27017` with persistent volume `mongo-data`

To shut down the containers:
```bash
docker compose down
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT token | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes (Bearer Token) |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `status`, `priority`, `search`, `sort`) | Yes |
| `GET` | `/api/tasks/stats` | Get dashboard summary metrics (Total, Pending, Completed, Priority breakdown) | Yes |
| `GET` | `/api/tasks/:id` | Get details of a single task | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update an existing task | Yes |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle task completion (Pending ↔ Completed) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

