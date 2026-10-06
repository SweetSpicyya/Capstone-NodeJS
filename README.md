# Full Stack API to Server (Node.js & MongoDB)

A RESTful backend service built with Node.js, Express, and MongoDB that provides role-based authentication, user account management, work shift logging, and interactive user comments.

---

## 📌 Project Overview

This project implements a modular REST API adhering strictly to a domain-driven **3-file architecture** (`Route.js`, `Controller.js`, `Module.js`) per domain, along with JWT-based authentication and role-based access control (Admin / Regular User).

### Primary Tech Stack
- **Runtime Environment:** Node.js (JavaScript)
- **Web Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication & Security:** JSON Web Tokens (JWT), `bcrypt` password hashing
- **Testing & API Client:** Postman / Insomnia

---

## 🗄️ Database Schemas (4 Collections)

1. **User**
   - `_id`: ObjectId
   - `email`: String (Unique, required)
   - `password`: String (Hashed)
   - `firstname`: String
   - `lastname`: String
   - `permission`: String / Ref (`admin` | `regular_user`)
   - `comments`: Array of ObjectIds (Ref: `Comment`)
   - `created`: Date
   - `updated`: Date

2. **Shift**
   - `_id`: ObjectId
   - `userId`: ObjectId (Ref: `User`)
   - `start`: Date / Timestamp
   - `end`: Date / Timestamp
   - `perHour`: Number
   - `place`: String
   - `created`: Date
   - `updated`: Date

3. **Permission**
   - `_id`: ObjectId
   - `description`: String (`admin`, `regular_user`)
   - *Note: Permissions are seeded manually / "Only by hands".*

4. **Comments**
   - `_id`: ObjectId
   - `userId`: ObjectId (Ref: `User`)
   - `description`: String
   - `created`: Date
   - `updated`: Date

---

## 📂 Architecture & Directory Structure

Each functional module is isolated into three distinct layers:

```text
fullstack-api-server/
├── .env
├── .gitignore
├── package.json
├── server.js
├── config/
│   └── db.js
└── modules/
    ├── user/
    │   ├── User.Route.js
    │   ├── User.Controller.js
    │   └── User.Module.js
    ├── shift/
    │   ├── Shift.Route.js
    │   ├── Shift.Controller.js
    │   └── Shift.Module.js
    ├── comment/
    │   ├── Comment.Route.js
    │   ├── Comment.Controller.js
    │   └── Comment.Module.js
    └── permission/
        ├── Permission.Route.js
        ├── Permission.Controller.js
        └── Permission.Module.js
```

---

## 🚀 API Endpoints Specification

### 1. User & Authentication Module (`/api/user`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/user/` | Create a new user (`email`, `pass`, `firstname`, `lastname`) | Public |
| `POST` | `/api/user/login` | Authenticate user & return signed JWT token | Public |
| `GET` | `/api/user/` | Fetch all registered users | **Admin Only** |
| `GET` | `/api/user/:id` | Fetch specific user by ID | Authenticated |
| `PATCH` | `/api/user/:id` | Update user by ID | Authenticated |
| `DELETE` | `/api/user/:id` | Delete user by ID | **Admin Only** |

### 2. Shift Module (`/api/shifts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/shifts/` | Retrieve all shifts | **Admin Only** |
| `GET` | `/api/shifts/:id` | Retrieve shift details by ID | Authenticated |
| `POST` | `/api/shifts/` | Create a new work shift | Authenticated |
| `PATCH` | `/api/shifts/:id` | Update shift details by ID | Authenticated |
| `DELETE` | `/api/shifts/:id` | Delete shift by ID | **Admin Only** |

### 3. Comment Module (`/api/comment`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/comment/` | Retrieve all comments | **Admin Only** |
| `GET` | `/api/comment/:id` | Retrieve single comment by ID | Authenticated |
| `GET` | `/api/comment/user/:userId` | Retrieve all comments authored by a specific user | Authenticated |
| `POST` | `/api/comment/` | Create comment and link to User model | Authenticated |
| `PATCH` | `/api/comment/:id` | Update comment by ID | Authenticated |
| `DELETE` | `/api/comment/:id` | Delete comment by ID | **Admin Only** |

### 4. Permission Module (`/api/permission`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/permission` | List all system permissions | Authenticated / Public |

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18.x or later)
- MongoDB instance (Local or MongoDB Atlas)

### 2. Installation
```bash
git clone <repository-url>
cd fullstack-api-server
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/fullstack_db
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=1d
```
> **Note for macOS users:** If using port `5000`, ensure macOS **AirPlay Receiver** is disabled under *System Settings > General > AirDrop & AirPlay*, or configure `PORT=5001`.

### 4. Run the Server
```bash
# Development mode (Nodemon)
npm run dev

# Production mode
npm start
```

### 5. Health Check
```bash
curl -i http://localhost:5001/api/health
```

---
