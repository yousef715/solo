# Solo — Online Learning Platform 🎓

> An interactive e-learning platform where students can browse, enroll, and complete courses — earning XP points, certificates, and competing on a leaderboard.

🔗 **Live Demo:** [solo-eight-umber.vercel.app](https://solo-eight-umber.vercel.app)
🐙 **GitHub:** [github.com/yousef715/solo](https://github.com/yousef715/solo)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

**Solo** is a full-stack web application that allows users to:
- Browse and enroll in courses with category filtering and search
- Watch YouTube video lessons and read rich Markdown content per module
- Complete modules in sequential order (locked until previous is done)
- Take quizzes and earn XP points upon passing
- Track their learning progress module by module
- Participate in module discussions via a threaded Q&A comment system
- Set daily learning goals and track them with a visual progress bar
- Earn a 20% loyalty discount after completing 2 courses
- Compete with other learners on a global XP leaderboard (top 10)
- Download PDF certificates upon completing all modules in a course

---

## Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | Register & login with JWT. Session persists across page refreshes via localStorage |
| 📚 Course Catalog | Browse all courses with real-time search by title and filter by category |
| 🎥 Course Player | YouTube video auto-completes lesson on video end. Markdown rendered with GFM + raw HTML support |
| 🔒 Sequential Modules | Modules unlock in order — must complete previous lesson before proceeding |
| ✅ Progress Tracking | Module status: `in_progress` / `completed`. Progress bar shown per course |
| ⏱️ Read Timer | Text modules require 10s read time. Video modules require 60s before "Finish" button appears |
| 🧠 Quiz System | Multi-question quiz with answer selection, progress bar, 80% pass threshold, XP reward on pass, Retry on fail |
| 💬 Comments & Q&A | Threaded discussion per module: top-level comments + nested replies. Only enrolled users can comment |
| 💳 Payment Modal | Card number, expiry, CVC, and name fields with input formatting. Simulated payment processing |
| 🎁 Loyalty Discount | 20% discount auto-applied on enrollment if student has completed 2+ courses |
| 🏆 Leaderboard | Top 10 students ranked by XP. Public page (no login required). Badge tiers: Beginner 🌱 / Pro 🚀 / Master 🎓 |
| 🎯 Daily Goal Tracker | Set a daily lesson target from Dashboard. Visual progress bar + motivational messages |
| 🎓 Certificates | Auto-generated PDF certificates upon completing all course modules. Downloadable from Dashboard |
| 📊 Dashboard | XP points, enrolled courses count, completed & in-progress lessons, daily goal tracker, My Courses list, Profile |
| 🔍 404 Page | Custom Not Found page for all invalid routes |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 3 | Utility-first styling |
| DaisyUI | 5 | UI component library |
| React Router DOM | 7 | Client-side routing & protected routes |
| Axios | 1.15 | HTTP client for all API calls |
| React YouTube | 10 | YouTube video player with event callbacks |
| React Markdown | 10 | Markdown content rendering |
| rehype-raw | — | Raw HTML support inside Markdown |
| remark-gfm | — | GitHub Flavored Markdown support |
| jsPDF + html2canvas | latest | PDF certificate generation |
| Formik + Yup | latest | Form handling and validation |
| React Hot Toast | 2 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Strapi | 5.43 | Headless CMS & REST API |
| Node.js | ≥ 20 | Runtime environment |
| PostgreSQL | — | Production relational database |
| SQLite | — | Local development database |
| JWT | — | Token-based user authentication |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting with auto-deploy from GitHub |
| Railway | Backend (Strapi) hosting |
| PostgreSQL on Railway | Production database |

---

## System Architecture

```
┌──────────┐   HTTP/HTTPS   ┌──────────────────┐   REST API   ┌──────────────────┐   SQL   ┌────────────┐
│          │ ─────────────▶ │                  │ ───────────▶ │                  │ ───────▶│            │
│   USER   │                │    FRONTEND      │              │     BACKEND      │         │  DATABASE  │
│ Browser  │ ◀───────────── │  React 19 + Vite │ ◀─────────── │   Strapi v5      │ ◀───────│ PostgreSQL │
│          │   HTML/JS/CSS  │  Vercel          │  JSON data   │   Railway        │  query  │            │
└──────────┘                └──────────────────┘              └──────────────────┘         └────────────┘
```

### Authentication Flow
```
1. User submits login/register form
2. Backend returns JWT token + user object
3. Frontend stores JWT in localStorage
4. Every API request includes: Authorization: Bearer <token>
5. On page refresh → AuthContext reads JWT from localStorage → calls /users/me → restores session
6. ProtectedRoute checks AuthContext → redirects to /login if no valid session
```

---

## Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 6.x
- PostgreSQL (production) or SQLite (local dev — default)

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

Create a `.env` file in `solo-backend/` — see [Environment Variables](#environment-variables).

```bash
npm run dev
```

Backend runs at: `http://localhost:1337`
Admin panel: `http://localhost:1337/admin`

---

### 3. Setup Frontend (React)

```bash
cd solo-frontend
npm install
```

Create a `.env` file in `solo-frontend/`:

```env
VITE_API_URL=http://localhost:1337
```

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Project Structure

```
solo/
├── solo-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js                  # All Axios API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Top navigation bar
│   │   │   ├── ProtectedRoute.jsx        # Auth guard for private routes
│   │   │   ├── Spinner.jsx               # Loading spinner
│   │   │   ├── QuizComponent.jsx         # Quiz UI with scoring logic
│   │   │   ├── CommentsSection.jsx       # Threaded comments & replies
│   │   │   ├── Certificate.jsx           # Certificate template
│   │   │   └── PaymentModal.jsx          # Payment form modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # JWT session management
│   │   └── pages/
│   │       ├── Home.jsx                  # Landing page with hero & stats
│   │       ├── Courses.jsx               # Course catalog with search & filter
│   │       ├── CourseDetails.jsx         # Course player, quiz, comments, enrollment
│   │       ├── Dashboard.jsx             # Personal stats & daily goal tracker
│   │       ├── Leaderboard.jsx           # Top 10 XP rankings
│   │       ├── CertificateView.jsx       # Certificate view & PDF download
│   │       ├── Login.jsx                 # Login page
│   │       ├── Register.jsx              # Registration page
│   │       └── NotFound.jsx              # 404 page
│
├── solo-backend/
│   ├── src/api/
│   │   ├── course/                       # Course content type
│   │   ├── module/                       # Module content type
│   │   ├── enrollment/                   # Enrollment content type
│   │   ├── progress-tracking/            # Progress tracking content type
│   │   ├── comment/                      # Comments & replies content type
│   │   └── leaderboard/                  # Custom leaderboard + XP + goal endpoints
│   └── config/
│       ├── database.js
│       ├── server.js
│       └── middlewares.js                # CORS configuration
│
└── Database/                             # DB export/backup files
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/local/register` | ❌ | Register new user |
| POST | `/api/auth/local` | ❌ | Login & receive JWT |
| GET | `/api/users/me` | ✅ | Get current user data |

### Courses & Modules
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses?populate=*` | ✅ | Get all courses with modules |

### Enrollments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/enrollments` | ✅ | Enroll in a course |
| GET | `/api/enrollments?populate=course.modules` | ✅ | Get user's enrolled courses |

### Progress
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress-trackings?filters[user][id][$eq]={id}&populate=module` | ✅ | Get user's module progress |
| POST | `/api/progress-trackings` | ✅ | Create progress record (in_progress) |
| PUT | `/api/progress-trackings/{id}` | ✅ | Update progress status (completed) |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments?filters[module][id][$eq]={id}&populate[0]=user&populate[1]=parent&sort=createdAt:asc` | ✅ | Get module comments with replies |
| POST | `/api/comments` | ✅ | Post a comment or reply |

### Leaderboard & XP
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/leaderboard` | ❌ | Get top 10 users ranked by XP |
| POST | `/api/leaderboard/xp` | ❌ | Update user XP points |
| POST | `/api/user/goal` | ❌ | Set user's daily learning goal |

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

# PostgreSQL (production)
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

## License

This project was developed as a final project for **COMP 406/416**.
