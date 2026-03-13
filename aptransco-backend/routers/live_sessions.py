"""Live Sessions router"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
import uuid

from database import get_lms_db
from auth.jwt import require_admin, get_current_user

router = APIRouter()


class SessionCreate(BaseModel):
    title:        str
    instructor:   Optional[str] = None
    description:  Optional[str] = None
    scheduledAt:  str
    durationMins: int = 60
    meetingLink:  Optional[str] = None


@router.get("")
async def list_sessions(db: AsyncSession = Depends(get_lms_db), _: dict = Depends(get_current_user)):
    result = await db.execute(text("SELECT * FROM live_sessions ORDER BY scheduled_at ASC"))
    return [dict(r) for r in result.mappings().all()]


@router.post("", status_code=201)
async def create_session(body: SessionCreate, db: AsyncSession = Depends(get_lms_db), _: dict = Depends(require_admin)):
    sid = str(uuid.uuid4())
    await db.execute(
        text("""
            INSERT INTO live_sessions (id, title, instructor, description, scheduled_at, duration_mins, meeting_link)
            VALUES (:id, :title, :inst, :desc, :at, :dur, :link)
        """),
        {"id": sid, "title": body.title, "inst": body.instructor, "desc": body.description,
         "at": body.scheduledAt, "dur": body.durationMins, "link": body.meetingLink}
    )
    await db.commit()
    return {**body.dict(), "id": sid, "notified": False}


@router.post("/{session_id}/notify")
async def notify_employees(session_id: str, body: dict, _: dict = Depends(require_admin)):
    employee_ids = body.get("employeeIds", [])
    # TODO: integrate with email/notification service
    return {"status": "notifications_sent", "count": len(employee_ids), "session_id": session_id}
