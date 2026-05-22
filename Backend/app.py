from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import cv2
import mediapipe as mp

from camera import get_frame
from gesture import detect_hand

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_hands = mp.solutions.hands


async def generate_frames(request: Request):

    # HANDS LOCAL (BUKAN GLOBAL)
    hands = mp_hands.Hands(
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    try:

        while True:

            # kalau client disconnect → stop instant
            if await request.is_disconnected():
                break

            frame = get_frame()

            if frame is None:
                continue

            frame, text = detect_hand(frame, hands)

            _, buffer = cv2.imencode('.jpg', frame)

            frame_bytes = buffer.tobytes()

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' +
                frame_bytes +
                b'\r\n'
            )

    finally:
        hands.close()


@app.get("/video")
async def video_feed(request: Request):

    return StreamingResponse(
        generate_frames(request),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )