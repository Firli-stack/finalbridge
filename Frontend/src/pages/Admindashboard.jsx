import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────
const LogoutIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const HandIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D1B20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
    <path d="M14 10V4a2 2 0 0 0-4 0v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-16 0v-5a2 2 0 0 1 4 0v4"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ── Dummy initial log ────────────────────────────────────────
const INITIAL_LOG = [
  { time: "10:02", text: "Permisi" },
  { time: "10:02", text: "Saya mau tanya" },
  { time: "10:03", text: "Terima kasih" },
];

const GESTURES = ["Permisi", "Saya", "Terima kasih", "Tidak", "Mau", "Tanya"];

export function Admindashboard({ onLogout }) {
  const [log, setLog] = useState(INITIAL_LOG);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleHapusLog = () => {
    if (confirmClear) {
      setLog([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .da-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180.86deg, #00BFFF 24.72%, #BDEEF5 57.96%);
          padding-bottom: 60px;
        }

        /* ─ Header ─ */
        .da-header {
          height: 110px;
          background: #38B6FF;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 64px;
          box-shadow: 0 4px 4px rgba(0,0,0,0.18);
          position: sticky; top: 0; z-index: 10;
        }
        .da-welcome {
          font-size: 26px; font-weight: 510; line-height: 38px; letter-spacing: 0.4px;
          color: #000; max-width: 520px;
        }
        .da-logout-btn {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.2);
          border: none; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #000;
          transition: background .18s, transform .15s;
        }
        .da-logout-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.06); }

        /* ─ Main grid ─ */
        .da-body {
          max-width: 1380px;
          margin: 48px auto 0;
          padding: 0 60px;
          display: grid;
          grid-template-columns: 420px 1fr;
          grid-template-rows: auto auto;
          gap: 32px;
        }

        /* glass card base */
        .da-card {
          background: rgba(255,255,255,0.32);
          box-shadow: 0 4px 50px 2px rgba(0,0,0,0.18);
          border-radius: 10px;
          padding: 28px 32px;
          animation: da-up .4s ease both;
        }
        @keyframes da-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .da-card:nth-child(1) { animation-delay:.05s; }
        .da-card:nth-child(2) { animation-delay:.10s; }
        .da-card:nth-child(3) { animation-delay:.15s; }
        .da-card:nth-child(4) { animation-delay:.20s; }

        .da-card-title {
          font-size: 26px; font-weight: 600; letter-spacing: 0.4px;
          color: #000; margin-bottom: 24px;
        }

        /* ─ Status System ─ */
        .da-status-row {
          display: flex; align-items: center; gap: 14px;
          font-size: 20px; font-weight: 400; color: #000;
          margin-bottom: 14px;
        }
        .da-dot {
          width: 30px; height: 30px; border-radius: 50%;
          background: #00FF2F;
          box-shadow: 0 0 10px #00FF44, 0 0 3px #00FF44;
          flex-shrink: 0;
        }

        /* ─ Statistik ─ */
        .da-stat-row {
          display: flex; align-items: center; gap: 14px;
          font-size: 20px; font-weight: 400; color: #000;
          margin-bottom: 18px;
        }

        /* ─ Log Aktifitas (spans 2 rows on right) ─ */
        .da-log-card {
          grid-row: 1 / 3;
          display: flex; flex-direction: column;
          position: relative;
        }
        .da-log-list {
          flex: 1;
          overflow-y: auto;
          max-height: 440px;
          padding-right: 4px;
        }
        .da-log-list::-webkit-scrollbar { width: 4px; }
        .da-log-list::-webkit-scrollbar-track { background: transparent; }
        .da-log-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 2px; }

        .da-log-item {
          font-size: 22px; font-weight: 500; line-height: 40px; letter-spacing: 0.4px;
          color: #000;
          animation: da-up .3s ease;
        }
        .da-log-time { opacity: 0.6; }

        .da-log-empty {
          font-size: 16px; color: rgba(0,0,0,0.4); font-style: italic; margin-top: 12px;
        }

        .da-hapus-btn {
          align-self: flex-end;
          margin-top: 20px;
          padding: 8px 24px;
          background: rgba(244,54,58,0.82);
          border: none; border-radius: 90px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.4px;
          color: #fff; cursor: pointer;
          text-shadow: 0 2px 4px rgba(0,0,0,0.22);
          transition: background .18s, transform .15s;
          box-shadow: 0 3px 10px rgba(200,0,0,0.22);
        }
        .da-hapus-btn:hover { background: rgba(220,30,30,0.92); transform: scale(1.04); }
        .da-hapus-btn.confirm { background: rgba(180,0,0,0.9); animation: da-pulse .5s ease infinite alternate; }
        @keyframes da-pulse { to { box-shadow: 0 0 14px rgba(220,0,0,0.5); } }

        /* ─ Daftar Gesture (full width) ─ */
        .da-gesture-wrap {
          grid-column: 1 / -1;
        }
        .da-gesture-card {
          padding: 28px 40px;
        }
        .da-gesture-list {
          columns: 3; column-gap: 40px;
        }
        .da-gesture-item {
          font-size: 18px; font-weight: 500; line-height: 44px; letter-spacing: 0.4px;
          color: #000;
          break-inside: avoid;
          padding-left: 16px;
          position: relative;
        }
        .da-gesture-item::before {
          content: '·';
          position: absolute; left: 0;
          color: #005DFF; font-size: 26px; line-height: 44px;
        }

        @media (max-width: 960px) {
          .da-body { grid-template-columns: 1fr; padding: 0 20px; }
          .da-log-card { grid-row: auto; }
          .da-gesture-list { columns: 2; }
          .da-header { padding: 0 24px; }
          .da-welcome { font-size: 18px; }
        }
      `}</style>

      <div className="da-root">

        {/* Header */}
        <header className="da-header">
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.55)', marginBottom: 2, letterSpacing: 0.3 }}>
              Dashboard Admin
            </div>
            <div className="da-welcome">
              Selamat Datang! Mari cek aktifitas alat dan webnya
            </div>
          </div>
          <button className="da-logout-btn" onClick={onLogout} title="Keluar">
            <LogoutIcon />
          </button>
        </header>

        {/* Main */}
        <div className="da-body">

          {/* STATUS SYSTEM */}
          <div className="da-card" style={{ animationDelay: '.05s' }}>
            <div className="da-card-title">STATUS SYSTEM</div>
            <div className="da-status-row">
              <div className="da-dot" />
              <span>Kamera</span>
            </div>
            <div className="da-status-row">
              <div className="da-dot" />
              <span>Device Terkoneksi</span>
            </div>
          </div>

          {/* LOG AKTIFITAS — spans 2 rows */}
          <div className="da-card da-log-card" style={{ animationDelay: '.10s' }}>
            <div className="da-card-title">LOG AKTIFITAS</div>
            <div className="da-log-list">
              {log.length === 0
                ? <div className="da-log-empty">Belum ada log aktifitas.</div>
                : log.map((item, i) => (
                  <div key={i} className="da-log-item">
                    <span className="da-log-time">[{item.time}]</span> {item.text}
                  </div>
                ))
              }
            </div>
            <button
              className={`da-hapus-btn${confirmClear ? ' confirm' : ''}`}
              onClick={handleHapusLog}
            >
              {confirmClear ? 'Yakin hapus?' : 'Hapus Log'}
            </button>
          </div>

          {/* STATISTIK */}
          <div className="da-card" style={{ animationDelay: '.15s' }}>
            <div className="da-card-title">STATISTIK</div>
            <div className="da-stat-row">
              <HandIcon />
              <span>Total Gesture: <strong>{log.length + 3}</strong></span>
            </div>
            <div className="da-stat-row">
              <ClockIcon />
              <span>Waktu Aktif&nbsp;: 20 Menit</span>
            </div>
          </div>

          {/* DAFTAR GESTURE */}
          <div className="da-gesture-wrap" style={{ animationDelay: '.20s' }}>
            <div className="da-card-title" style={{ paddingLeft: 0 }}>DAFTAR GESTURE</div>
            <div className="da-card da-gesture-card" style={{ animationDelay: '.22s', marginTop: 0 }}>
              <div className="da-gesture-list">
                {GESTURES.map((g) => (
                  <div key={g} className="da-gesture-item">{g}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}