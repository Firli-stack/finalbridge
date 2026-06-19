# 🤟 BridgeCom

### Bridge Communication System Using IoT and Artificial Intelligence

BridgeCom adalah sistem penerjemah Bahasa Isyarat Indonesia (BISINDO) berbasis **Internet of Things (IoT)** dan **Artificial Intelligence (AI)** yang dirancang untuk membantu komunikasi antara penyandang Tuli dan masyarakat umum.

Sistem menggunakan **Raspberry Pi**, **kamera**, dan **monitor** untuk menangkap gerakan tangan pengguna secara real-time, mengenali gesture menggunakan model AI berbasis **TensorFlow Lite**, kemudian menampilkan hasil terjemahan secara langsung melalui antarmuka web.

---

# 🎯 Project Objectives

* Membantu komunikasi penyandang Tuli menggunakan teknologi AI.
* Mengimplementasikan Computer Vision pada perangkat IoT.
* Menyediakan sistem penerjemah BISINDO secara real-time.
* Mengoptimalkan model AI agar dapat berjalan pada Raspberry Pi.
* Menjadi media pembelajaran penerapan Embedded AI dan IoT.

---

# ✨ Features

* 🎥 Real-Time Gesture Detection
* 🤖 BISINDO Recognition menggunakan AI
* 📺 Live Translation Display
* 📊 Admin Dashboard
* 📝 Activity Logging
* 📈 System Statistics
* 📤 Export Activity Logs (CSV)
* 🔐 JWT Authentication
* 🌐 WebSocket Real-Time Communication
* 🍓 Raspberry Pi Deployment Support

---

# 🛠 Technologies Used

## Hardware

* Raspberry Pi 4 Model B
* USB Camera / Raspberry Pi Camera Module
* Monitor Display
* MicroSD Card
* Power Supply

## Software

### Backend

* FastAPI
* Uvicorn
* SQLAlchemy
* SQLite
* JWT Authentication

### Frontend

* React.js
* Vite
* Tailwind CSS

### Artificial Intelligence

* TensorFlow Lite
* MediaPipe
* OpenCV
* NumPy

---

# 🏗 System Architecture

```text
┌─────────────────┐
│     Camera      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│      Raspberry Pi       │
│                         │
│  MediaPipe Hands        │
│  TensorFlow Lite Model  │
│  FastAPI Backend        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│     React Frontend      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│        Monitor          │
└─────────────────────────┘
```

---

# 📋 Requirements

## Hardware Requirements

* Raspberry Pi 4 (Recommended)
* Camera Module / USB Webcam
* Monitor
* Keyboard & Mouse
* MicroSD Card 32GB+

## Software Requirements

* Python 3.10+
* Node.js 18+
* npm 9+
* Git

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/username/bridgecom.git
cd bridgecom
```

---

## 2. Setup Backend

```bash
cd Backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Raspberry Pi
source venv/bin/activate

pip install -r requirements.txt

python create_admin.py
```

### Expected Output

```text
Admin user berhasil dibuat!
Username : admin
Password : admin123
```

---

## 3. Setup Frontend

Buka terminal baru:

```bash
cd Frontend

npm install
```

---

# 🍓 Deployment on Raspberry Pi

## Update System

```bash
sudo apt update
sudo apt upgrade -y
```

## Install Python

```bash
sudo apt install python3 python3-pip python3-venv -y
```

## Install NodeJS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

## Jalankan Backend

```bash
cd Backend

source venv/bin/activate

uvicorn app:app --host 0.0.0.0 --port 8000
```

## Jalankan Frontend

```bash
cd Frontend

npm run dev -- --host
```

---

# ▶️ Running the Application

## Start Backend

```bash
uvicorn app:app --reload
```

### Expected Output

```text
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete
```

---

## Start Frontend

```bash
npm run dev
```

### Expected Output

```text
VITE ready

Local:
http://localhost:5173
```

---

# 🌐 Access Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

# 🔐 Admin Login

## Default Credentials

```text
Username : admin
Password : admin123
```

> ⚠️ IMPORTANT: Segera ganti password default setelah login pertama.

---

# 📁 Project Structure

```text
bridgecom/
│
├── Backend/
│   ├── app.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── create_admin.py
│   ├── bridgecom.db
│   ├── requirements.txt
│   └── ...
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Model/
│   ├── bisindo_gesture_siformer.tflite
│   └── bisindo_labels.json
│
├── README.md
│
└── Documentation/
```

---

# 🔌 API Endpoints

## Public Endpoints

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | /                      | API Status         |
| POST   | /api/auth/login        | Login Admin        |
| GET    | /api/gesture/available | Available Gestures |

---

## WebSocket Endpoints

| Endpoint   | Description              |
| ---------- | ------------------------ |
| /ws/video  | Real-Time Video Stream   |
| /ws/result | Gesture Detection Result |

---

## Admin Endpoints

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | /api/admin/activity-logs      |
| DELETE | /api/admin/activity-logs/{id} |
| DELETE | /api/admin/activity-logs      |
| GET    | /api/admin/statistics         |
| GET    | /api/admin/system-status      |
| GET    | /api/admin/export             |

---

# 🧠 AI Model

BridgeCom menggunakan model klasifikasi gesture BISINDO yang telah dilatih menggunakan dataset gesture tangan dan diekspor ke format TensorFlow Lite.

### Model Specifications

| Item               | Value                 |
| ------------------ | --------------------- |
| Framework          | TensorFlow Lite       |
| Input              | Hand Landmark         |
| Landmark Detection | MediaPipe Hands       |
| Inference Device   | Raspberry Pi          |
| Output             | BISINDO Gesture Class |

---

# 🐛 Troubleshooting

## ModuleNotFoundError

Pastikan file berikut tersedia:

```text
database.py
models.py
schemas.py
auth.py
```

---

## WebSocket Error

```bash
pip install "uvicorn[standard]"
```

---

## bcrypt Error

```bash
pip install bcrypt==4.0.1
```

---

## Camera Not Detected

* Tutup aplikasi lain yang menggunakan kamera.
* Restart Raspberry Pi.
* Pastikan kamera terdeteksi:

```bash
ls /dev/video*
```

---

## SQLite Database Locked

Restart backend atau hapus database:

```bash
rm bridgecom.db
python create_admin.py
```

---

# 🔒 Security

## Ganti JWT Secret Key

Pada file:

```python
auth.py
```

Cari:

```python
SECRET_KEY = "your_secret_key"
```

Ganti dengan string acak minimal 32 karakter.

---

# ✅ Best Practices

* Ganti password default admin.
* Jangan commit file database ke GitHub.
* Gunakan HTTPS saat deployment.
* Backup database secara berkala.
* Ganti JWT Secret Key sebelum produksi.

---

# 🤝 Contributing

1. Fork repository
2. Create feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push branch

```bash
git push origin feature/AmazingFeature
```

5. Open Pull Request

---

# 👥 Team Members

| Name                              | Role                     |
| --------------------------------- | ------------------------ |
| Firli Hanifurahman                | Backend & IoT  Developer |
| Marsel Vicentius Paltakma Naibaho | FrontEnd & IoT Developer |

---

# 📄 License

Project ini dikembangkan untuk keperluan akademik, penelitian, dan pengembangan teknologi aksesibilitas berbasis AI dan IoT.

---

# 🙏 Acknowledgements

* MediaPipe
* TensorFlow Lite
* FastAPI
* React
* Raspberry Pi Foundation
* OpenCV
* SQLite

---

**BridgeCom**
*Bridging Communication Through Artificial Intelligence and IoT* 🤟
