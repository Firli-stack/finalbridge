import { useState, useEffect, useRef } from "react";
import { KioskLayout } from "../components/layout/KioskLayout";

export function TranslationPage({ onBack }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState("...");
  const [confidence, setConfidence] = useState(0);
  
  const canvasRef = useRef(null);
  const wsVideoRef = useRef(null);
  const wsResultRef = useRef(null);
  
  // REF buat tracking state terakhir tanpa kena stale closure di useEffect
  const lastWordRef = useRef(null);

  useEffect(() => {
    if (!cameraOn) {
      setCurrentWord("...");
      setConfidence(0);
      lastWordRef.current = null;
      setIsCameraLoading(true);
      
      if (wsVideoRef.current) {
        wsVideoRef.current.close();
        wsVideoRef.current = null;
      }
      if (wsResultRef.current) {
        wsResultRef.current.close();
        wsResultRef.current = null;
      }
      return;
    }

    setIsCameraLoading(true);

    // 1. WebSocket untuk video stream
    const wsVideo = new WebSocket("ws://127.0.0.1:8000/ws/video");
    wsVideo.binaryType = "arraybuffer";
    wsVideoRef.current = wsVideo;

    wsVideo.onopen = () => {
      setIsCameraLoading(false);
    };

    wsVideo.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    };

    wsVideo.onerror = (err) => console.error("Video WebSocket error:", err);

    // 2. WebSocket untuk hasil deteksi
    const wsResult = new WebSocket("ws://127.0.0.1:8000/ws/result");
    wsResultRef.current = wsResult;

    wsResult.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // FIX: Cek pakai ref, bukan state variable, untuk hindari stale closure
      if (data.gloss && data.gloss !== lastWordRef.current) {
        console.log("[FRONTEND] ✅ Update teks:", data.gloss);
        lastWordRef.current = data.gloss;
        setCurrentWord(data.gloss);
        setConfidence(data.confidence ? Math.round(data.confidence * 100) : 0);
      }
    };

    wsResult.onerror = (err) => console.error("Result WebSocket error:", err);

    return () => {
      if (wsVideoRef.current) wsVideoRef.current.close();
      if (wsResultRef.current) wsResultRef.current.close();
    };
  }, [cameraOn]);

  const handleCameraToggle = () => {
    setCameraOn(!cameraOn);
  };

  return (
    <KioskLayout>
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

      <main className="flex-1 p-4 flex gap-4 overflow-hidden">
        <section className="flex-1 bg-slate-800 rounded-xl flex flex-col border border-slate-600 min-w-0">
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

          <div className="flex-1 flex items-center justify-center bg-black p-2 relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className={`max-w-full max-h-full rounded-lg transition-opacity duration-500 ${
                cameraOn && !isCameraLoading ? "opacity-100" : "opacity-0 absolute"
              }`}
            />

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

        <aside className="w-80 bg-slate-800 rounded-xl flex flex-col border border-slate-600 shrink-0">
          <div className="p-3 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300">
              Terjemahan
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center">
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