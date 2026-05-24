import cv2

cap = None

def init_camera():
    global cap
    if cap is None or not cap.isOpened():
        cap = cv2.VideoCapture(0)
    return cap

def release_camera():
    global cap
    if cap is not None:
        cap.release()
        cap = None

def get_frame():
    global cap
    if cap is None or not cap.isOpened():
        init_camera()
        
    success, frame = cap.read()
    if not success:
        return None
    return frame