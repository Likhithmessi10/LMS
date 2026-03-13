"""Employees router — CRUD + CSV import + course assignment"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid, io
import pandas as pd

from database import get_lms_db
from auth.jwt import require_admin, get_current_user

router = APIRouter()


class EmployeeCreate(BaseModel):
    name:       str
    email:      EmailStr
    department: Optional[str] = None


class EmployeeOut(BaseModel):
    id:                   str
    name:                 str
    email:                str
    department:           Optional[str]
    overall_progress:     float = 0.0
    assignments_completed: int  = 0
    total_assignments:    int   = 0

    class Config:
        from_attributes = True


class AssignCourseBody(BaseModel):
    courseId: str


@router.get("", response_model=List[dict])
async def get_employees(
    db: AsyncSession = Depends(get_lms_db),
    _:  dict         = Depends(require_admin),
):
    result = await db.execute(
        text("SELECT id, name, email, department FROM users WHERE role = 'EMPLOYEE' AND is_active = true")
    )
    rows = result.mappings().all()
    return [dict(r) for r in rows]


@router.post("", response_model=dict, status_code=201)
async def create_employee(
    body: EmployeeCreate,
    db:   AsyncSession = Depends(get_lms_db),
    _:    dict         = Depends(require_admin),
):
    from auth.jwt import hash_password
    emp_id = str(uuid.uuid4())
    await db.execute(
        text("""
            INSERT INTO users (id, name, email, password_hash, role, department)
            VALUES (:id, :name, :email, :pw, 'EMPLOYEE', :dept)
        """),
        {"id": emp_id, "name": body.name, "email": body.email,
         "pw": hash_password("Welcome@123"), "dept": body.department}
    )
    await db.commit()
    return {"id": emp_id, "name": body.name, "email": body.email,
            "department": body.department, "overallProgress": 0,
            "assignmentsCompleted": 0, "totalAssignments": 0}


@router.post("/import-csv", response_model=dict)
async def import_csv(
    file: UploadFile = File(...),
    db:   AsyncSession = Depends(get_lms_db),
    _:    dict         = Depends(require_admin),
):
    from auth.jwt import hash_password
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents)) if file.filename.endswith(".csv") else pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {e}")

    required = {"name", "email"}
    if not required.issubset(set(df.columns.str.lower())):
        raise HTTPException(status_code=400, detail="File must have 'name' and 'email' columns")

    df.columns = df.columns.str.lower()
    imported, errors = 0, []
    for _, row in df.iterrows():
        try:
            emp_id = str(uuid.uuid4())
            await db.execute(
                text("""
                    INSERT INTO users (id, name, email, password_hash, role, department)
                    VALUES (:id, :name, :email, :pw, 'EMPLOYEE', :dept)
                    ON CONFLICT (email) DO NOTHING
                """),
                {"id": emp_id, "name": row["name"], "email": row["email"],
                 "pw": hash_password("Welcome@123"), "dept": row.get("department", None)}
            )
            imported += 1
        except Exception as e:
            errors.append({"row": row.to_dict(), "error": str(e)})

    await db.commit()
    return {"imported": imported, "errors": errors}


@router.post("/{employee_id}/assign-course")
async def assign_course(
    employee_id: str,
    body:        AssignCourseBody,
    db:          AsyncSession = Depends(get_lms_db),
    _:           dict         = Depends(require_admin),
):
    await db.execute(
        text("""
            INSERT INTO enrollments (user_id, course_id, assigned_by)
            VALUES (:uid, :cid, 'admin')
            ON CONFLICT DO NOTHING
        """),
        {"uid": employee_id, "cid": body.courseId}
    )
    await db.commit()
    return {"status": "assigned", "employee_id": employee_id, "course_id": body.courseId}


@router.get("/{employee_id}/progress")
async def get_employee_progress(
    employee_id: str,
    db:          AsyncSession = Depends(get_lms_db),
    _:           dict         = Depends(get_current_user),
):
    result = await db.execute(
        text("""
            SELECT u.name, u.email, u.department,
                   e.course_id, e.edx_progress, e.is_completed
            FROM   users u
            LEFT JOIN enrollments e ON u.id = e.user_id
            WHERE  u.id = :uid
        """),
        {"uid": employee_id}
    )
    rows = result.mappings().all()
    if not rows:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp = dict(rows[0])
    courses = [{"courseId": r["course_id"], "progress": r["edx_progress"], "completed": r["is_completed"]} for r in rows if r["course_id"]]
    return {**emp, "courses": courses}
