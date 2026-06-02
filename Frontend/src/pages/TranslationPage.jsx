import { useState, useEffect, useRef } from "react";
import { KioskLayout } from "../components/layout/KioskLayout";

export function TranslationPage({ onBack }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const [savedText, setSavedText] = useState("...");
  const [statusText, setStatusText] = useState("Menunggu input gesture...");
  
  // State baru untuk melacak deteksi tangan (untuk outline merah/hijau)
  const [handDetected, setHandDetected] = useState(false);

  const lastWordRef = useRef("");
  const lastAddedTimeRef = useRef(0);

  // HANDLE SWITCH
  const handleCameraToggle = () => {
    if (cameraOn) {
      setCameraOn(false);
      setStreamUrl(null);
      setIsCameraLoading(false);
      setSavedText("...");
      setStatusText("Menunggu input gesture...");
      setHandDetected(false);
      lastWordRef.current = "";
      lastAddedTimeRef.current = 0;
    } else {
      setCameraOn(true);
      setIsCameraLoading(true);
      setStreamUrl(`http://127.0.0.1:8000/video?t=${Date.now()}`);
    }
  };

  // EFFECT POLLING
  // CARI BAGIAN EFFECT POLLING INI DI TRANSLATIONPAGE.JSX KAMU
useEffect(() => {
  let intervalId = null;

  // KUNCI UTAMA: Hanya jalankan interval pembacaan jika kamera bernilai TRUE (ON)
  if (cameraOn) {
    intervalId = setInterval(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/translation");
        if (response.ok) {
          const data = await response.json();
          const currentWord = data.translation;
          
          if (typeof setHandDetected === "function") {
            setHandDetected(data.hand_detected);
          }

          if (currentWord && currentWord !== "Menunggu Gerakan..." && currentWord !== "Kamera Nonaktif") {
            const now = Date.now();
            if (currentWord !== lastWordRef.current || (now - lastAddedTimeRef.current > 2000)) {
              setSavedText((prev) => (prev === "..." ? currentWord : prev + " " + currentWord));
              lastWordRef.current = currentWord;
              lastAddedTimeRef.current = now;
            }
            setStatusText(`Mendeteksi: ${currentWord}`);
          } else if (currentWord === "Menunggu Gerakan...") {
            setStatusText("Menunggu input gesture...");
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data terjemahan:", error);
      }
    }, 200); // Mengambil data setiap 200ms
  }

  // CLEANUP FUNCTION: Mematikan interval secara instan saat kamera dimatikan
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [cameraOn]); // <-- PASTIKAN 'cameraOn' ADA DI DALAM BRACKET DEPENDENCY INI

  return (
    <KioskLayout>
      {/* HEADER */}
      <header className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <h1 className="text-lg font-bold text-blue-400">
          BRIDGECOM - Translation Mode
        </h1>
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          &larr; Kembali ke Beranda
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 flex gap-4 overflow-hidden">
        
        {/* VIDEO SECTION */}
        <section className="flex-1 bg-slate-800 rounded-xl flex flex-col border border-slate-600 min-w-0">
          
          {/* CAMERA CONTROL */}
          <div className="p-3 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">
              Camera Control
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={cameraOn}
                onChange={handleCameraToggle}
              />
              <div className="w-14 h-7 bg-slate-600 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
              <div
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${
                  cameraOn ? "translate-x-7" : ""
                }`}
              />
            </label>
          </div>

          {/* VIDEO STREAM CONTAINER (Ditambahkan Logika Outline Dinamis di Sini) */}
          <div className={`flex-1 flex items-center justify-center bg-black p-2 relative overflow-hidden rounded-b-xl transition-all duration-300 ${
            cameraOn && !isCameraLoading
              ? handDetected 
                ? "ring-4 ring-inset ring-green-500"  // Hijau saat mendeteksi gerakan tangan
                : "ring-4 ring-inset ring-red-500"    // Merah saat tangan keluar dari frame / tidak deteksi
              : ""
          }`}>
            
            <img
              src={streamUrl || ""}
              alt="Camera Stream"
              onLoad={() => setIsCameraLoading(false)}
              className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
                cameraOn && !isCameraLoading ? "opacity-100" : "opacity-0 absolute"
              }`} // <-- w-full h-full object-cover membuat video full memenuhi kotak video stream
            />

            {/* loading indicator */}
            {cameraOn && isCameraLoading && (
              <div className="text-center flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin"></div>
                <div>
                  <p className="text-blue-400 text-base font-semibold animate-pulse">
                    Menyiapkan Sensor Kamera...
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Memuat model AI deteksi gestur tangan
                  </p>
                </div>
              </div>
            )}

            {!cameraOn && (
              <div className="text-center">
                <p className="text-slate-400 text-lg font-semibold">
                  Kamera Nonaktif
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  Aktifkan kamera untuk memulai translasi
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TRANSLATION PANEL */}
        <aside className="w-80 bg-slate-800 rounded-xl flex flex-col border border-slate-600 shrink-0">
          <div className="p-3 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300">
              Terjemahan
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {/* RESULT */}
            <p className="text-2xl font-bold text-white mb-2">
              {savedText}
            </p>
            {/* STATUS */}
            <p className="text-xs text-slate-500">
              {statusText}
            </p>
          </div>
        </aside>

      </main>
    </KioskLayout>
  );
}