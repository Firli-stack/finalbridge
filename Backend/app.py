"""
app.py — FastAPI backend BRIDGECOM (Decoupled + DB + Auth - FINAL FIXED)
"""
import asyncio
import time
import os
from datetime import datetime
from contextlib import asynccontextmanager
import cv2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session

import camera
from camera import get_frame
from gesture import detect_hand, LABEL_MAP
import database
import models
from schemas import (
    UserLogin, Token, ActivityLogResponse, 
    StatisticsResponse, SystemStatusResponse
)
from auth import verify_password, create_access_token, get_current_admin_user

# Global state
_latest_frame = None
_latest_result = {"gloss": None, "confidence": 0.0, "ts": 0.0}
_last_db_saved_gloss = None 
_last_sent_gloss = None 
_is_camera_active = False
_start_time = datetime.now()
_is_shutting_down = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _is_shutting_down
    
    database.Base.metadata.create_all(bind=database.engine)
    ai_task = asyncio.create_task(ai_processor())
    app.state.ai_task = ai_task
    
    yield
    
    _is_shutting_down = True
    print("\n[SHUTDOWN] Stopping backend...")
    
    if hasattr(app.state, 'ai_task') and not app.state.ai_task.done():
        print("[SHUTDOWN] Cancelling AI task...")
        app.state.ai_task.cancel()
        
        try:
            await asyncio.wait_for(app.state.ai_task, timeout=3.0)
            print("[SHUTDOWN] AI task cancelled successfully.")
        except asyncio.CancelledError:
            print("[SHUTDOWN] AI task cancelled.")
        except asyncio.TimeoutError:
            print("[SHUTDOWN] AI task timeout, forcing shutdown...")
        except Exception as e:
            print(f"[SHUTDOWN] Error: {e}")
    
    try:
        camera.release_camera()
        print("[SHUTDOWN] Camera released.")
    except Exception as e:
        print(f"[SHUTDOWN] Error releasing camera: {e}")
    
    print("[SHUTDOWN] Backend stopped cleanly.")
    os._exit(0)

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def ai_processor():
    global _latest_frame, _latest_result, _is_camera_active
    global _last_db_saved_gloss, _is_shutting_down
    
    try:
        while not _is_shutting_down:
            if not _is_camera_active:
                if camera._cap is not None:
                    camera.release_camera()
                await asyncio.sleep(0.1)
                continue
            
            if asyncio.current_task().cancelled():
                break
            
            frame = await asyncio.to_thread(get_frame)
            if frame is None:
                await asyncio.sleep(0.05)
                continue
            
            if asyncio.current_task().cancelled():
                break
            
            frame, gloss, conf = await asyncio.to_thread(detect_hand, frame)
            _latest_frame = frame.copy()
            
            if gloss is not None and gloss != "":
                if gloss != _last_db_saved_gloss:
                    try:
                        db = database.SessionLocal()
                        log = models.ActivityLog(
                            gesture_text=gloss,
                            confidence=float(conf) if conf else 0.0
                        )
                        db.add(log)
                        db.commit()
                        _last_db_saved_gloss = gloss
                    except Exception as e:
                        print(f"[AI-PROCESSOR] ⚠️ DB Save Error: {e}")
                    finally:
                        db.close()
                
                _latest_result["gloss"] = gloss
                _latest_result["confidence"] = float(conf) if conf else 0.0
                _latest_result["ts"] = time.time()
            
            await asyncio.sleep(0.05)
    except asyncio.CancelledError:
        print("[AI-PROCESSOR] Task cancelled.")
    except Exception as e:
        print(f"[AI-PROCESSOR] Unexpected error: {e}")

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not an admin"
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/gesture/available")
async def get_available_gestures():
    return {"gestures": list(LABEL_MAP.values()) if LABEL_MAP else []}

@app.get("/api/admin/activity-logs", response_model=list[ActivityLogResponse])
async def get_activity_logs(
    limit: int = 100, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    logs = db.query(models.ActivityLog).order_by(
        models.ActivityLog.timestamp.desc()
    ).limit(limit).all()
    return logs

@app.delete("/api/admin/activity-logs/{log_id}")
async def delete_activity_log(
    log_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    log = db.query(models.ActivityLog).filter(models.ActivityLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}

@app.delete("/api/admin/activity-logs")
async def clear_all_logs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db.query(models.ActivityLog).delete()
    db.commit()
    return {"message": "All logs cleared"}

@app.get("/api/admin/statistics", response_model=StatisticsResponse)
async def get_statistics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    total_gestures = db.query(models.ActivityLog).count()
    unique_gestures = db.query(models.ActivityLog.gesture_text).distinct().count()
    uptime = (datetime.now() - _start_time).total_seconds() / 60
    
    last_log = db.query(models.ActivityLog).order_by(
        models.ActivityLog.timestamp.desc()
    ).first()
    last_activity = last_log.timestamp if last_log else None
    
    return StatisticsResponse(
        total_gestures=total_gestures,
        active_time_minutes=int(uptime),
        unique_gestures=unique_gestures,
        last_activity=last_activity
    )

@app.get("/api/admin/system-status", response_model=SystemStatusResponse)
async def get_system_status(
    current_user: models.User = Depends(get_current_admin_user)
):
    return SystemStatusResponse(
        camera_online=_is_camera_active,
        device_connected=True,
        last_seen=datetime.now() if _is_camera_active else None
    )

@app.get("/api/admin/export")
async def export_logs_csv(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    logs = db.query(models.ActivityLog).all()
    csv_content = "ID,Timestamp,Gesture,Confidence\n"
    for log in logs:
        timestamp = log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else ""
        csv_content += f"{log.id},{timestamp},{log.gesture_text},{log.confidence}\n"
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=activity_logs.csv"}
    )

@app.websocket("/ws/video")
async def websocket_video(websocket: WebSocket):
    global _is_camera_active, _latest_frame
    
    await websocket.accept()
    _is_camera_active = True
    
    last_send = 0
    frame_interval = 1.0 / 10
    
    try:
        while True:
            now = time.time()
            if now - last_send >= frame_interval and _latest_frame is not None:
                _, buf = await asyncio.to_thread(
                    cv2.imencode, ".jpg", _latest_frame, [cv2.IMWRITE_JPEG_QUALITY, 60]
                )
                await websocket.send_bytes(buf.tobytes())
                last_send = time.time()
            
            await asyncio.sleep(0.01)
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass  # Handle shutdown gracefully
    finally:
        _is_camera_active = False
        _latest_frame = None

@app.websocket("/ws/result")
async def websocket_result(websocket: WebSocket):
    global _last_sent_gloss
    await websocket.accept()
    try:
        while True:
            if _latest_result["gloss"] != _last_sent_gloss:
                await websocket.send_json(_latest_result)
                _last_sent_gloss = _latest_result["gloss"]
            
            await asyncio.sleep(0.1)
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass  # Handle shutdown gracefully

@app.get("/")
async def root():
    return {"message": "BRIDGECOM API", "status": "running"}