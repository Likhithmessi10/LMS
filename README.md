# APTRANSCO LMS — Complete Setup Guide

## Architecture Overview

```
Users → React Frontend (Vite) → FastAPI Backend → Open edX APIs
                                    ↕
                           Dual PostgreSQL DBs
                    aptransco-lms  |  aptransco (read-only)
```

## Projects

| Project | Port | Description |
|---|---|---|
| `aptransco-admin` | 5173 | Admin dashboard (React) |
| `aptransco-student` | 5174 | Employee/Intern portal (React) |
| `aptransco-backend` | 8000 | FastAPI middleware |
| Open edX | 18000 | Learning engine |
| PostgreSQL | 5432 | Databases |

---

## 1. Database Setup

```sql
-- Create new LMS database
CREATE DATABASE "aptransco-lms";
```

The existing `aptransco` database is used **read-only** for internship applications.

---

## 2. FastAPI Backend

```powershell
cd C:\Users\mukka\Desktop\LMS\aptransco-backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
copy .env .env  # Edit with your actual DB credentials

# Start the server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Default Login Credentials (seed users)
| Role     | Email                       | Password    |
|---|---|---|
| Admin    | admin@aptransco.com         | admin123    |
| Employee | employee@aptransco.com      | employee123 |
| Intern   | intern@aptransco.com        | Intern@2024 |

---

## 3. Admin Portal (aptransco-admin)

```powershell
cd C:\Users\mukka\Desktop\LMS\aptransco-admin

# Install dependencies (first time only)
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build
```

### Admin Pages
- `/dashboard` — Analytics overview
- `/internships` — View applications, Approve/Reject with course assignment
- `/employees` — CRUD, CSV import, assign courses
- `/courses` — Course management (Open edX)
- `/training-camps` — Offline camp management + employee assignment
- `/training-progress` — Cross-employee learning progress tracker
- `/live-sessions` — Schedule and notify employees
- `/announcements` — Create announcements

---

## 4. Student/Intern Portal (aptransco-student)

```powershell
cd C:\Users\mukka\Desktop\LMS\aptransco-student

# Install (first time only)
npm install

# Start dev server (port 5174)
npm run dev
```

### Portal Pages
- `/dashboard` — Role-aware: Employee view / Intern view
- `/catalog` — Course catalog
- `/progress` — Module-level progress tracker with charts
- `/history` — Completed training history with certificate downloads
- `/certificates` — Certificate gallery
- `/player/:courseId` — Course player with sequential quiz gating

---

## 5. Open edX Integration

Configure `.env` with your edX credentials:

```env
OPENEDX_BASE_URL=http://localhost:18000
OPENEDX_CLIENT_ID=your-client-id
OPENEDX_CLIENT_SECRET=your-client-secret
```

### APIs Used
| API | Endpoint |
|---|---|
| List Courses | `GET /api/courses/v1/courses/` |
| Enroll User | `POST /api/enrollment/v1/enrollment` |
| Track Progress | `GET /api/course_home/v1/progress/{course_id}` |
| Get Grades | `GET /api/grades/v1/courses/{course_id}/` |
| Get Certificates | `GET /api/certificates/v0/certificates/{username}` |

---

## 6. Environment Variables

Edit `aptransco-backend/.env`:
```env
LMS_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/aptransco-lms
INTERNSHIP_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/aptransco
JWT_SECRET=your-secret-key-here
OPENEDX_BASE_URL=http://localhost:18000
```

Edit `aptransco-admin/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_OPENEDX_BASE_URL=http://localhost:18000
```
