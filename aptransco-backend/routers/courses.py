"""Courses, Training Camps, Live Sessions, and Certificates routers (combined for brevity)"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import List, Optional
import uuid

from database import get_lms_db
from auth.jwt import require_admin, get_current_user
from services.openedx import edx_service

router = APIRouter()


@router.get("")
async def list_courses(
    db: AsyncSession = Depends(get_lms_db),
    _:  dict         = Depends(get_current_user),
):
    """Fetch courses from Open edX API (with DB cache fallback)."""
    try:
        return await edx_service.get_courses()
    except Exception:
        result = await db.execute(text("SELECT * FROM courses ORDER BY created_at DESC"))
        return [dict(r) for r in result.mappings().all()]


@router.post("/enroll")
async def enroll_user(
    body: dict,
    db:   AsyncSession = Depends(get_lms_db),
    _:    dict         = Depends(require_admin),
):
    user_id   = body.get("userId")
    course_id = body.get("courseId")
    username  = body.get("edxUsername")

    # Enroll in Open edX
    if username:
        await edx_service.enroll_user(username, course_id)

    await db.execute(
        text("""
            INSERT INTO enrollments (user_id, course_id, assigned_by)
            VALUES (:uid, :cid, 'admin') ON CONFLICT DO NOTHING
        """),
        {"uid": user_id, "cid": course_id}
    )
    await db.commit()
    return {"status": "enrolled"}
