import cv2
import threading
import time

class ThreadedCamera:
    def __init__(self, preferred_src=1):
        """
        Inisialisasi kamera menggunakan DirectShow (cv2.CAP_DSHOW) khusus Windows 
        agar proses membuka webcam USB eksternal instan, lancar, dan stabil di 60 FPS.
        """
        self.frame = None
        self.grabbed = False
        self.started = False
        self.read_lock = threading.Lock()
        
        # 1. Coba buka Kamera Utama pilihan (Webcam USB - Index 1) menggunakan DirectShow
        print(f"\n[BridgeCom Camera] Mencoba membuka Kamera Utama (Index {preferred_src}) via DirectShow...")
        self.cap = cv2.VideoCapture(preferred_src, cv2.CAP_DSHOW)
        
        if self.cap.isOpened():
            # PENTING: Set properti resolusi dan FPS SEBELUM membaca frame pertama
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
            self.cap.set(cv2.CAP_PROP_FPS, 60)
            self.grabbed, self.frame = self.cap.read()
        
        # 2. FALLBACK: Jika webcam USB tidak merespons/tidak menghasilkan gambar, beralih ke Kamera Laptop (Index 0)
        if not self.cap.isOpened() or not self.grabbed:
            print(f"[BridgeCom Camera] Kamera Index {preferred_src} tidak aktif atau tidak mengirim frame.")
            print("[BridgeCom Camera] Otomatis beralih ke Kamera Bawaan Laptop (Index 0)...")
            
            if self.cap.isOpened():
                self.cap.release()
            
            # Buka kamera internal laptop via DirectShow
            self.cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
            self.current_src = 0
            
            if self.cap.isOpened():
                self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
                self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
                self.cap.set(cv2.CAP_PROP_FPS, 60)
                self.grabbed, self.frame = self.cap.read()
        else:
            self.current_src = preferred_src

        # 3. VALIDASI AKHIR: Jika DirectShow tidak didukung oleh hardware tertentu
        if self.grabbed:
            print(f"[BridgeCom Camera] BERHASIL! Kamera aktif menggunakan Index: {self.current_src}\n")
        else:
            print("[BridgeCom Camera] DirectShow bermasalah pada device ini. Menggunakan inisialisasi standar...")
            if self.cap.isOpened():
                self.cap.release()
            self.cap = cv2.VideoCapture(0)
            self.current_src = 0
            self.grabbed, self.frame = self.cap.read()

    def start(self):
        if self.started:
            return self
        self.started = True
        # Menjalankan pembacaan frame di thread terpisah agar FPS melesat tinggi
        self.thread = threading.Thread(target=self.update, args=())
        self.thread.daemon = True
        self.thread.start()
        return self

    def update(self):
        """Loop Background Thread untuk mengambil dan memproses frame fisik"""
        while self.started:
            grabbed, frame = self.cap.read()
            if grabbed:
                
                # KUNCI UTAMA 2 (ANTI-MIRROR): Balikkan gambar secara horizontal (efek cermin)
                # Nilai 1 artinya flip secara horizontal. Jika ingin kembali normal tanpa flip, hapus baris ini.
                frame = cv2.flip(frame, 1)

                # KUNCI UTAMA 3 (OPTIMASI): Perkecil ukuran gambar ke format 16:9 yang ringan (640x360)
                # Langkah ini membuat sudut pandang tetap LUAS (tidak zoom) namun CPU tetap hemat.
                frame = cv2.resize(frame, (640, 360))

                with self.read_lock:
                    self.grabbed = grabbed
                    self.frame = frame

    def get_frame(self):
        """Mengambil frame terbaru dari memori secara aman (Thread-Safe)"""
        with self.read_lock:
            if self.frame is not None:
                return self.frame.copy()
            return None

    def release(self):
        """Mematikan thread dan melepaskan resource kamera"""
        self.started = False
        if hasattr(self, 'thread'):
            self.thread.join()
        self.cap.release()
        print(f"[BridgeCom Camera] Kamera Index {self.current_src} berhasil ditutup.")


# =========================================================================
# GLOBAL INTERFACE (Terhubung dengan app.py)
# =========================================================================

camera_stream = None

def init_camera():
    global camera_stream
    if camera_stream is None:
        camera_stream = ThreadedCamera(preferred_src=1).start()
    return camera_stream

def release_camera():
    global camera_stream
    if camera_stream is not None:
        camera_stream.release()
        camera_stream = None

def get_frame():
    global camera_stream
    if camera_stream is None:
        init_camera()
        
    if camera_stream is not None:
        return camera_stream.get_frame()
    return None