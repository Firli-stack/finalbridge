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
# Import fungsi detect_hand dan getter terjemahan dari gesture.py
from gesture import detect_hand, get_current_translation, get_hand_status

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Kamera dibuka secara dinamis saat dipanggil
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

# UBAH DI SINI: Gunakan holistic, bukan hands, agar cocok dengan model_bisindo.h5 (258 fitur)
mp_holistic = mp.solutions.holistic

# Pastikan import holistic di bagian atas app.py
mp_holistic = mp.solutions.holistic

async def generate_frames(request: Request):
    # Mengoptimalkan parameter MediaPipe Holistic untuk Perangkat Edge / Laptop agar Ringan
    holistic = mp_holistic.Holistic(
        static_image_mode=False,        # False = Mode tracking video (Jauh lebih cepat dari gambar statis)
        model_complexity=0,             # KUNCI UTAMA: 0 = Lite (Saves CPU, sangat direkomendasikan untuk Raspberry Pi)
        min_detection_confidence=0.5,   # Diturunkan ke 0.5 agar deteksi awal lebih cepat
        min_tracking_confidence=0.5
    )

    # Variabel untuk teknik Frame Skipping
    frame_counter = 0
    last_text = "Menunggu Gerakan..."
    color = (0, 0, 255)

    try:
        while True:
            if await request.is_disconnected():
                break

            # Ambil frame dari camera.py
            frame = await asyncio.to_thread(get_frame)

            if frame is None:
                await asyncio.sleep(0.01)
                continue

            frame_counter += 1

            # TEKNIK FRAME SKIPPING: Jalankan AI Holistic hanya setiap 3 frame sekali
            if frame_counter % 3 == 0:
                # Pastikan fungsi detect_hand di gesture.py menerima objek 'holistic'
                frame, text = await asyncio.to_thread(detect_hand, frame, holistic)
                last_text = text
                color = (0, 255, 0) if "Terdeteksi" in last_text else (0, 0, 255)
            else:
                # Frame yang dilewati tetap diberi teks status terakhir agar video mengalir 60 FPS
                cv2.putText(
                    frame,
                    last_text,
                    (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    color,
                    2
                )

            # Kompresi gambar ke JPEG
            _, buffer = await asyncio.to_thread(cv2.imencode, '.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' +
                frame_bytes +
                b'\r\n'
            )

    finally:
        holistic.close()
        camera.release_camera()


@app.get("/video")
async def video_feed(request: Request):
    return StreamingResponse(
        generate_frames(request), 
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# TAMBAHKAN ENDPOINT INI: Untuk melayani request polling dari React Frontend
@app.get("/translation")
async def get_translation():
    """
    Endpoint untuk mengambil hasil terjemahan sekaligus status deteksi tangan.
    """
    return {
        "translation": get_current_translation(),
        "hand_detected": get_hand_status()  # <-- Mengirimkan status true/false ke frontend
    }