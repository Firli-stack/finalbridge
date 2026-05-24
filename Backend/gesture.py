import mediapipe as mp
import cv2
import time

mp_draw = mp.solutions.drawing_utils

prev_time = 0


def detect_hand(frame, hands):

    global prev_time

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = hands.process(rgb)

    text = "Tangan Tidak Terdeteksi"
    color = (0, 0, 255)

    if result.multi_hand_landmarks:

        text = "Tangan Terdeteksi"
        color = (0, 255, 0)

        for hand_landmarks in result.multi_hand_landmarks:

            mp_draw.draw_landmarks(
                frame,
                hand_landmarks,
                mp.solutions.hands.HAND_CONNECTIONS
            )

    # STATUS
    cv2.putText(
        frame,
        text,
        (20, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        color,
        2
    )

    # FPS
    current_time = time.time()

    delta_time = current_time - prev_time

    fps = 1 / delta_time if delta_time > 0 else 0

    prev_time = current_time

    h, w, c = frame.shape

    cv2.putText(
        frame,
        f'FPS: {int(fps)}',
        (w - 140, h - 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 255, 0),
        2
    )

    return frame, text