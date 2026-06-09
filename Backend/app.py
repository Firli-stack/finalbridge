"""
app.py — FastAPI backend BRIDGECOM
"""
import asyncio
import time
from contextlib import asynccontextmanager
import cv2
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

import camera
from camera import get_frame
from gesture import detect_hand

_result: dict = {"gloss": None, "confidence": None, "ts": 0.0}

@asynccontextmanager
async def lifespan(app: FastAPI):
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

async def _generate(request: Request):
    try:
        while not await request.is_disconnected():
            frame = await asyncio.to_thread(get_frame)
            if frame is None:
                await asyncio.sleep(0.05)
                continue
            
            # Panggil detect_hand TANPA parameter holistic lagi
            frame, gloss, conf = await asyncio.to_thread(detect_hand, frame)

            if gloss:
                _result["gloss"] = gloss
                _result["confidence"] = conf
                _result["ts"] = time.time()

            _, buf = await asyncio.to_thread(
                cv2.imencode, ".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80]
            )

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buf.tobytes()
                + b"\r\n"
            )
    finally:
        camera.release_camera()

@app.get("/video")
async def video_feed(request: Request):
    return StreamingResponse(
        _generate(request),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )

@app.get("/result")
async def get_result():
    return JSONResponse(_result)