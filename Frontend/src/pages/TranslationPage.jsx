import { useState } from "react";
import { KioskLayout } from "../components/layout/KioskLayout";

export function TranslationPage({ onBack }) {

  const [cameraOn, setCameraOn] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);

  // HANDLE SWITCH
  const handleCameraToggle = () => {

    if (cameraOn) {

      // OFF
      setCameraOn(false);
      setStreamUrl(null);

    } else {

      // ON
      setCameraOn(true);

      // cache buster supaya stream fresh
      setStreamUrl(
        `http://127.0.0.1:8000/video?t=${Date.now()}`
      );

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

              {/* BG */}
              <div className="w-14 h-7 bg-slate-600 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>

              {/* CIRCLE */}
              <div
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${
                  cameraOn ? "translate-x-7" : ""
                }`}
              />

            </label>

          </div>

          {/* VIDEO STREAM */}
          <div className="flex-1 flex items-center justify-center bg-black p-2">

            {streamUrl ? (

              <img
                key={streamUrl}
                src={streamUrl}
                alt="Camera Stream"
                className="max-w-full max-h-full"
              />

            ) : (

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
              ...
            </p>

            {/* STATUS */}
            <p className="text-xs text-slate-500">
              Menunggu input gesture...
            </p>

          </div>

        </aside>

      </main>

    </KioskLayout>
  );
}