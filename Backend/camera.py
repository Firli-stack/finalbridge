"""
camera.py — Manajemen kamera OpenCV dengan auto-detect
"""
import cv2

_cap = None

def init_camera():
    global _cap
    if _cap is not None and _cap.isOpened():
        return _cap

    for i in range(3):
        print(f"[camera] Mencoba kamera index {i}...")
        cap = cv2.VideoCapture(i, cv2.CAP_V4L2)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret and frame is not None:
                print(f"[camera] ✅ Kamera {i} berhasil dibuka!")
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                cap.set(cv2.CAP_PROP_FPS, 15)
                cap.set(cv2.CAP_PROP_BUFFERSIZE, 1) # Minimalisir lag
                _cap = cap
                return _cap
        cap.release()
    
    print("[camera] ❌ Tidak ada kamera yang terdeteksi!")
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