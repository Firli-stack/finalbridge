import time
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import cv2
import mediapipe as mp

import camera
from camera import get_frame
from gesture import detect_hand

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Kamera dibuka secara dinamis saat dipanggil, tidak perlu dikunci dari awal
    yield
    # Shutdown: Pastikan dilepas saat aplikasi ditutup penuh
    camera.release_camera()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_hands = mp.solutions.hands

# Menggunakan async generator agar responsif terhadap sinyal pembatalan (shutdown/disconnect)
# tetapi memindahkan operasi blocking berat ke thread pool terpisah menggunakan asyncio.to_thread.
async def generate_frames(request: Request):
    hands = mp_hands.Hands(
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    try:
        while True:
            # Pengecekan pemutusan koneksi (disconnect) yang sangat responsif
            if await request.is_disconnected():
                break

            # Menjalankan I/O kamera secara non-blocking di thread terpisah
            frame = await asyncio.to_thread(get_frame)

            if frame is None:
                # Hindari tight loop (CPU 100%) dengan jeda tidur non-blocking
                await asyncio.sleep(0.1)
                continue

            # Menjalankan CPU-bound MediaPipe secara non-blocking di thread terpisah
            frame, text = await asyncio.to_thread(detect_hand, frame, hands)

            # Menjalankan kompresi OpenCV secara non-blocking di thread terpisah
            _, buffer = await asyncio.to_thread(cv2.imencode, '.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' +
                frame_bytes +
                b'\r\n'
            )

    finally:
        hands.close()
        # Lepaskan kamera saat stream dihentikan (tutup koneksi/kamera off di FE)
        # agar lampu LED kamera laptop padam secara bersih.
        camera.release_camera()


@app.get("/video")
async def video_feed(request: Request):
    return StreamingResponse(
        generate_frames(request),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )