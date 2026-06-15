"""
app.py — FastAPI backend BRIDGECOM (Decoupled + Smart Camera Control)
"""
import asyncio
import time
from contextlib import asynccontextmanager
import cv2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import camera
from camera import get_frame
from gesture import detect_hand

_latest_frame = None
_latest_result = {"gloss": None, "confidence": 0.0, "ts": 0.0}
_last_sent_gloss = None
_is_camera_active = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ai_task = asyncio.create_task(ai_processor())
    yield
    camera.release_camera()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def ai_processor():
    """Background task untuk AI processing + Camera lifecycle"""
    global _latest_frame, _latest_result, _is_camera_active
    
    while True:
        if not _is_camera_active:
            # KUNCI: Release kamera di sini, bukan di WebSocket handler
            if camera._cap is not None:
                print("[AI-PROCESSOR] 📴 Releasing camera...")
                camera.release_camera()
            await asyncio.sleep(0.5)
            continue
        
        frame = await asyncio.to_thread(get_frame)
        if frame is None:
            await asyncio.sleep(0.05)
            continue
        
        frame, gloss, conf = await asyncio.to_thread(detect_hand, frame)
        _latest_frame = frame.copy()
        
        if gloss is not None and gloss != "":
            _latest_result["gloss"] = gloss
            _latest_result["confidence"] = float(conf)
            _latest_result["ts"] = time.time()
        
        await asyncio.sleep(0.05)

@app.get("/result")
async def get_result():
    return JSONResponse(_latest_result)

@app.websocket("/ws/video")
async def websocket_video(websocket: WebSocket):
    global _is_camera_active, _latest_frame
    
    await websocket.accept()
    _is_camera_active = True
    
    last_send = 0
    frame_interval = 1.0 / 15
    
    try:
        while True:
            now = time.time()
            if now - last_send >= frame_interval and _latest_frame is not None:
                _, buf = await asyncio.to_thread(
                    cv2.imencode, ".jpg", _latest_frame, [cv2.IMWRITE_JPEG_QUALITY, 75]
                )
                await websocket.send_bytes(buf.tobytes())
                last_send = time.time()
            
            await asyncio.sleep(0.01)
    except WebSocketDisconnect:
        pass
    finally:
        _is_camera_active = False
        _latest_frame = None
        # JANGAN release kamera di sini, biarin ai_processor yang handle

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
    except WebSocketDisconnect:
        pass