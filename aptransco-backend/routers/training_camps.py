"""Training Camps router"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import List, Optional
import uuid

from database import get_lms_db
from auth.jwt import require_admin, get_current_user

router = APIRouter()


class CampCreate(BaseModel):
    name:        str
    location:    Optional[str] = None
    description: Optional[str] = None
    startDate:   str
    endDate:     str
    capacity:    int = 50


@router.get("")
async def list_camps(db: AsyncSession = Depends(get_lms_db), _: dict = Depends(get_current_user)):
    result = await db.execute(
        text("""
            SELECT tc.*, COUNT(ce.id) AS enrolled_count
            FROM training_camps tc
            LEFT JOIN camp_enrollments ce ON tc.id = ce.camp_id
            GROUP BY tc.id ORDER BY tc.created_at DESC
        """)
    )
    return [dict(r) for r in result.mappings().all()]


@router.post("", status_code=201)
async def create_camp(body: CampCreate, db: AsyncSession = Depends(get_lms_db), _: dict = Depends(require_admin)):
    camp_id = str(uuid.uuid4())
    await db.execute(
        text("""
            INSERT INTO training_camps (id, name, location, description, start_date, end_date, capacity, status)
            VALUES (:id, :name, :loc, :desc, :start, :end, :cap, 'upcoming')
        """),
        {"id": camp_id, "name": body.name, "loc": body.location, "desc": body.description,
         "start": body.startDate, "end": body.endDate, "cap": body.capacity}
    )
    await db.commit()
    return {**body.dict(), "id": camp_id, "enrolledCount": 0, "status": "upcoming"}


@router.post("/{camp_id}/assign")
async def assign_employees(camp_id: str, body: dict, db: AsyncSession = Depends(get_lms_db), _: dict = Depends(require_admin)):
    employee_ids = body.get("employeeIds", [])
    for uid in employee_ids:
        await db.execute(
            text("INSERT INTO camp_enrollments (camp_id, user_id) VALUES (:cid, :uid) ON CONFLICT DO NOTHING"),
            {"cid": camp_id, "uid": uid}
        )
    await db.commit()
    return {"status": "assigned", "count": len(employee_ids)}
