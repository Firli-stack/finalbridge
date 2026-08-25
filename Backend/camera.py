"""
camera.py — Manajemen kamera OpenCV dengan auto-detect multi-platform, thread-safe locking, dan auto-reconnect
"""
import os
import platform
import threading
import time
import cv2

_cap = None
_lock = threading.Lock()
_last_failed_time = 0
RETRY_COOLDOWN = 3.0  # Jeda detik sebelum mencoba mendeteksi kamera ulang jika sebelumnya gagal

def init_camera():
    global _cap, _last_failed_time
    with _lock:
        if _cap is not None and _cap.isOpened():
            return _cap

        # Cegah CPU spike / blocking loop jika kamera sedang tidak tersedia
        if time.time() - _last_failed_time < RETRY_COOLDOWN:
            return None

        source_env = os.getenv("CAMERA_SOURCE", "0").strip()
        is_windows = platform.system().lower() == "windows"

        if source_env.isdigit():
            target_indices = [int(source_env)]
            for idx in range(3):
                if idx not in target_indices:
                    target_indices.append(idx)

            for idx in target_indices:
                print(f"[camera] Mencoba membuka kamera index {idx}...")
                if is_windows:
                    cap = cv2.VideoCapture(idx, cv2.CAP_DSHOW)
                else:
                    cap = cv2.VideoCapture(idx, cv2.CAP_V4L2)
                    if not cap.isOpened():
                        cap = cv2.VideoCapture(idx)

                if cap.isOpened():
                    ret, frame = cap.read()
                    if ret and frame is not None:
                        print(f"[camera] [OK] Kamera index {idx} berhasil dibuka!")
                        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                        cap.set(cv2.CAP_PROP_FPS, 15)
                        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                        _cap = cap
                        return _cap
                    cap.release()
        else:
            print(f"[camera] Membuka streaming video dari: {source_env}")
            cap = cv2.VideoCapture(source_env)
            if cap.isOpened():
                print(f"[camera] [OK] Stream kamera {source_env} berhasil terhubung!")
                _cap = cap
                return _cap
            cap.release()

        _last_failed_time = time.time()
        print("[camera] [WARN] Tidak ada kamera yang terdeteksi! Pastikan izin kamera aktif.")

        return None

def release_camera():
    global _cap
    with _lock:
        if _cap is not None:
            try:
                _cap.release()
            except Exception as e:
                print(f"[camera] Error releasing camera: {e}")
            _cap = None

def get_frame():
    global _cap
    if _cap is None or not _cap.isOpened():
        init_camera()
        if _cap is None:
            return None

    with _lock:
        if _cap is None or not _cap.isOpened():
            return None
        ret, frame = _cap.read()
        if not ret:
            print("[camera] ⚠️ Frame read gagal. Me-reset pointer kamera...")
            try:
                _cap.release()
            except Exception:
                pass
            _cap = None
            return None
        return frame