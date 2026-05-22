# BridgeCom

BridgeCom is an IoT-based sign language translation system for inclusive learning. The system performs real-time video streaming and gesture detection to translate sign language into readable output.

---

## Requirements

Make sure the following software is installed on your device:

- Node.js
- npm
- Python 3.x
- pip
- Virtual Environment (venv)

---

## Project Structure

```bash
BridgeCom/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── app.py
│   ├── camera.py
│   ├── gesture.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## Frontend Setup and Run

### 1. Navigate to frontend folder

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Frontend server will run at:

```bash
http://localhost:5173
```

---

## Backend Setup and Run

### 1. Navigate to backend folder

```bash
cd Backend
```

### 2. Create virtual environment

Windows:

```bash
python -m venv venv
```

Linux/Mac:

```bash
python3 -m venv venv
```

### 3. Activate virtual environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### 4. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 5. Run backend server using Uvicorn

```bash
uvicorn app:app --reload
```

Backend server will run at:

```bash
http://localhost:8000
```

---

## Usage

1. Start the backend server first.
2. Start the frontend application.
3. Open the frontend URL in your browser.
4. Allow camera access when prompted.
5. Perform sign language gestures in front of the camera.
6. The system will detect gestures and display translations in real time.

---

## Features

- Real-time video streaming
- Real-time gesture detection
- Sign language translation output
- Frontend and backend integration
- FastAPI backend service
- IoT-based communication support

---

## Notes

- Ensure the camera device is connected and accessible.
- Make sure both frontend and backend are running simultaneously.
- Keep the virtual environment activated while running the backend.
- Install all required dependencies before running the application.

---

## Authors

BridgeCom Development Team