 # Solo — Online Learning Platform 🎓

> An interactive e-learning platform where students can browse, enroll, and complete courses — earning XP points, certificates, and competing on a leaderboard.

🔗 **Live Demo:** [solo-eight-umber.vercel.app](https://solo-eight-umber.vercel.app)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

**Solo** is a full-stack web application that allows users to:
- Browse and enroll in courses
- Watch video lessons and read text-based content
- Take quizzes to test their knowledge
- Track their learning progress module by module
- Earn XP points and certificates upon course completion
- Compete with other learners on a global leaderboard

---

## Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | Register, login, and protected routes via JWT |
| 📚 Course Catalog | Browse all available courses with categories and pricing |
| 🎥 Course Player | Watch YouTube videos and read markdown content per module |
| ✅ Progress Tracking | Mark modules as complete and track overall course progress |
| 🧠 Quiz System | Interactive quizzes with auto-close and result feedback |
| 💳 Payment Modal | Payment flow before enrolling in paid courses |
| 🏆 Leaderboard | Live XP-based ranking of all students |
| 🎓 Certificates | Auto-generated PDF certificates upon course completion |
| 📊 Dashboard | Personal learning stats: XP, enrolled courses, completed lessons |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| Tailwind CSS + DaisyUI | Styling |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests |
| React YouTube | Video player |
| React Markdown | Markdown rendering |
| jsPDF + html2canvas | Certificate PDF generation |
| Formik + Yup | Form handling and validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| Strapi v5 | Headless CMS & REST API |
| Node.js ≥ 20 | Runtime |
| PostgreSQL | Production database |
| SQLite | Local development database |

---

## System Architecture

```
┌─────────────────────────────────────────┐
│              Solo Platform              │
├─────────────────┬───────────────────────┤
│   Frontend      │      Backend          │
│   (React/Vite)  │      (Strapi v5)      │
│                 │                       │
│  /courses       │  /api/courses         │
│  /dashboard     │  /api/enrollments     │
│  /leaderboard   │  /api/progress-       │
│  /certificate   │        trackings      │
│                 │  /api/leaderboard     │
│                 │  /api/modules         │
│                 │                       │
│  Deployed on:   │  Database:            │
│  Vercel         │  PostgreSQL           │
└─────────────────┴───────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 6.x
- PostgreSQL (for production) or SQLite (for local dev)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yousef715/solo.git
cd solo
```

---

### 2. Setup Backend (Strapi)

```bash
cd solo-backend
npm install
```

Create a `.env` file in `solo-backend/` (see [Environment Variables](#environment-variables) section).

```bash
# Start in development mode
npm run dev
```

Backend runs at: `http://localhost:1337`

---

### 3. Setup Frontend (React)

```bash
cd solo-frontend
npm install
```

Create a `.env` file in `solo-frontend/` with:

```env
VITE_API_URL=http://localhost:1337
```

```bash
# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Project Structure

```
solo/
├── solo-frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/                 # Axios API calls
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuizComponent.jsx
│   │   │   ├── Certificate.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Courses.jsx
│   │       ├── CourseDetails.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Leaderboard.jsx
│   │       ├── CertificateView.jsx
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   └── public/
│
├── solo-backend/                # Strapi v5 backend
│   ├── src/
│   │   └── api/
│   │       ├── course/          # Course content type
│   │       ├── module/          # Module content type
│   │       ├── enrollment/      # Enrollment content type
│   │       ├── progress-tracking/  # Progress content type
│   │       └── leaderboard/     # Leaderboard controller
│   └── config/
│       ├── database.js
│       ├── server.js
│       └── middlewares.js
│
└── Database/                    # DB export/backup files
```

---

## Environment Variables

### Backend (`solo-backend/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (PostgreSQL for production)
DATABASE_CLIENT=postgres
DATABASE_URL=your_postgresql_connection_string
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=solo
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=false
```

### Frontend (`solo-frontend/.env`)

```env
VITE_API_URL=http://localhost:1337
```

---

## Team

| Name | Department |
|------|-----------|
| Yousef Morse Mohamed | Mathematical Statistics & Computer Science |
| Mohamed Walid Sayed | Mathematical Statistics & Computer Science |
| Girgis Essam Fayez | Mathematical Statistics & Computer Science |

**Supervisor:** Dr. Hussein Karam

---





