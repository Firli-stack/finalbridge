import { useState, useEffect } from "react";

const DashboardIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const HandIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-16 0v-5a2 2 0 0 1 4 0v4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export function Admindashboard({ onLogout }) {
  const API_URL = window.location.origin;

  const [activePage, setActivePage] = useState("dashboard");
  const [logs, setLogs] = useState([]);
  const [gestures, setGestures] = useState([]);

  const [stats, setStats] = useState({
    total_gestures: 0,
    active_time_minutes: 0,
    unique_gestures: 0
  });

  const [systemStatus, setSystemStatus] = useState({
    camera_online: false,
    device_connected: false
  });

  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showGestureModal, setShowGestureModal] = useState(false);
  const [editingGesture, setEditingGesture] = useState(null);
  const [gestureName, setGestureName] = useState("");
  const [gestureVideo, setGestureVideo] = useState(null);
  const [gestureLoading, setGestureLoading] = useState(false);

  const getToken = () => localStorage.getItem("admin_token");

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/activity-logs`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else if (res.status === 401 || res.status === 403) {
        onLogout();
      }
    } catch (error) {
      console.error("Error fetch logs:", error);
    }
  };

  const fetchGestures = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/gestures`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setGestures(data);
      } else if (res.status === 401 || res.status === 403) {
        onLogout();
      }
    } catch (error) {
      console.error("Error fetch gestures:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetch stats:", error);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/system-status`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error("Error fetch system status:", error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      await Promise.all([
        fetchLogs(),
        fetchGestures(),
        fetchStats(),
        fetchSystemStatus()
      ]);

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

  const handleHapusLog = async () => {
    if (confirmClear) {
      try {
        const res = await fetch(`${API_URL}/api/admin/activity-logs`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });

        if (res.ok) {
          setLogs([]);
          fetchStats();
        }
      } catch (error) {
        console.error(error);
      }

      setConfirmClear(false);
    } else {
      setConfirmClear(true);

      setTimeout(() => {
        setConfirmClear(false);
      }, 3000);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/activity-logs/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (res.ok) {
        setLogs((prevLogs) =>
          prevLogs.filter((log) => log.id !== logId)
        );

        fetchStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/export`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `activity_logs_${new Date()
          .toISOString()
          .split("T")[0]}.csv`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(error);
    }
  };

    const handleSaveGesture = async () => {
    if (!gestureName.trim()) {
      alert("Nama gesture wajib diisi.");
      return;
    }

    if (!editingGesture && !gestureVideo) {
      alert("Video gesture wajib diupload.");
      return;
    }

    // --- CEK UKURAN FILE DI FRONTEND (MAKS 20MB) ---
    if (gestureVideo && gestureVideo.size > 20 * 1024 * 1024) {
      alert("Ukuran video terlalu besar! Maksimal 20MB. Silakan kompres video Anda.");
      return;
    }

    const formData = new FormData();

    formData.append("name", gestureName.trim());

    if (gestureVideo) {
      formData.append("video", gestureVideo);
    }

    try {
      setGestureLoading(true);

      const url = editingGesture
        ? `${API_URL}/api/admin/gestures/${editingGesture.id}`
        : `${API_URL}/api/admin/gestures`;

      const res = await fetch(url, {
        method: editingGesture ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Gagal menyimpan gesture.");
        return;
      }

      await fetchGestures();
      closeGestureModal();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setGestureLoading(false);
    }
  };

  const handleEditGesture = (gesture) => {
    setEditingGesture(gesture);
    setGestureName(gesture.name);
    setGestureVideo(null);
    setShowGestureModal(true);
  };

  const handleDeleteGesture = async (gestureId) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus gesture ini?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/gestures/${gestureId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (res.ok) {
        setGestures((prevGestures) =>
          prevGestures.filter(
            (gesture) => gesture.id !== gestureId
          )
        );
      } else {
        const data = await res.json();
        alert(data.detail || "Gagal menghapus gesture.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  const openAddGestureModal = () => {
    setEditingGesture(null);
    setGestureName("");
    setGestureVideo(null);
    setShowGestureModal(true);
  };

  const closeGestureModal = () => {
    setShowGestureModal(false);
    setEditingGesture(null);
    setGestureName("");
    setGestureVideo(null);
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "";

    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const DashboardPage = () => (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Monitor sistem BridgeCom secara real-time</p>
        </div>

        <div className="system-online-indicator">
          <span
            className={
              systemStatus.camera_online &&
              systemStatus.device_connected
                ? "online-dot"
                : "offline-dot"
            }
          />

          System{" "}
          {systemStatus.camera_online &&
          systemStatus.device_connected
            ? "Online"
            : "Offline"}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue-card">
          <div className="stat-info">
            <span className="stat-label">
              Total Gesture Terdeteksi
            </span>

            <strong>{stats.total_gestures}</strong>

            <small>Total gesture yang dikenali</small>
          </div>

          <div className="stat-icon">
            <HandIcon />
          </div>
        </div>

        <div className="stat-card green-card">
          <div className="stat-info">
            <span className="stat-label">
              Waktu Aktif Sistem
            </span>

            <strong>{stats.active_time_minutes}</strong>

            <small>Menit</small>
          </div>

          <div className="stat-icon">
            <ClockIcon />
          </div>
        </div>

        <div className="stat-card purple-card">
          <div className="stat-info">
            <span className="stat-label">
              Gesture Unik
            </span>

            <strong>{stats.unique_gestures}</strong>

            <small>Jenis gesture berbeda</small>
          </div>

          <div className="stat-icon">
            <HandIcon />
          </div>
        </div>

        <div className="stat-card yellow-card">
          <div className="stat-info">
            <span className="stat-label">
              Status Kamera
            </span>

            <strong
              className={
                systemStatus.camera_online
                  ? "text-online"
                  : "text-offline"
              }
            >
              {systemStatus.camera_online
                ? "Online"
                : "Offline"}
            </strong>

            <small>Kamera sistem</small>
          </div>

          <div className="stat-icon">
            📷
          </div>
        </div>

        <div className="stat-card cyan-card">
          <div className="stat-info">
            <span className="stat-label">
              Perangkat
            </span>

            <strong
              className={
                systemStatus.device_connected
                  ? "text-online"
                  : "text-offline"
              }
            >
              {systemStatus.device_connected
                ? "Terhubung"
                : "Terputus"}
            </strong>

            <small>Device BridgeCom</small>
          </div>

          <div className="stat-icon">
            🖥️
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="content-card log-card">
          <div className="card-header">
            <h2>Log Aktivitas Terbaru</h2>

            <div className="card-actions">
              <button
                className="export-button"
                onClick={handleExportCSV}
              >
                <DownloadIcon />
                Export CSV
              </button>

              <button
                className={
                  confirmClear
                    ? "delete-all-button confirm"
                    : "delete-all-button"
                }
                onClick={handleHapusLog}
              >
                <TrashIcon />

                {confirmClear
                  ? "Yakin hapus?"
                  : "Hapus Semua"}
              </button>
            </div>
          </div>

          <div className="log-table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Aktivitas</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="empty-table">
                      Memuat data...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-table">
                      Belum ada log aktivitas.
                    </td>
                  </tr>
                ) : (
                  logs.map((item) => (
                    <tr key={item.id}>
                      <td className="time-cell">
                        {formatTime(item.timestamp)}
                      </td>

                      <td>
                        <span className="gesture-badge">
                          {item.gesture_text}
                        </span>
                      </td>

                      <td>
                        <button
                          className="small-delete-button"
                          onClick={() =>
                            handleDeleteLog(item.id)
                          }
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-card status-card">
          <h2>Status System</h2>

          <div className="status-list">
            <div className="status-item">
              <span>Kamera</span>

              <strong
                className={
                  systemStatus.camera_online
                    ? "status-online"
                    : "status-offline"
                }
              >
                {systemStatus.camera_online
                  ? "Online"
                  : "Offline"}

                <i />
              </strong>
            </div>

            <div className="status-item">
              <span>Perangkat</span>

              <strong
                className={
                  systemStatus.device_connected
                    ? "status-online"
                    : "status-offline"
                }
              >
                {systemStatus.device_connected
                  ? "Terhubung"
                  : "Terputus"}

                <i />
              </strong>
            </div>

            <div className="status-item">
              <span>Model AI</span>

              <strong className="status-online">
                Aktif
                <i />
              </strong>
            </div>

            <div className="status-item">
              <span>Database</span>

              <strong className="status-online">
                Terkoneksi
                <i />
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GesturePage = () => (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h1>Daftar Gesture</h1>

          <p>
            Kelola gesture dan video pelatihan sistem BridgeCom
          </p>
        </div>

        <div className="gesture-page-actions">
          <div className="gesture-total">
            {gestures.length} Gesture
          </div>

          <button
            className="add-gesture-button"
            onClick={openAddGestureModal}
          >
            <PlusIcon />
            Tambah Gesture
          </button>
        </div>
      </div>

      <div className="gesture-table-card">
        <div className="gesture-table-wrapper">
          <table className="gesture-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Gesture</th>
                <th>Video Gesture</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {gestures.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table">
                    Belum ada gesture.
                  </td>
                </tr>
              ) : (
                gestures.map((gesture, index) => (
                  <tr key={gesture.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong className="gesture-name">
                        {gesture.name}
                      </strong>
                    </td>

                    <td>
                      {gesture.video_filename ? (
                        <video
                          className="gesture-video"
                          controls
                          preload="metadata"
                          src={`/api/gesture-videos/${gesture.video_filename}`}
                        />  
                      ) : (
                        <span className="no-video">
                          Video tidak tersedia
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="active-badge">
                        Aktif
                      </span>
                    </td>

                    <td>
                      <div className="gesture-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEditGesture(gesture)
                          }
                        >
                          <EditIcon />
                          Edit
                        </button>

                        <button
                          className="gesture-delete-button"
                          onClick={() =>
                            handleDeleteGesture(gesture.id)
                          }
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Poppins', sans-serif;
        }

        .admin-root {
          min-height: 100vh;
          background: linear-gradient(180.86deg, #00BFFF 24.72%, #BDEEF5 57.96%);
          display: flex;
          color: #0f172a;
          font-family: 'Poppins', sans-serif;
        }

        .sidebar {
          width: 255px;
          min-height: 100vh;
          background: linear-gradient(180deg, #003087 0%, #001f5c 100%);
          padding: 28px 18px;
          flex-shrink: 0;
          transition: width .3s ease;
          box-shadow: 4px 0 20px rgba(0, 48, 135, 0.2);
        }

        .sidebar.closed {
          width: 88px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 10px 35px;
          font-size: 21px;
          font-weight: 700;
          color: white;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,.22);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .brand-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .sidebar.closed .brand-text,
        .sidebar.closed .menu-text {
          display: none;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .menu-button {
          width: 100%;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px;
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 600;
          text-align: left;
          transition: all .2s ease;
        }

        .sidebar.closed .menu-button {
          justify-content: center;
        }

        .menu-button:hover {
          background: rgba(255,255,255,.15);
          color: #ffffff;
        }

        .menu-button.active {
          background: #005DFF;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 93, 255, 0.4);
        }

        .logout-menu {
          margin-top: 30px;
        }
        .logout-menu .menu-button:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .main-area {
          flex: 1;
          min-width: 0;
        }

        .top-header {
          height: 80px;
          background: #76DEFF;
          border-bottom: 1px solid rgba(0,0,0,.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px;
          box-shadow: 0 4px 12px rgba(0,0,0,.08);
        }

        .menu-toggle {
          border: none;
          background: transparent;
          cursor: pointer;
          color: #003087;
          display: flex;
          align-items: center;
          font-size: 20px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14.5px;
          font-weight: 700;
          color: #003087;
          background: rgba(255, 255, 255, 0.6);
          padding: 6px 14px;
          border-radius: 20px;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          border: 2px solid #005DFF;
          background: #ffffff;
          color: #005DFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-container {
          padding: 36px 40px 60px;
          max-width: 1600px;
          margin: auto;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .page-heading h1 {
          font-size: 30px;
          font-weight: 800;
          color: #002b66;
        }

        .page-heading p {
          margin-top: 4px;
          font-size: 14.5px;
          color: #334155;
          font-weight: 500;
        }

        .system-online-indicator {
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.8);
          padding: 6px 14px;
          border-radius: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .online-dot,
        .offline-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .online-dot {
          background: #10B981;
          box-shadow: 0 0 7px #10B981;
        }

        .offline-dot {
          background: #EF4444;
          box-shadow: 0 0 7px #EF4444;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          min-height: 125px;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(0,0,0,.08);
          background: #B9F9FF;
          box-shadow: 0 6px 18px rgba(93, 134, 148, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(93, 134, 148, 0.32);
        }

        .blue-card {
          border-left: 4px solid #005DFF;
        }

        .green-card {
          border-left: 4px solid #10B981;
        }

        .purple-card {
          border-left: 4px solid #8B5CF6;
        }

        .yellow-card {
          border-left: 4px solid #F59E0B;
        }

        .cyan-card {
          border-left: 4px solid #06B6D4;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .stat-info strong {
          font-size: 26px;
          font-weight: 800;
          line-height: 32px;
          color: #002b66;
        }

        .stat-info small {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .text-online {
          color: #059669;
        }

        .text-offline {
          color: #DC2626;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: #ffffff;
          color: #005DFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 3px 8px rgba(0, 93, 255, 0.15);
        }

        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 22px;
        }

        .content-card,
        .gesture-table-card {
          background: #B9F9FF;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 8px 24px rgba(93, 134, 148, 0.22);
          padding: 26px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 15px;
        }

        .content-card h2 {
          font-size: 20px;
          font-weight: 800;
          color: #002b66;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .export-button,
        .delete-all-button {
          border-radius: 18px;
          padding: 8px 16px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .export-button {
          background: #005DFF;
          border: none;
          color: #ffffff;
          box-shadow: 0 3px 8px rgba(0, 93, 255, 0.25);
        }
        .export-button:hover {
          background: #004ecc;
        }

        .delete-all-button {
          background: rgba(239, 68, 68, 0.15);
          color: #DC2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .delete-all-button:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .delete-all-button.confirm {
          background: #DC2626;
          color: white;
        }

        .log-table-wrapper {
          max-height: 360px;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.7);
        }

        .gesture-table-wrapper {
          overflow-x: auto;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.7);
        }

        .log-table thead {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #76DEFF;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          font-size: 12px;
          color: #003087;
          font-weight: 700;
          text-align: left;
          padding: 14px 12px;
          border-bottom: 1px solid rgba(0,0,0,.1);
        }

        td {
          font-size: 13px;
          padding: 13px 12px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          color: #0f172a;
        }

        .time-cell {
          color: #475569;
          white-space: nowrap;
          font-weight: 500;
        }

        .gesture-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(0, 93, 255, 0.15);
          color: #005DFF;
          font-weight: 700;
          font-size: 12px;
        }

        .small-delete-button {
          border: none;

          background: transparent;
          color: #D62B2B;
          cursor: pointer;
          padding: 5px;
        }

        .empty-table {
          text-align: center;
          color: rgba(0,0,0,.5);
          padding: 30px;
        }

        .status-list {
          margin-top: 22px;
        }

        .status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 0;
          border-bottom: 1px solid rgba(0,0,0,.1);
          font-size: 13px;
        }

        .status-item strong {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .status-online {
          color: #009B48;
        }

        .status-offline {
          color: #D62B2B;
        }

        .status-item i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .gesture-page-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gesture-total {
          background: rgba(0, 93, 255, 0.15);
          color: #005DFF;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .add-gesture-button {
          border: none;
          background: #005DFF;
          color: white;
          border-radius: 20px;
          padding: 10px 20px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 93, 255, 0.3);
          transition: all 0.2s ease;
        }

        .add-gesture-button:hover {
          background: #004ecc;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 93, 255, 0.4);
        }

        .gesture-table-card {
          padding: 24px;
          overflow: hidden;
        }

        .gesture-table th {
          background: #76DEFF;
          padding: 14px 18px;
        }

        .gesture-table td {
          padding: 15px 18px;
          vertical-align: middle;
        }

        .gesture-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #002b66;
        }

        .gesture-video {
          width: 150px;
          height: 90px;
          object-fit: cover;
          border-radius: 10px;
          background: #000;
          display: block;
          border: 2px solid rgba(0, 93, 255, 0.2);
        }

        .no-video {
          font-size: 12px;
          color: #DC2626;
          font-weight: 600;
        }

        .active-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
          font-size: 12px;
          font-weight: 700;
        }

        .gesture-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edit-button {
          border: 1px solid rgba(0, 93, 255, 0.25);
          background: rgba(255, 255, 255, 0.9);
          color: #005DFF;
          border-radius: 8px;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .edit-button:hover {
          background: #005DFF;
          color: #ffffff;
        }

        .gesture-delete-button {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(220, 38, 38, 0.25);
          background: rgba(239, 68, 68, 0.1);
          color: #DC2626;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gesture-delete-button:hover {
          background: #DC2626;
          color: #ffffff;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
        }

        .gesture-modal {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(0, 93, 255, 0.15);
          box-shadow: 0 20px 50px rgba(0, 48, 135, 0.25);
          padding: 30px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 800;
          color: #002b66;
        }


        .close-modal {
          border: none;
          background: transparent;
          font-size: 25px;
          cursor: pointer;
          color: #555;
          line-height: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 18px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="file"] {
          width: 100%;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 7px;
          padding: 10px;
          font-family: inherit;
          font-size: 12px;
          color: #000;
          background: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #008ED4;
          box-shadow: 0 0 0 3px rgba(0,142,212,.12);
        }

        .current-video {
          width: 100%;
          max-height: 180px;
          object-fit: contain;
          background: #111;
          border-radius: 8px;
          margin-top: 8px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
        }

        .cancel-button,
        .save-button {
          border-radius: 7px;
          padding: 10px 17px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid rgba(0,0,0,.2);
          background: white;
          color: #555;
        }

        .save-button {
          border: none;
          background: #007CC2;
          color: white;
        }

        .save-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 88px;
          }

          .sidebar .brand-text,
          .sidebar .menu-text {
            display: none;
          }

          .menu-button {
            justify-content: center;
          }

          .dashboard-content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-container {
            padding: 20px 14px;
          }

          .top-header {
            padding: 0 16px;
          }

          .card-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .card-actions {
            width: 100%;
            justify-content: space-between;
          }

          .page-heading {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .add-button {
            width: 100%;
            justify-content: center;
          }

          .gesture-modal {
            width: 95%;
            padding: 22px 18px;
            margin: 16px;
          }
        }


          .gesture-page-actions {
            width: 100%;
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="admin-root">
        <aside className={sidebarOpen ? "sidebar" : "sidebar closed"}>
          <div className="brand">
            <div className="brand-icon">
              <img src="/assets/Bridge.png" alt="BridgeCom Logo" />
            </div>

            <span className="brand-text">
              BridgeCom
            </span>
          </div>

          <nav className="sidebar-menu">
            <button
              className={
                activePage === "dashboard"
                  ? "menu-button active"
                  : "menu-button"
              }
              onClick={() => setActivePage("dashboard")}
            >
              <DashboardIcon />

              <span className="menu-text">
                Dashboard
              </span>
            </button>

            <button
              className={
                activePage === "gestures"
                  ? "menu-button active"
                  : "menu-button"
              }
              onClick={() => setActivePage("gestures")}
            >
              <HandIcon />

              <span className="menu-text">
                Daftar Gesture
              </span>
            </button>

            <button
              className="menu-button logout-menu"
              onClick={onLogout}
            >
              <LogoutIcon />

              <span className="menu-text">
                Logout
              </span>
            </button>
          </nav>
        </aside>

        <main className="main-area">
          <header className="top-header">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon />
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">
                <UserIcon />
              </div>

              <span>Admin</span>
            </div>
          </header>

          {activePage === "dashboard"
            ? <DashboardPage />
            : <GesturePage />}
        </main>
      </div>

      {showGestureModal && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeGestureModal();
            }
          }}
        >
          <div className="gesture-modal">
            <div className="modal-header">
              <h2>
                {editingGesture
                  ? "Edit Gesture"
                  : "Tambah Gesture"}
              </h2>

              <button
                className="close-modal"
                onClick={closeGestureModal}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Nama Gesture</label>

              <input
                type="text"
                placeholder="Contoh: Hello"
                value={gestureName}
                onChange={(event) =>
                  setGestureName(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>
                {editingGesture
                  ? "Ganti Video Gesture (Opsional)"
                  : "Video Gesture"}
              </label>

              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={(event) =>
                  setGestureVideo(event.target.files[0])
                }
              />

              {editingGesture &&
                editingGesture.video_filename && (
                  <video
                    className="current-video"
                    controls
                    preload="metadata"
                    src={`/api/gesture-videos/${editingGesture.video_filename}`}
                  />
                )}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={closeGestureModal}
              >
                Batal
              </button>

              <button
                className="save-button"
                onClick={handleSaveGesture}
                disabled={gestureLoading}
              >
                {gestureLoading
                  ? "Menyimpan..."
                  : editingGesture
                    ? "Simpan Perubahan"
                    : "Tambah Gesture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
