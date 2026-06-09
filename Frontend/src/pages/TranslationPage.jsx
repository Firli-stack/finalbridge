import { useState, useEffect } from "react";
import { KioskLayout } from "../components/layout/KioskLayout";

export function TranslationPage({ onBack }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  
  // STATE BARU: Untuk menampung hasil terjemahan dari backend
  const [currentWord, setCurrentWord] = useState("...");
  const [confidence, setConfidence] = useState(0);

  // EFFECT BARU: Polling hasil deteksi dari backend setiap 500ms
  useEffect(() => {
    if (!cameraOn) {
      setCurrentWord("...");
      setConfidence(0);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/result");
        if (res.ok) {
          const data = await res.json();
          // Jika ada kata yang terdeteksi, update tampilan
          if (data.gloss) {
            setCurrentWord(data.gloss);
            setConfidence(data.confidence ? Math.round(data.confidence * 100) : 0);
          }
        }
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    }, 500);

    // Cleanup interval saat komponen unmount atau kamera dimatikan
    return () => clearInterval(interval);
  }, [cameraOn]);

  // HANDLE SWITCH
  const handleCameraToggle = () => {
    if (cameraOn) {
      // OFF
      setCameraOn(false);
      setStreamUrl(null);
      setIsCameraLoading(false);
    } else {
      // ON
      setCameraOn(true);
      setIsCameraLoading(true);
      // Cache buster supaya stream fresh
      setStreamUrl(`http://127.0.0.1:8000/video?t=${Date.now()}`);
    }
  };

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
          ← Kembali ke Beranda
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
            {/* SWITCH */}
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

          {/* VIDEO STREAM */}
          <div className="flex-1 flex items-center justify-center bg-black p-2 relative overflow-hidden">
            <img
              src={streamUrl || ""}
              alt="Camera Stream"
              onLoad={() => setIsCameraLoading(false)}
              className={`max-w-full max-h-full rounded-lg transition-opacity duration-500 ${
                cameraOn && !isCameraLoading ? "opacity-100" : "opacity-0 absolute"
              }`}
            />

            {/* Loading indicator */}
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

        {/* TRANSLATION PANEL (SUDAH DI-UPDATE) */}
        <aside className="w-80 bg-slate-800 rounded-xl flex flex-col border border-slate-600 shrink-0">
          <div className="p-3 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300">
              Terjemahan
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center">
            {/* RESULT (Muncul Perkata) */}
            <div className="text-center w-full">
              <p className="text-4xl font-bold text-white mb-2 break-words">
                {currentWord}
              </p>
              {cameraOn && currentWord !== "..." && (
                <p className="text-sm text-green-400 font-semibold">
                  Akurasi: {confidence}%
                </p>
              )}
            </div>

            {/* STATUS */}
            <p className="text-xs text-slate-500 mt-4 text-center">
              {cameraOn 
                ? "Mendeteksi gestur tangan secara real-time..." 
                : "Menunggu input gesture..."}
            </p>
          </div>
        </aside>
      </main>
    </KioskLayout>
  );
}