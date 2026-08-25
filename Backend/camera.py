"""
camera.py — Manajemen kamera OpenCV dengan auto-detect multi-platform (Windows / Linux / IP Camera)
"""
import os
import platform
import cv2

_cap = None

def init_camera():
    global _cap
    if _cap is not None and _cap.isOpened():
        return _cap

    # Ambil konfigurasi sumber kamera dari environment variable (default: '0')
    source_env = os.getenv("CAMERA_SOURCE", "0").strip()
    is_windows = platform.system().lower() == "windows"

    # Jika sumber adalah angka index (0, 1, 2)
    if source_env.isdigit():
        target_indices = [int(source_env)]
        # Tambahkan fallback index lain jika index utama gagal
        for idx in range(3):
            if idx not in target_indices:
                target_indices.append(idx)

        for idx in target_indices:
            print(f"[camera] Mencoba membuka kamera index {idx}...")
            # Gunakan CAP_DSHOW untuk Windows agar cepat dan stabil, CAP_V4L2 untuk Linux
            if is_windows:
                cap = cv2.VideoCapture(idx, cv2.CAP_DSHOW)
            else:
                cap = cv2.VideoCapture(idx, cv2.CAP_V4L2)
                if not cap.isOpened():
                    cap = cv2.VideoCapture(idx)

            if cap.isOpened():
                ret, frame = cap.read()
                if ret and frame is not None:
                    print(f"[camera] ✅ Kamera index {idx} berhasil dibuka!")
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    cap.set(cv2.CAP_PROP_FPS, 15)
                    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Minimalkan latency
                    _cap = cap
                    return _cap
                cap.release()
    else:
        # Jika sumber berupa URL stream (RTSP/HTTP) atau file video
        print(f"[camera] Membuka streaming video dari: {source_env}")
        cap = cv2.VideoCapture(source_env)
        if cap.isOpened():
            print(f"[camera] ✅ Stream kamera {source_env} berhasil terhubung!")
            _cap = cap
            return _cap
        cap.release()

    print("[camera] ❌ Tidak ada kamera yang terdeteksi! Pastikan izin kamera aktif.")
    return None

def release_camera():
    global _cap
    if _cap is not None:
        _cap.release()
        _cap = None

def get_frame():
    global _cap
    if _cap is None or not _cap.isOpened():
        init_camera()
        if _cap is None:
            return None
            
    ret, frame = _cap.read()
    if not ret:
        return None
    return frame