import asyncio
import os
import shutil
import time
import uuid

from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import cv2

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    UploadFile,
    File,
    Form,
    status,
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session

import camera
import database
import models
import schemas

from auth import (
    verify_password,
    create_access_token,
    get_current_admin_user,
)

from camera import get_frame
from gesture import detect_hand, LABEL_MAP

from schemas import (
    UserLogin,
    Token,
    ActivityLogResponse,
    StatisticsResponse,
    SystemStatusResponse,
)

# ==========================================================
# PATH CONFIGURATION
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"

VIDEO_DIR = UPLOAD_DIR / "gesture-videos"

VIDEO_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".mp4",
    ".webm",
    ".mov",
    ".avi",
}

ALLOWED_MIME = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
}

MAX_VIDEO_SIZE = 20 * 1024 * 1024

# ==========================================================
# GLOBAL STATE
# ==========================================================

_latest_frame = None

_latest_result = {
    "gloss": None,
    "confidence": 0.0,
    "ts": 0.0,
}

_last_db_saved_gloss = None

_last_sent_gloss = None

_is_camera_active = False

_is_shutting_down = False

_start_time = datetime.now()

# ==========================================================
# LIFESPAN
# ==========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    global _is_shutting_down

    database.Base.metadata.create_all(bind=database.engine)

    ai_task = asyncio.create_task(ai_processor())

    app.state.ai_task = ai_task

    yield

    _is_shutting_down = True

    print("\nStopping backend...")

    if (
        hasattr(app.state, "ai_task")
        and not app.state.ai_task.done()
    ):
        app.state.ai_task.cancel()

        try:
            await asyncio.wait_for(
                app.state.ai_task,
                timeout=3
            )

        except asyncio.CancelledError:
            pass

        except asyncio.TimeoutError:
            pass

    camera.release_camera()

    print("Backend stopped.")

# ==========================================================
# APP
# ==========================================================

app = FastAPI(
    title="BridgeCom API",
    lifespan=lifespan,
)

