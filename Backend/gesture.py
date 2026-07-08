"""
gesture.py — Deteksi gestur BISINDO dengan TFLite (Siformer)
"""
import json
import threading
import time
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision
import os
import urllib.request

# ── Load Model TFLite & Labels ─────────────────────────────────────────────
try:
    import tensorflow as tf
    interpreter = tf.lite.Interpreter(model_path="bisindo_gesture_siformer.tflite")
    interpreter.allocate_tensors()
    
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    with open("bisindo_labels.json", "r", encoding="utf-8") as f:
        LABEL_MAP = json.load(f)
    
    MODEL_LOADED = True
    print("[gesture] ✅ TFLite model loaded successfully!")
except Exception as e:
    MODEL_LOADED = False
    print(f"[gesture] ️  Model tidak ditemukan ({e}), mode deteksi dasar.")
    LABEL_MAP = {}

# ─ MediaPipe Setup (Pose + Hand Landmarker) ───────────────────────────────
MODELS_DIR = "mp_models"
os.makedirs(MODELS_DIR, exist_ok=True)

HAND_MODEL_PATH = os.path.join(MODELS_DIR, "hand_landmarker.task")
POSE_MODEL_PATH = os.path.join(MODELS_DIR, "pose_landmarker.task")

if not os.path.exists(HAND_MODEL_PATH):
    print("[gesture] Downloading Hand Landmarker model...")
    urllib.request.urlretrieve(
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        HAND_MODEL_PATH
    )

if not os.path.exists(POSE_MODEL_PATH):
    print("[gesture] Downloading Pose Landmarker model...")
    urllib.request.urlretrieve(
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        POSE_MODEL_PATH
    )

hand_options = vision.HandLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=HAND_MODEL_PATH),
    num_hands=2,
    min_hand_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

pose_options = vision.PoseLandmarkerOptions(
    base_options=mp_python.BaseOptions(model_asset_path=POSE_MODEL_PATH),
    min_pose_detection_confidence=0.5
)

SEQ_LEN = 30
CONF_THRESHOLD = 0.60

HAND_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8),
    (5, 9), (9, 10), (10, 11), (11, 12), (9, 13), (13, 14), (14, 15), (15, 16),
    (13, 17), (17, 18), (18, 19), (19, 20), (0, 17)
]

POSE_CONNECTIONS = [
    (11, 12), (11, 13), (13, 15), (12, 14), (14, 16), (11, 23), (12, 24), (23, 24)
]

class _State:
    def __init__(self):
        self.lock = threading.Lock()
        self.buffer = []
        self.result_gloss = None
        self.result_conf = None
        self.infer_busy = False
        self._prev_time = time.time()
        self.hand_landmarker = None
        self.pose_landmarker = None
        self.frame_count = 0
        self.last_pose_result = None
        self.last_hand_result = None

_st = _State()

def _init_landmarkers():
    if _st.hand_landmarker is None:
        _st.hand_landmarker = vision.HandLandmarker.create_from_options(hand_options)
    if _st.pose_landmarker is None:
        _st.pose_landmarker = vision.PoseLandmarker.create_from_options(pose_options)
    return _st.hand_landmarker, _st.pose_landmarker

def _draw_landmarks(frame, landmarks, connections, h, w, color=(0, 220, 130)):
    for start_idx, end_idx in connections:
        if start_idx < len(landmarks) and end_idx < len(landmarks):
            start = landmarks[start_idx]
            end = landmarks[end_idx]
            start_pt = (int(start.x * w), int(start.y * h))
            end_pt = (int(end.x * w), int(end.y * h))
            cv2.line(frame, start_pt, end_pt, (200, 255, 230), 1)
    
    for landmark in landmarks:
        pt = (int(landmark.x * w), int(landmark.y * h))
        cv2.circle(frame, pt, 4, color, -1)

