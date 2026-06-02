import mediapipe as mp
import cv2
import time
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from collections import deque

mp_draw = mp.solutions.drawing_utils

# 1. Load Model dan Label Map
model = load_model('model_bisindo.h5')
with open('label_map.pkl', 'rb') as f:
    label_map = pickle.load(f)

# 2. Siapkan penampung untuk 30 frame
sequence = deque(maxlen=30)
prev_time = 0
current_translation = "Menunggu Gerakan..."
hand_detected = False

# Fungsi ekstraksi harus sama persis dengan yang ada di train.py
def extract_keypoints(results):
    pose = np.array([[r.x, r.y, r.z, r.visibility] for r in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[r.x, r.y, r.z] for r in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[r.x, r.y, r.z] for r in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])

# FUNGSI GETTER: Untuk mengambil nilai terjemahan terbaru dari app.py
def get_current_translation():
    return current_translation

def get_hand_status():
    global hand_detected
    return hand_detected

def detect_hand(frame, holistic):
    global prev_time, sequence, current_translation, hand_detected

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb)

    # Gambar landmarks (opsional untuk kebutuhan visualisasi UI)
    #if results.left_hand_landmarks or results.right_hand_landmarks:
    #    hand_detected = True
    #else:
    #    hand_detected = False
        
   # if results.left_hand_landmarks:
     #   mp_draw.draw_landmarks(frame, results.left_hand_landmarks, mp.solutions.holistic.HAND_CONNECTIONS)
   # if results.right_hand_landmarks:
    #    mp_draw.draw_landmarks(frame, results.right_hand_landmarks, mp.solutions.holistic.HAND_CONNECTIONS)

    # 3. Ekstraksi dan Prediksi
    #keypoints = extract_keypoints(results)
   # sequence.append(keypoints)

    keypoints = extract_keypoints(results)
    sequence.append(keypoints)

    if len(sequence) == 30:
        input_data = np.expand_dims(sequence, axis=0)
        res = model.predict(input_data)[0]
        predicted_index = np.argmax(res)
        
        if res[predicted_index] > 0.7:
            current_translation = label_map[predicted_index]

    # --- Teks Terjemahan di Sini Sudah Dihapus ---

    # FPS (Tetap dipertahankan di pojok bawah video jika diperlukan)
    #current_time = time.time()
   # delta_time = current_time - prev_time
    #fps = 120 / delta_time if delta_time > 0 else 0
    #prev_time = current_time

    #h, w, c = frame.shape
    #cv2.putText(frame, f'FPS: {int(fps)}', (w - 140, h - 40), 
    #            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)

    return frame, current_translation
