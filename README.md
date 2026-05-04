 Solo — Empowering the Independent Learner

Department:Mathematical Statistics and Computer Science

## Team Members:

- Yousef Morse Mohamed
- Mohamed Walid Sayed
- Girgis Essam Fayez

Supervisor: Dr. Hussein Karam

==================================================================================================================================================================

 ## Project Overview

Solo is a full-stack e-learning platform that empowers independent learners by
providing a diverse range of expert-led courses. The platform allows students to
browse courses, enroll, and track their learning progress — all in one place.

==================================================================================================================================================================

 Tech Stack

| Layer    | Technology                            |
----------------------------------------------------
| Frontend | React 19, Vite, Tailwind CSS, DaisyUI |
----------------------------------------------------
| Backend  | Strapi v5 (Node.js)                   |
----------------------------------------------------
| Database | PostgreSQL                            |
----------------------------------------------------
| API      | REST API with JWT Authentication      |
----------------------------------------------------



## Project Structure
==================================================================================================================================================================


```
solo/
├── solo-frontend/         # React frontend application
│   ├── src/
│   │   ├── api/           # Axios API calls
│   │   ├── components/    # Reusable components (Navbar, Spinner, ProtectedRoute)
│   │   ├── context/       # Auth Context
│   │   └── pages/         # Application pages
├── solo-backend/          # Strapi backend application
│   ├── src/
│   │   └── api/           # API controllers, routes, services
│   │       ├── course/
│   │       ├── enrollment/
│   │       ├── module/
│   │       └── progress-tracking/
│   └── config/            # Strapi configuration
└── Database/             # Database export file
```

---
==================================================================================================================================================================

## Features

- User Registration & Login with JWT Authentication
- Browse and Search Courses by category
- Course Details with Modules
- Enroll in Courses
- Track Progress per Module (Mark as Complete)
- Personal Dashboard with enrollment stats
- Role-Based Access Control (Student / Expert)
- Protected Routes

==================================================================================================================================================================


## Prerequisites

Make sure you have the following installed:

- Node.js v18 or higher
- PostgreSQL
- npm

==================================================================================================================================================================


## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yousef715/solo1.git
cd solo
```

### 2. Setup the Database

- Open **pgAdmin** and create a new database named `solo_db`
- Import the database export file:

```bash
cd solo-backend
npm install
npx strapi import -f "../Database/export_20260430151032.tar.gz"
```

### 3. Setup the Backend

```bash
cd solo-backend
```

Create a `.env` file with the following:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=solo_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
```

Run the backend:

```bash
npm run develop
```

The backend will be available at `http://localhost:1337`

### 4. Setup the Frontend

```bash
cd solo-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

==================================================================================================================================================================

## API Endpoints

| Method |            Endpoint           |      Description       |
|--------|-------------------------------|------------------------|
| POST   | `/api/auth/local/register`    | Register new user      |
| POST   | `/api/auth/local`             | Login                  |
| GET    | `/api/courses?populate=*`     | Get all courses        |
| GET    | `/api/enrollments`            | Get user enrollments   |
| POST   | `/api/enrollments`            | Enroll in a course     |
| GET    | `/api/progress-trackings`     | Get user progress      |
| POST   | `/api/progress-trackings`     | Create progress record |
| PUT    | `/api/progress-trackings/:id` | Update progress        |

==================================================================================================================================================================

## Database Schema

|       Table       |            Description                 |
|-------------------|----------------------------------------|
| Users             | Stores user credentials and roles      |
| Courses           | Course information and metadata        |
| Modules           | Learning blocks linked to courses      |
| Enrollments       | Many-to-many between users and courses |
| Progress_Tracking | Tracks module completion per user      |

---

## GitHub Repository

https://github.com/yousef715/solo
