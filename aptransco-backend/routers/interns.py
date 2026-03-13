"""
Internships router — reads from EXISTING aptransco DB (read-only internship applications)
Approve/reject also creates LMS user accounts in aptransco-lms DB.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
import uuid

from database import get_internship_db, get_lms_db
from auth.jwt import require_admin

router = APIRouter()


@router.get("/applications")
async def list_applications(
    status: Optional[str] = None,
    db:     AsyncSession  = Depends(get_internship_db),
    _:      dict          = Depends(require_admin),
):
    """Read internship applications from the aptransco (internship portal) database."""
    where = "WHERE a.status = :status" if status else ""
    result = await db.execute(
        text(f"""
            SELECT
                a.id,
                a."trackingId"     AS tracking_id,
                sp."fullName"      AS name,
                sp."collegeName"   AS college,
                sp.branch          AS skills,
                sp.cgpa,
                sp.degree,
                sp.phone,
                a.status,
                a."createdAt"      AS date_applied
            FROM "Application" a
            JOIN "StudentProfile" sp ON a."studentId" = sp.id
            {where}
            ORDER BY a."createdAt" DESC
        """),
        {"status": status} if status else {}
    )
    rows = result.mappings().all()
    return [dict(r) for r in rows]


@router.patch("/applications/{application_id}/approve")
async def approve_application(
    application_id: str,
    lms_db:         AsyncSession = Depends(get_lms_db),
    intern_db:      AsyncSession = Depends(get_internship_db),
    _:              dict         = Depends(require_admin),
):
    """
    1. Mark application as HIRED in the aptransco DB.
    2. Auto-create an INTERN user account in aptransco-lms DB.
    """
    # 1. Fetch applicant details from aptransco DB
    result = await intern_db.execute(
        text("""
            SELECT sp."fullName" AS name, u.email, a."trackingId" AS tracking_id
            FROM "Application" a
            JOIN "StudentProfile" sp ON a."studentId" = sp.id
            JOIN "User" u ON sp."userId" = u.id
            WHERE a.id = :app_id
        """),
        {"app_id": application_id}
    )
    row = result.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")

    # 2. Update status in internship DB
    await intern_db.execute(
        text('UPDATE "Application" SET status = \'HIRED\' WHERE id = :app_id'),
        {"app_id": application_id}
    )
    await intern_db.commit()

    # 3. Create intern account in LMS DB (if not already exists)
    from auth.jwt import hash_password
    intern_user_id = str(uuid.uuid4())
    await lms_db.execute(
        text("""
            INSERT INTO users (id, name, email, password_hash, role)
            VALUES (:id, :name, :email, :pw, 'INTERN')
            ON CONFLICT (email) DO NOTHING
        """),
        {"id": intern_user_id, "name": row["name"], "email": row["email"],
         "pw": hash_password("Intern@2024")}
    )
    await lms_db.commit()

    return {
        "status": "approved",
        "intern_account_created": True,
        "intern_user_id": intern_user_id,
        "temporary_password": "Intern@2024",
    }


@router.patch("/applications/{application_id}/reject")
async def reject_application(
    application_id: str,
    intern_db:      AsyncSession = Depends(get_internship_db),
    _:              dict         = Depends(require_admin),
):
    result = await intern_db.execute(
        text('UPDATE "Application" SET status = \'REJECTED\' WHERE id = :app_id'),
        {"app_id": application_id}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    await intern_db.commit()
    return {"status": "rejected"}


@router.post("/applications/{application_id}/assign-course")
async def assign_course_to_intern(
    application_id: str,
    body:           dict,
    lms_db:         AsyncSession = Depends(get_lms_db),
    intern_db:      AsyncSession = Depends(get_internship_db),
    _:              dict         = Depends(require_admin),
):
    # Find intern's LMS user by matching email from internship DB
    result = await intern_db.execute(
        text("""
            SELECT u.email FROM "Application" a
            JOIN "StudentProfile" sp ON a."studentId" = sp.id
            JOIN "User" u ON sp."userId" = u.id
            WHERE a.id = :app_id
        """),
        {"app_id": application_id}
    )
    row = result.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")

    lms_result = await lms_db.execute(
        text("SELECT id FROM users WHERE email = :email AND role = 'INTERN'"),
        {"email": row["email"]}
    )
    intern_lms = lms_result.mappings().first()
    if not intern_lms:
        raise HTTPException(status_code=404, detail="Intern LMS account not found. Approve first.")

    await lms_db.execute(
        text("""
            INSERT INTO enrollments (user_id, course_id, assigned_by)
            VALUES (:uid, :cid, 'admin')
            ON CONFLICT DO NOTHING
        """),
        {"uid": intern_lms["id"], "cid": body.get("courseId")}
    )
    await lms_db.commit()
    return {"status": "course_assigned", "intern_id": intern_lms["id"], "course_id": body.get("courseId")}
