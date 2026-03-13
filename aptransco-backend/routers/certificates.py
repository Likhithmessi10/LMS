"""Certificates router — fetches from Open edX, stores in LMS DB"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from database import get_lms_db
from auth.jwt import get_current_user
from services.openedx import edx_service

router = APIRouter()


@router.get("/my")
async def get_my_certificates(
    db:   AsyncSession = Depends(get_lms_db),
    user: dict         = Depends(get_current_user),
):
    """Fetch certificates for the logged-in user from Open edX."""
    user_id  = user.get("sub")
    edx_user = user.get("edxUsername")

    edx_certs = []
    if edx_user:
        try:
            edx_certs = await edx_service.get_certificates(edx_user)
        except Exception:
            pass

    # Fallback: DB-stored completions
    result = await db.execute(
        text("""
            SELECT e.course_id, c.title, e.completed_at
            FROM   enrollments e
            JOIN   courses c ON e.course_id = c.id
            WHERE  e.user_id = :uid AND e.is_completed = true
        """),
        {"uid": user_id}
    )
    db_certs = [dict(r) for r in result.mappings().all()]

    return {"edx_certificates": edx_certs, "lms_completions": db_certs}


@router.get("/{user_id}")
async def get_user_certificates(
    user_id: str,
    db:      AsyncSession = Depends(get_lms_db),
    _:       dict         = Depends(get_current_user),
):
    result = await db.execute(
        text("""
            SELECT e.course_id, c.title, e.completed_at
            FROM   enrollments e
            JOIN   courses c ON e.course_id = c.id
            WHERE  e.user_id = :uid AND e.is_completed = true
        """),
        {"uid": user_id}
    )
    return [dict(r) for r in result.mappings().all()]
