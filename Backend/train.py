import cv2
import mediapipe as mp
import numpy as np
import os
import pickle
from glob import glob
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# ============================================================
# STEP 1 - EKSTRAKSI KEYPOINT
# ============================================================
mp_holistic = mp.solutions.holistic

def extract_keypoints(results):
    pose = np.array([[r.x, r.y, r.z, r.visibility]
                     for r in results.pose_landmarks.landmark]).flatten() \
        if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[r.x, r.y, r.z]
                   for r in results.left_hand_landmarks.landmark]).flatten() \
        if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[r.x, r.y, r.z]
                   for r in results.right_hand_landmarks.landmark]).flatten() \
        if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])  # 258 fitur

def process_video(video_path, max_frames=30):
    cap = cv2.VideoCapture(video_path)
    frames_keypoints = []
    with mp_holistic.Holistic(min_detection_confidence=0.5) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(image)
            frames_keypoints.append(extract_keypoints(results))
    cap.release()
    if len(frames_keypoints) >= max_frames:
        return np.array(frames_keypoints[:max_frames])
    else:
        pad = np.zeros((max_frames - len(frames_keypoints), 258))
        return np.vstack([frames_keypoints, pad])

DATASET_PATH = './dataset'
KEYPOINTS_PATH = './keypoints'
os.makedirs(KEYPOINTS_PATH, exist_ok=True)

video_files = glob(f'{DATASET_PATH}/*.mp4')
print(f"Total video: {len(video_files)}")

for i, vpath in enumerate(video_files):
    fname = os.path.basename(vpath).replace('.mp4', '.npy')
    save_path = os.path.join(KEYPOINTS_PATH, fname)
    if not os.path.exists(save_path):
        kp = process_video(vpath)
        np.save(save_path, kp)
    if (i+1) % 100 == 0:
        print(f"Progress ekstraksi: {i+1}/{len(video_files)}")

print("✅ Ekstraksi selesai!")

# ============================================================
# STEP 2 - LOAD DATA & TRAINING
# ============================================================
npy_files = glob(f'{KEYPOINTS_PATH}/*.npy')
print(f"Total keypoint files: {len(npy_files)}")

X, y = [], []
for fpath in npy_files:
    fname = os.path.basename(fpath)
    label = int(fname.split('_label')[1].split('_')[0])
    data = np.load(fpath)
    X.append(data)
    y.append(label)

X = np.array(X)
y = np.array(y)
print(f"Shape X: {X.shape}, Shape y: {y.shape}")

y_cat = to_categorical(y, num_classes=32)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat, test_size=0.2, random_state=42, stratify=y
)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# ============================================================
# STEP 3 - BUILD MODEL LSTM
# ============================================================
model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(30, 258)),
    Dropout(0.3),
    LSTM(128, return_sequences=False),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(32, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()

callbacks = [
    EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
    ModelCheckpoint('model_bisindo.h5', save_best_only=True, monitor='val_accuracy')
]

history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=callbacks
)

# ============================================================
# STEP 4 - SIMPAN MODEL & LABEL
# ============================================================
model.save('model_bisindo.h5')

# Simpan label mapping
label_map = {i: f"label_{i}" for i in range(32)}
with open('label_map.pkl', 'wb') as f:
    pickle.dump(label_map, f)

loss, acc = model.evaluate(X_test, y_test)
print(f"\n✅ Training selesai!")
print(f"Test Accuracy: {acc*100:.2f}%")
print(f"Model tersimpan: model_bisindo.h5")