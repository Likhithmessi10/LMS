"""
APTRANSCO LMS — FastAPI Backend
Dual-database architecture:
  - aptransco-lms  → LMS-specific data (employees, training camps, sessions, etc.)
  - aptransco      → Read-only: existing internship applications from the portal
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import employees, interns, courses, live_sessions, training_camps, certificates, auth

app = FastAPI(
    title=os.getenv("APP_NAME", "APTRANSCO LMS API"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="Headless LMS API for APTRANSCO employee and intern training management.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,           prefix="/api/auth",            tags=["Authentication"])
app.include_router(employees.router,      prefix="/api/employees",       tags=["Employees"])
app.include_router(interns.router,        prefix="/api/internships",     tags=["Internships"])
app.include_router(courses.router,        prefix="/api/courses",         tags=["Courses"])
app.include_router(live_sessions.router,  prefix="/api/live-sessions",   tags=["Live Sessions"])
app.include_router(training_camps.router, prefix="/api/training-camps",  tags=["Training Camps"])
app.include_router(certificates.router,   prefix="/api/certificates",    tags=["Certificates"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "APTRANSCO LMS API", "version": "1.0.0"}


@app.get("/api/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "databases": {
            "lms":         "aptransco-lms",
            "internships": "aptransco (read-only)",
        }
    }
