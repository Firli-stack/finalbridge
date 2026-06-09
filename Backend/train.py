"""
train.py — Training BISINDO 10 kosa kata

Kosa kata aktif:
  0  Air          6  Maaf         12 Apa
  1  Belajar      10 Terima kasih 13 Siapa
                  11 Tuli         14 Kapan
                                  15 Di mana
                                  16 Mengapa
"""

import os
import pickle
from glob import glob

import cv2
import mediapipe as mp
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.layers import LSTM, BatchNormalization, Dense, Dropout
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical

# ── Config ────────────────────────────────────────────────────────────────────
ACTIVE_VOCAB: dict[int, str] = {
    0:  "Air",
    1:  "Belajar",
    6:  "Maaf",
    10: "Terima kasih",
    11: "Tuli",
    12: "Apa",
    13: "Siapa",
    14: "Kapan",
    15: "Di mana",
    16: "Mengapa",
}
NUM_CLASSES    = len(ACTIVE_VOCAB)   # 10
SEQ_LEN        = 30
FEAT_DIM       = 258                 # 33*4 + 21*3 + 21*3
DATASET_PATH   = "./dataset"
KEYPOINTS_PATH = "./keypoints"
MODEL_PATH     = "model_bisindo.h5"
LABEL_MAP_PATH = "label_map.pkl"

os.makedirs(KEYPOINTS_PATH, exist_ok=True)

# Mapping: label asli (0–31) → class index (0–9)
LABEL_TO_IDX = {lbl: idx for idx, lbl in enumerate(sorted(ACTIVE_VOCAB))}
IDX_TO_GLOSS = {idx: ACTIVE_VOCAB[lbl] for lbl, idx in LABEL_TO_IDX.items()}

print("=" * 56)
print(f"Kosa kata aktif ({NUM_CLASSES} kata):")
for lbl, gloss in sorted(ACTIVE_VOCAB.items()):
    print(f"  [{lbl:>2}] {gloss}")
print("=" * 56)

# ── Step 1: Ekstraksi keypoint ────────────────────────────────────────────────
mp_holistic = mp.solutions.holistic


def _kp(results) -> np.ndarray:
    pose = (np.array([[r.x, r.y, r.z, r.visibility]
                       for r in results.pose_landmarks.landmark]).flatten()
            if results.pose_landmarks else np.zeros(33 * 4))
    lh   = (np.array([[r.x, r.y, r.z]
                       for r in results.left_hand_landmarks.landmark]).flatten()
            if results.left_hand_landmarks else np.zeros(21 * 3))
    rh   = (np.array([[r.x, r.y, r.z]
                       for r in results.right_hand_landmarks.landmark]).flatten()
            if results.right_hand_landmarks else np.zeros(21 * 3))
    return np.concatenate([pose, lh, rh])


def process_video(path: str) -> np.ndarray:
    cap  = cv2.VideoCapture(path)
    kps  = []
    with mp_holistic.Holistic(model_complexity=1,
                               min_detection_confidence=0.5,
                               min_tracking_confidence=0.5) as h:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            kps.append(_kp(h.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))))
    cap.release()

    if len(kps) >= SEQ_LEN:
        idx = np.linspace(0, len(kps) - 1, SEQ_LEN, dtype=int)
        return np.array([kps[i] for i in idx])
    pad = np.zeros((SEQ_LEN - len(kps), FEAT_DIM))
    return np.vstack([kps, pad]) if kps else np.zeros((SEQ_LEN, FEAT_DIM))


def _label_from_name(name: str) -> int | None:
    for lbl in ACTIVE_VOCAB:
        if f"_label{lbl}_" in name or name.endswith(f"_label{lbl}.mp4"):
            return lbl
    return None


all_vids    = glob(f"{DATASET_PATH}/*.mp4")
active_vids = [v for v in all_vids if _label_from_name(os.path.basename(v)) is not None]
print(f"\nVideo total : {len(all_vids)}")
print(f"Video aktif : {len(active_vids)}\n")

for i, vp in enumerate(active_vids):
    fname = os.path.basename(vp).replace(".mp4", ".npy")
    sp    = os.path.join(KEYPOINTS_PATH, fname)
    if not os.path.exists(sp):
        np.save(sp, process_video(vp))
    if (i + 1) % 50 == 0 or i + 1 == len(active_vids):
        print(f"  Ekstraksi: {i+1}/{len(active_vids)}")

print("✅ Ekstraksi selesai!\n")

# ── Step 2: Load data ─────────────────────────────────────────────────────────
npy = glob(f"{KEYPOINTS_PATH}/*.npy")
X, y = [], []
for fp in npy:
    lbl = _label_from_name(os.path.basename(fp).replace(".npy", ".mp4"))
    if lbl is None:
        continue
    X.append(np.load(fp))
    y.append(LABEL_TO_IDX[lbl])

X     = np.array(X)
y     = np.array(y)
y_cat = to_categorical(y, num_classes=NUM_CLASSES)

print(f"Shape X : {X.shape}")
print(f"Shape y : {y.shape}")
for idx, gloss in IDX_TO_GLOSS.items():
    print(f"  [{idx}] {gloss:<15} → {(y == idx).sum()} sampel")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTrain: {X_train.shape} | Test: {X_test.shape}\n")

# ── Step 3: Model ─────────────────────────────────────────────────────────────
model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, FEAT_DIM)),
    BatchNormalization(),
    Dropout(0.3),
    LSTM(128, return_sequences=False),
    BatchNormalization(),
    Dropout(0.3),
    Dense(64, activation="relu"),
    Dropout(0.2),
    Dense(NUM_CLASSES, activation="softmax"),
])

model.compile(optimizer=Adam(1e-3),
              loss="categorical_crossentropy",
              metrics=["accuracy"])
model.summary()

callbacks = [
    EarlyStopping(monitor="val_loss", patience=12, restore_best_weights=True, verbose=1),
    ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor="val_accuracy", verbose=1),
    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6, verbose=1),
]

print("\n🚀 Mulai training...\n")
model.fit(X_train, y_train,
          epochs=60, batch_size=16,
          validation_data=(X_test, y_test),
          callbacks=callbacks)

# ── Step 4: Simpan ────────────────────────────────────────────────────────────
model.save(MODEL_PATH)

with open(LABEL_MAP_PATH, "wb") as f:
    pickle.dump(IDX_TO_GLOSS, f)

loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"\n{'='*56}")
print(f"✅ Training selesai!")
print(f"   Akurasi test : {acc*100:.2f}%")
print(f"   Loss test    : {loss:.4f}")
print(f"   Model        : {MODEL_PATH}")
print(f"   Label map    : {LABEL_MAP_PATH}")
print(f"{'='*56}")