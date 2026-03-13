"""LMS SQLAlchemy models (aptransco-lms database)"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import LmsBase


class UserRole(str, enum.Enum):
    ADMIN    = "ADMIN"
    EMPLOYEE = "EMPLOYEE"
    INTERN   = "INTERN"


class User(LmsBase):
    __tablename__ = "users"
    id            = Column(String, primary_key=True)
    name          = Column(String, nullable=False)
    email         = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role          = Column(SAEnum(UserRole), default=UserRole.EMPLOYEE)
    department    = Column(String, nullable=True)
    edx_user_id   = Column(String, nullable=True)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    enrollments   = relationship("Enrollment", back_populates="user")


class Course(LmsBase):
    __tablename__   = "courses"
    id              = Column(String, primary_key=True)   # maps to edX course_id
    title           = Column(String, nullable=False)
    description     = Column(Text, nullable=True)
    category        = Column(String, nullable=True)
    duration        = Column(String, nullable=True)
    thumbnail_url   = Column(String, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    enrollments     = relationship("Enrollment", back_populates="course")


class Enrollment(LmsBase):
    __tablename__   = "enrollments"
    id              = Column(Integer, primary_key=True, autoincrement=True)
    user_id         = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id       = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    assigned_by     = Column(String, nullable=True)
    edx_progress    = Column(Float, default=0.0)
    is_completed    = Column(Boolean, default=False)
    assigned_at     = Column(DateTime(timezone=True), server_default=func.now())
    completed_at    = Column(DateTime(timezone=True), nullable=True)

    user   = relationship("User",   back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class LiveSession(LmsBase):
    __tablename__   = "live_sessions"
    id              = Column(String, primary_key=True)
    title           = Column(String, nullable=False)
    instructor      = Column(String, nullable=True)
    description     = Column(Text, nullable=True)
    scheduled_at    = Column(DateTime(timezone=True), nullable=False)
    duration_mins   = Column(Integer, default=60)
    meeting_link    = Column(String, nullable=True)
    notified        = Column(Boolean, default=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())


class TrainingCamp(LmsBase):
    __tablename__   = "training_camps"
    id              = Column(String, primary_key=True)
    name            = Column(String, nullable=False)
    location        = Column(String, nullable=True)
    description     = Column(Text, nullable=True)
    start_date      = Column(String, nullable=False)
    end_date        = Column(String, nullable=False)
    capacity        = Column(Integer, default=50)
    status          = Column(String, default="upcoming")  # upcoming | ongoing | completed
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    camp_enrollments = relationship("CampEnrollment", back_populates="camp")


class CampEnrollment(LmsBase):
    __tablename__   = "camp_enrollments"
    id              = Column(Integer, primary_key=True, autoincrement=True)
    camp_id         = Column(String, ForeignKey("training_camps.id", ondelete="CASCADE"))
    user_id         = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    attended        = Column(Boolean, default=False)
    enrolled_at     = Column(DateTime(timezone=True), server_default=func.now())

    camp = relationship("TrainingCamp", back_populates="camp_enrollments")


class Announcement(LmsBase):
    __tablename__   = "announcements"
    id              = Column(String, primary_key=True)
    title           = Column(String, nullable=False)
    description     = Column(Text, nullable=True)
    target_audience = Column(String, default="all")  # all | employees | interns
    created_by      = Column(String, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
