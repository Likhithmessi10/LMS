"""
Database connection setup — Dual database:
  1. LMS DB (aptransco-lms)  — primary LMS data
  2. Internship DB (aptransco) — read-only, for internship applications
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

LMS_DB_URL          = os.getenv("LMS_DATABASE_URL",          "postgresql+asyncpg://postgres:postgres@localhost:5432/aptransco-lms")
INTERNSHIP_DB_URL   = os.getenv("INTERNSHIP_DATABASE_URL",   "postgresql+asyncpg://postgres:postgres@localhost:5432/aptransco")

# ── LMS Engine ────────────────────────────────────────────────────────────────
lms_engine = create_async_engine(LMS_DB_URL, echo=False, pool_pre_ping=True)
LmsSession = async_sessionmaker(lms_engine, expire_on_commit=False, class_=AsyncSession)

# ── Internship Engine (read-only) ─────────────────────────────────────────────
internship_engine = create_async_engine(INTERNSHIP_DB_URL, echo=False, pool_pre_ping=True)
InternshipSession = async_sessionmaker(internship_engine, expire_on_commit=False, class_=AsyncSession)


class LmsBase(DeclarativeBase):
    pass


# ── FastAPI dependency injectors ──────────────────────────────────────────────
async def get_lms_db():
    async with LmsSession() as session:
        yield session


async def get_internship_db():
    async with InternshipSession() as session:
        yield session