app.mount(
    "/api/gesture-videos",
    StaticFiles(directory=str(VIDEO_DIR)),
    name="gesture-videos",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# AI PROCESSOR
# ==========================================================

async def ai_processor():

    global _latest_frame
    global _latest_result
    global _last_db_saved_gloss
    global _is_camera_active
    global _is_shutting_down

    try:

        while not _is_shutting_down:

            if not _is_camera_active:

                if camera._cap is not None:
                    camera.release_camera()

                await asyncio.sleep(0.1)
                continue

            frame = await asyncio.to_thread(get_frame)

            if frame is None:
                await asyncio.sleep(0.05)
                continue

            frame, gloss, conf = await asyncio.to_thread(
                detect_hand,
                frame,
            )

            _latest_frame = frame.copy()

            if gloss:

                if gloss != _last_db_saved_gloss:

                    db = database.SessionLocal()

                    try:

                        log = models.ActivityLog(
                            gesture_text=gloss,
                            confidence=float(conf),
                        )

                        db.add(log)

                        db.commit()

                        _last_db_saved_gloss = gloss

                    finally:

                        db.close()

                _latest_result = {
                    "gloss": gloss,
                    "confidence": float(conf),
                    "ts": time.time(),
                }

            await asyncio.sleep(0.05)

    except asyncio.CancelledError:
        print("AI Processor stopped.")
# ==========================================================
# AUTH
# ==========================================================

@app.post("/api/auth/login", response_model=Token)
async def login(
    user_data: UserLogin,
    db: Session = Depends(database.get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.username == user_data.username)
        .first()
    )

    if not user or not verify_password(
        user_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an admin",
        )

    access_token = create_access_token(
        data={"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ==========================================================
# GESTURE
# ==========================================================

@app.get("/api/gesture/available")
async def get_available_gestures():
    return {
        "gestures": list(LABEL_MAP.values())
        if LABEL_MAP
        else []
    }


@app.get(
    "/api/admin/gestures",
    response_model=list[schemas.GestureResponse],
)
async def get_gestures(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):
    return (
        db.query(models.Gesture)
        .order_by(models.Gesture.created_at.desc())
        .all()
    )


# ==========================================================
# CREATE GESTURE
# ==========================================================

@app.post(
    "/api/admin/gestures",
    response_model=schemas.GestureResponse,
)
async def create_gesture(
    name: str = Form(...),
    video: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    existing = (
        db.query(models.Gesture)
        .filter(models.Gesture.name == name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Gesture already exists",
        )

    extension = (
        Path(video.filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            400,
            "Unsupported video format",
        )

    if video.content_type not in ALLOWED_MIME:
        raise HTTPException(
            400,
            "Invalid MIME type",
        )

    filename = f"{uuid.uuid4()}{extension}"
    file_path = VIDEO_DIR / filename

    # --- BACA FILE SECARA CHUNK (HEMAT RAM) ---
    file_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await video.read(1024 * 1024)  # Baca per 1MB
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > MAX_VIDEO_SIZE:
                    buffer.close()
                    if file_path.exists():
                        file_path.unlink()
                    raise HTTPException(
                        413,
                        "Video melebihi batas maksimal (20MB)"
                    )
                buffer.write(chunk)
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            500,
            f"Gagal menyimpan video: {str(e)}"
        )

    gesture = models.Gesture(
        name=name,
        video_filename=filename,
    )

    db.add(gesture)
    db.commit()
    db.refresh(gesture)

    print(
        f"[UPLOAD] Saved: {filename} (Size: {file_size/1024/1024:.2f} MB)"
    )

    return gesture

# ==========================================================
# UPDATE GESTURE
# ==========================================================

@app.put(
    "/api/admin/gestures/{gesture_id}",
    response_model=schemas.GestureResponse,
)
async def update_gesture(
    gesture_id: int,
    name: str = Form(...),
    video: UploadFile | None = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    gesture = (
        db.query(models.Gesture)
        .filter(models.Gesture.id == gesture_id)
        .first()
    )

    if not gesture:
        raise HTTPException(
            404,
            "Gesture not found",
        )

    duplicate = (
        db.query(models.Gesture)
        .filter(
            models.Gesture.name == name,
            models.Gesture.id != gesture_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            400,
            "Gesture already exists",
        )

    gesture.name = name

    if video is not None and video.filename:

        extension = (
            Path(video.filename)
            .suffix
            .lower()
        )

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                400,
                "Unsupported video format",
            )

        if video.content_type not in ALLOWED_MIME:
            raise HTTPException(
                400,
                "Invalid MIME type",
            )

        if gesture.video_filename:

            old_file = (
                VIDEO_DIR /
                gesture.video_filename
            )

            if old_file.exists():
                old_file.unlink()

        filename = f"{uuid.uuid4()}{extension}"
        file_path = VIDEO_DIR / filename

        # --- BACA FILE SECARA CHUNK (HEMAT RAM) ---
        file_size = 0
        try:
            with open(file_path, "wb") as buffer:
                while True:
                    chunk = await video.read(1024 * 1024)  # Baca per 1MB
                    if not chunk:
                        break
                    file_size += len(chunk)
                    if file_size > MAX_VIDEO_SIZE:
                        buffer.close()
                        if file_path.exists():
                            file_path.unlink()
                        raise HTTPException(
                            413,
                            "Video melebihi batas maksimal"
                        )
                    buffer.write(chunk)
        except Exception as e:
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(
                500,
                f"Gagal menyimpan video: {str(e)}"
            )

        gesture.video_filename = filename

        print(
            f"[UPDATE] Saved: {filename} (Size: {file_size/1024/1024:.2f} MB)"
        )

    db.commit()
    db.refresh(gesture)

    return gesture

# ==========================================================
# DELETE GESTURE
# ==========================================================

@app.delete(
    "/api/admin/gestures/{gesture_id}"
)
async def delete_gesture(
    gesture_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    gesture = (
        db.query(models.Gesture)
        .filter(models.Gesture.id == gesture_id)
        .first()
    )

    if not gesture:
        raise HTTPException(
            404,
            "Gesture not found",
        )

    if gesture.video_filename:

        video_file = (
            VIDEO_DIR /
            gesture.video_filename
        )

        if video_file.exists():
            video_file.unlink()

    db.delete(gesture)

    db.commit()

    return {
        "message": "Gesture deleted successfully"
    }
# ==========================================================
# ACTIVITY LOGS
# ==========================================================

@app.get(
    "/api/admin/activity-logs",
    response_model=list[ActivityLogResponse],
)
async def get_activity_logs(
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    return (
        db.query(models.ActivityLog)
        .order_by(models.ActivityLog.timestamp.desc())
        .limit(limit)
        .all()
    )


@app.delete("/api/admin/activity-logs/{log_id}")
async def delete_activity_log(
    log_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    log = (
        db.query(models.ActivityLog)
        .filter(models.ActivityLog.id == log_id)
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=404,
            detail="Log not found",
        )

    db.delete(log)

    db.commit()

    return {
        "message": "Log deleted successfully"
    }


@app.delete("/api/admin/activity-logs")
async def clear_all_logs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    db.query(models.ActivityLog).delete()

    db.commit()

    return {
        "message": "All logs cleared"
    }


# ==========================================================
# STATISTICS
# ==========================================================

@app.get(
    "/api/admin/statistics",
    response_model=StatisticsResponse,
)
async def get_statistics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    total_gestures = (
        db.query(models.ActivityLog)
        .count()
    )

    unique_gestures = (
        db.query(models.ActivityLog.gesture_text)
        .distinct()
        .count()
    )

    uptime = (
        datetime.now() - _start_time
    ).total_seconds() / 60

    last_log = (
        db.query(models.ActivityLog)
        .order_by(
            models.ActivityLog.timestamp.desc()
        )
        .first()
    )

    last_activity = (
        last_log.timestamp
        if last_log
        else None
    )

    return StatisticsResponse(
        total_gestures=total_gestures,
        active_time_minutes=int(uptime),
        unique_gestures=unique_gestures,
        last_activity=last_activity,
    )


# ==========================================================
# SYSTEM STATUS
# ==========================================================

@app.get(
    "/api/admin/system-status",
    response_model=SystemStatusResponse,
)
async def get_system_status(
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    return SystemStatusResponse(
        camera_online=_is_camera_active,
        device_connected=True,
        last_seen=(
            datetime.now()
            if _is_camera_active
            else None
        ),
    )


# ==========================================================
# EXPORT CSV
# ==========================================================

@app.get("/api/admin/export")
async def export_logs_csv(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(
        get_current_admin_user
    ),
):

    logs = db.query(models.ActivityLog).all()

    rows = [
        "ID,Timestamp,Gesture,Confidence"
    ]

    for log in logs:

        timestamp = (
            log.timestamp.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            if log.timestamp
            else ""
        )

        rows.append(
            f"{log.id},"
            f"{timestamp},"
            f"{log.gesture_text},"
            f"{log.confidence}"
        )

    csv_content = "\n".join(rows)

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=activity_logs.csv"
        },
    )
# ==========================================================
# WEBSOCKET - VIDEO STREAM
# ==========================================================

@app.websocket("/ws/video")
async def websocket_video(websocket: WebSocket):

    global _is_camera_active
    global _latest_frame

    await websocket.accept()

    _is_camera_active = True

    frame_interval = 1 / 10
    last_send = 0

    try:

        while True:

            now = time.time()

            if (
                now - last_send >= frame_interval
                and _latest_frame is not None
            ):

                success, buffer = await asyncio.to_thread(
                    cv2.imencode,
                    ".jpg",
                    _latest_frame,
                    [cv2.IMWRITE_JPEG_QUALITY, 60],
                )

                if success:
                    await websocket.send_bytes(
                        buffer.tobytes()
                    )

                last_send = now

            await asyncio.sleep(0.01)

    except (WebSocketDisconnect, asyncio.CancelledError):
        pass

    finally:

        _is_camera_active = False
        _latest_frame = None


# ==========================================================
# WEBSOCKET - RESULT
# ==========================================================

@app.websocket("/ws/result")
async def websocket_result(websocket: WebSocket):

    global _last_sent_gloss

    await websocket.accept()

    try:

        while True:

            if (
                _latest_result["gloss"]
                != _last_sent_gloss
            ):

                await websocket.send_json(
                    _latest_result
                )

                _last_sent_gloss = (
                    _latest_result["gloss"]
                )

            await asyncio.sleep(0.1)

    except (WebSocketDisconnect, asyncio.CancelledError):
        pass


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
async def root():

    return {
        "message": "BRIDGECOM API",
        "status": "running",
        "version": "1.0.0",
    }