def _normalize_siformer_style(pose_result, hand_result):
    body_features = np.zeros(24)
    l_hand_features = np.zeros(42)
    r_hand_features = np.zeros(42)

    if pose_result.pose_landmarks:
        lms = pose_result.pose_landmarks[0]
        neck_x = (lms[11].x + lms[12].x) / 2
        neck_y = (lms[11].y + lms[12].y) / 2
        
        head_metric = np.sqrt((lms[11].x - lms[12].x)**2 + (lms[11].y - lms[12].y)**2)
        if head_metric == 0:
            head_metric = np.sqrt((neck_x - lms[0].x)**2 + (neck_y - lms[0].y)**2)

        if head_metric > 0:
            start_x = neck_x - 3 * head_metric
            start_y = lms[2].y + head_metric
            end_x = neck_x + 3 * head_metric
            end_y = start_y - 6 * head_metric

            body_pts = [
                (lms[0].x, lms[0].y), (neck_x, neck_y), (lms[5].x, lms[5].y),
                (lms[2].x, lms[2].y), (lms[8].x, lms[8].y), (lms[7].x, lms[7].y),
                (lms[12].x, lms[12].y), (lms[11].x, lms[11].y), (lms[14].x, lms[14].y),
                (lms[13].x, lms[13].y), (lms[16].x, lms[16].y), (lms[15].x, lms[15].y)
            ]

            norm_body = []
            for x, y in body_pts:
                nx = (x - start_x) / (end_x - start_x) if end_x != start_x else 0
                ny = (y - end_y) / (start_y - end_y) if start_y != end_y else 0
                norm_body.extend([nx, ny])
            body_features = np.array(norm_body)

    def normalize_hand(hand_lms):
        xs = [lm.x for lm in hand_lms]
        ys = [lm.y for lm in hand_lms]
        width, height = max(xs) - min(xs), max(ys) - min(ys)
        
        if width > height:
            delta_x = 0.1 * width
            delta_y = delta_x + ((width - height) / 2)
        else:
            delta_y = 0.1 * height
            delta_x = delta_y + ((height - width) / 2)

        start_x, end_x = min(xs) - delta_x, max(xs) + delta_x
        start_y, end_y = min(ys) - delta_y, max(ys) + delta_y

        norm_hand = []
        for lm in hand_lms:
            nx = (lm.x - start_x) / (end_x - start_x) if end_x != start_x else 0
            ny = (lm.y - start_y) / (end_y - start_y) if end_y != start_y else 0
            norm_hand.extend([nx, ny])
        return np.array(norm_hand)

    if hand_result.hand_landmarks:
        for i, hand_lms in enumerate(hand_result.hand_landmarks):
            if i < len(hand_result.handedness):
                label = hand_result.handedness[i][0].category_name
                if label == "Left":
                    l_hand_features = normalize_hand(hand_lms)
                else:
                    r_hand_features = normalize_hand(hand_lms)

    return np.concatenate([body_features, l_hand_features, r_hand_features])

def _infer(seq: np.ndarray):
    global _st
    try:
        interpreter.set_tensor(input_details[0]['index'], seq[np.newaxis].astype(np.float32))
        interpreter.invoke()
        
        probs = interpreter.get_tensor(output_details[0]['index'])[0]
        best_idx = int(np.argmax(probs))
        best_conf = float(probs[best_idx])
        
        label_key = str(best_idx)
        gloss = LABEL_MAP.get(label_key, None)
        
        with _st.lock:
            if best_conf >= CONF_THRESHOLD and gloss:
                _st.result_gloss = gloss
                _st.result_conf = best_conf
    finally:
        with _st.lock:
            _st.infer_busy = False

def detect_hand(frame: np.ndarray):
    global _st
    _st.frame_count += 1

    hand_landmarker, pose_landmarker = _init_landmarkers()
    
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    
    if _st.frame_count % 3 == 0:
        pose_res = pose_landmarker.detect(mp_image)
        hand_res = hand_landmarker.detect(mp_image)

        _st.last_pose_result = pose_res
        _st.last_hand_result = hand_res
    else:
        pose_res = _st.last_pose_result
        hand_res = _st.last_hand_result

        if pose_res is None or hand_res is None:
            return frame, _st.result_gloss, _st.result_conf
    
    h, w = frame.shape[:2]
    
    if pose_res.pose_landmarks:
        _draw_landmarks(frame, pose_res.pose_landmarks[0], POSE_CONNECTIONS, h, w, (0, 220, 130))
    
    hand_found = False
    for hand_lms in hand_res.hand_landmarks:
        hand_found = True
        _draw_landmarks(frame, hand_lms, HAND_CONNECTIONS, h, w, (255, 200, 0))

    status_txt = "Tangan Terdeteksi" if hand_found else "Tidak Ada Tangan"
    status_color = (0, 230, 100) if hand_found else (60, 60, 200)
    cv2.putText(frame, status_txt, (16, 44), cv2.FONT_HERSHEY_SIMPLEX, 0.65, status_color, 2, cv2.LINE_AA)

    now = time.time()
    fps = 1.0 / max(now - _st._prev_time, 1e-6)
    _st._prev_time = now
    cv2.putText(frame, f"FPS {int(fps)}", (w - 110, h - 16), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 220, 0), 2, cv2.LINE_AA)

    if MODEL_LOADED:
        kp = _normalize_siformer_style(pose_res, hand_res)
        
        with _st.lock:
            _st.buffer.append(kp)
            if len(_st.buffer) > SEQ_LEN:
                _st.buffer.pop(0)
            ready = len(_st.buffer) == SEQ_LEN
            busy = _st.infer_busy

        if ready and not busy:
            with _st.lock:
                seq = np.array(_st.buffer)
                _st.infer_busy = True
            threading.Thread(target=_infer, args=(seq,), daemon=True).start()

        with _st.lock:
            gloss = _st.result_gloss
            conf = _st.result_conf

        if gloss:
            cv2.rectangle(frame, (12, h - 80), (min(w - 12, 400), h - 12), (0, 0, 0), -1)
            cv2.putText(frame, gloss, (20, h - 32), cv2.FONT_HERSHEY_DUPLEX, 1.3, (255, 255, 255), 2, cv2.LINE_AA)
            if conf:
                cv2.putText(frame, f"{int(conf*100)}%", (20, h - 16), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 230, 100), 1, cv2.LINE_AA)
    
    return frame, _st.result_gloss, _st.result_conf