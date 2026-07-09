import { useState, useEffect } from "react";

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
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export function Admindashboard({ onLogout }) {
  const [logs, setLogs] = useState([]);
  const [gestures, setGestures] = useState([]);
  const [stats, setStats] = useState({ total_gestures: 0, active_time_minutes: 0, unique_gestures: 0 });
  const [systemStatus, setSystemStatus] = useState({ camera_online: false, device_connected: false });
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  const API_URL = window.location.origin;
  const getToken = () => localStorage.getItem("admin_token");

  // Fetch Log Aktivitas
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/activity-logs`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else if (res.status === 401 || res.status === 403) {
        onLogout();
      }
    } catch (e) { console.error("Error fetch logs:", e); }
  };

  // Fetch Daftar Gesture
  const fetchGestures = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gesture/available`);
      if (res.ok) {
        const data = await res.json();
        setGestures(data.gestures || []);
      }
    } catch (e) { console.error("Error fetch gestures:", e); }
  };

  // Fetch Statistik
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/statistics`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) { console.error("Error fetch stats:", e); }
  };

  // Fetch Status System
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/system-status`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (e) { console.error("Error fetch system status:", e); }
  };

  // Load data pertama kali & auto-refresh tiap 5 detik
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchLogs(), fetchGestures(), fetchStats(), fetchSystemStatus()]);
      setLoading(false);
    };
    loadAll();
    
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
      fetchSystemStatus();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Hapus Semua Log
  const handleHapusLog = async () => {
    if (confirmClear) {
      try {
        const res = await fetch(`${API_URL}/api/admin/activity-logs`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.ok) {
          setLogs([]);
          fetchStats();
        }
      } catch (e) { console.error(e); }
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  // Hapus Log Per Item
  const handleDeleteLog = async (logId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/activity-logs/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setLogs(logs.filter(log => log.id !== logId));
        fetchStats();
      }
    } catch (e) { console.error(e); }
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/export`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
  };

// Format waktu ISO ke HH:mm (TANPA timezone conversion)
const formatTime = (isoString) => {
  if (!isoString) return "";
  
  // Langsung parse tanpa manipulasi timezone
  const date = new Date(isoString);
  
  // Cek apakah valid
  if (isNaN(date.getTime())) return "";
  
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .da-root { font-family: 'Poppins', sans-serif; min-height: 100vh; background: linear-gradient(180.86deg, #00BFFF 24.72%, #BDEEF5 57.96%); padding-bottom: 60px; }
        .da-header { height: 110px; background: #38B6FF; border-bottom: 1px solid rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: space-between; padding: 0 64px; box-shadow: 0 4px 4px rgba(0,0,0,0.18); position: sticky; top: 0; z-index: 10; }
        .da-welcome { font-size: 26px; font-weight: 510; line-height: 38px; letter-spacing: 0.4px; color: #000; max-width: 520px; }
        .da-logout-btn { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #000; transition: background .18s, transform .15s; }
        .da-logout-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.06); }
        .da-body { max-width: 1380px; margin: 48px auto 0; padding: 0 60px; display: grid; grid-template-columns: 420px 1fr; grid-template-rows: auto auto; gap: 32px; }
        .da-card { background: rgba(255,255,255,0.32); box-shadow: 0 4px 50px 2px rgba(0,0,0,0.18); border-radius: 10px; padding: 28px 32px; animation: da-up .4s ease both; }
        @keyframes da-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .da-card-title { font-size: 26px; font-weight: 600; letter-spacing: 0.4px; color: #000; margin-bottom: 24px; }
        .da-status-row { display: flex; align-items: center; gap: 14px; font-size: 20px; font-weight: 400; color: #000; margin-bottom: 14px; }
        .da-dot { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; }
        .da-dot.online { background: #00FF2F; box-shadow: 0 0 10px #00FF44, 0 0 3px #00FF44; }
        .da-dot.offline { background: #FF4444; box-shadow: 0 0 10px #FF0000, 0 0 3px #FF0000; }
        .da-stat-row { display: flex; align-items: center; gap: 14px; font-size: 20px; font-weight: 400; color: #000; margin-bottom: 18px; }
        .da-log-card { grid-row: 1 / 3; display: flex; flex-direction: column; position: relative; }
        .da-log-list { flex: 1; overflow-y: auto; max-height: 440px; padding-right: 4px; }
        .da-log-list::-webkit-scrollbar { width: 4px; }
        .da-log-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 2px; }
        .da-log-item { font-size: 22px; font-weight: 500; line-height: 40px; letter-spacing: 0.4px; color: #000; animation: da-up .3s ease; display: flex; align-items: center; justify-content: space-between; }
        .da-log-time { opacity: 0.6; }
        .da-log-delete-btn { background: none; border: none; cursor: pointer; color: #FF4444; padding: 4px; border-radius: 4px; transition: background .15s; display: flex; align-items: center; }
        .da-log-delete-btn:hover { background: rgba(255,68,68,0.1); }
        .da-log-empty { font-size: 16px; color: rgba(0,0,0,0.4); font-style: italic; margin-top: 12px; }
        .da-btn-group { display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end; }
        .da-hapus-btn, .da-export-btn { padding: 8px 24px; border: none; border-radius: 90px; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.4px; color: #fff; cursor: pointer; text-shadow: 0 2px 4px rgba(0,0,0,0.22); transition: background .18s, transform .15s; display: flex; align-items: center; gap: 8px; }
        .da-hapus-btn { background: rgba(244,54,58,0.82); box-shadow: 0 3px 10px rgba(200,0,0,0.22); }
        .da-hapus-btn:hover { background: rgba(220,30,30,0.92); transform: scale(1.04); }
        .da-hapus-btn.confirm { background: rgba(180,0,0,0.9); animation: da-pulse .5s ease infinite alternate; }
        .da-export-btn { background: rgba(0,120,255,0.82); box-shadow: 0 3px 10px rgba(0,120,255,0.22); }
        .da-export-btn:hover { background: rgba(0,100,220,0.92); transform: scale(1.04); }
        @keyframes da-pulse { to { box-shadow: 0 0 14px rgba(220,0,0,0.5); } }
        .da-gesture-wrap { grid-column: 1 / -1; }
        .da-gesture-card { padding: 28px 40px; }
        .da-gesture-list { columns: 3; column-gap: 40px; }
        .da-gesture-item { font-size: 18px; font-weight: 500; line-height: 44px; letter-spacing: 0.4px; color: #000; break-inside: avoid; padding-left: 16px; position: relative; }
        .da-gesture-item::before { content: '·'; position: absolute; left: 0; color: #005DFF; font-size: 26px; line-height: 44px; }
        @media (max-width: 960px) { .da-body { grid-template-columns: 1fr; padding: 0 20px; } .da-log-card { grid-row: auto; } .da-gesture-list { columns: 2; } .da-header { padding: 0 24px; } .da-welcome { font-size: 18px; } }
      `}</style>

      <div className="da-root">
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

        <div className="da-body">
          {/* STATUS SYSTEM */}
          <div className="da-card" style={{ animationDelay: '.05s' }}>
            <div className="da-card-title">STATUS SYSTEM</div>
            <div className="da-status-row">
              <div className={`da-dot ${systemStatus.camera_online ? 'online' : 'offline'}`} />
              <span>Kamera {systemStatus.camera_online ? 'Online' : 'Offline'}</span>
            </div>
            <div className="da-status-row">
              <div className={`da-dot ${systemStatus.device_connected ? 'online' : 'offline'}`} />
              <span>Device {systemStatus.device_connected ? 'Terkoneksi' : 'Terputus'}</span>
            </div>
          </div>

          {/* LOG AKTIFITAS */}
          <div className="da-card da-log-card" style={{ animationDelay: '.10s' }}>
            <div className="da-card-title">LOG AKTIFITAS</div>
            <div className="da-log-list">
              {loading ? (
                <div className="da-log-empty">Memuat data...</div>
              ) : logs.length === 0 ? (
                <div className="da-log-empty">Belum ada log aktifitas.</div>
              ) : (
                logs.map((item) => (
                  <div key={item.id} className="da-log-item">
                    <span>
                      <span className="da-log-time">[{formatTime(item.timestamp)}]</span> {item.gesture_text}
                    </span>
                    <button 
                      className="da-log-delete-btn" 
                      onClick={() => handleDeleteLog(item.id)}
                      title="Hapus log ini"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="da-btn-group">
              <button className="da-export-btn" onClick={handleExportCSV}>
                <DownloadIcon />
                Export CSV
              </button>
              <button
                className={`da-hapus-btn${confirmClear ? ' confirm' : ''}`}
                onClick={handleHapusLog}
              >
                {confirmClear ? 'Yakin hapus?' : 'Hapus Semua'}
              </button>
            </div>
          </div>

          {/* STATISTIK */}
          <div className="da-card" style={{ animationDelay: '.15s' }}>
            <div className="da-card-title">STATISTIK</div>
            <div className="da-stat-row">
              <HandIcon />
              <span>Total Gesture: <strong>{stats.total_gestures}</strong></span>
            </div>
            <div className="da-stat-row">
              <ClockIcon />
              <span>Waktu Aktif&nbsp;: {stats.active_time_minutes} Menit</span>
            </div>
            <div className="da-stat-row">
              <span>Gesture Unik: <strong>{stats.unique_gestures}</strong></span>
            </div>
          </div>

          {/* DAFTAR GESTURE */}
          <div className="da-gesture-wrap" style={{ animationDelay: '.20s' }}>
            <div className="da-card-title" style={{ paddingLeft: 0 }}>DAFTAR GESTURE</div>
            <div className="da-card da-gesture-card" style={{ animationDelay: '.22s', marginTop: 0 }}>
              <div className="da-gesture-list">
                {gestures.length > 0 ? (
                  gestures.map((g, i) => (
                    <div key={i} className="da-gesture-item">{g}</div>
                  ))
                ) : (
                  <div className="da-log-empty">Tidak ada gesture di model.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}