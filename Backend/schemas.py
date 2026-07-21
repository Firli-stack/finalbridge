"""
schemas.py — Pydantic Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ActivityLogResponse(BaseModel):
    id: int
    timestamp: datetime
    gesture_text: str
    confidence: Optional[float]

    class Config:
        from_attributes = True


class StatisticsResponse(BaseModel):
    total_gestures: int
    active_time_minutes: int
    unique_gestures: int
    last_activity: Optional[datetime] = None


class SystemStatusResponse(BaseModel):
    camera_online: bool
    device_connected: bool
    last_seen: Optional[datetime] = None


# =========================
# GESTURE CRUD SCHEMAS
# =========================

class GestureCreate(BaseModel):
    name: str


class GestureUpdate(BaseModel):
    name: str


class GestureResponse(BaseModel):
    id: int
    name: str
    video_filename: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True