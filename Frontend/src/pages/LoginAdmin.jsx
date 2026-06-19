import { useState } from "react";

const LockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(0,0,0,0.45)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(0,0,0,0.45)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export function LoginAdmin({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    
    if (!username || !password) {
      setShake(true);
      setError("Username dan password harus diisi!");
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Username atau password salah!");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.access_token);
      onLogin?.();
      
    } catch (err) {
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .la-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: conic-gradient(from 68deg at 0% 0%, #38B6FF 0deg, #AADEFF 87deg, #D5F5FF 112deg, #C4ECFF 120deg, #38B6FF 360deg);
          padding: 40px 20px;
          position: relative;
        }

        .la-back-btn {
          position: absolute;
          top: 30px;
          left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.3);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 30px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #000;
          cursor: pointer;
          transition: background .2s, transform .15s;
          backdrop-filter: blur(6px);
          z-index: 10;
        }
        .la-back-btn:hover {
          background: rgba(255,255,255,0.5);
          transform: translateX(-2px);
        }

        .la-card {
          display: flex;
          width: 820px;
          min-height: 480px;
          background: rgba(255,255,255,0.10);
          box-shadow: 0 10px 50px rgba(28,21,21,0.45);
          border-radius: 56px;
          overflow: hidden;
          backdrop-filter: blur(6px);
          animation: la-fadein .5s ease;
        }
        @keyframes la-fadein {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .la-left {
          flex: 1;
          background: rgba(255,255,255,0.18);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 36px;
          gap: 24px;
          border-right: 2px solid rgba(0,0,0,0.12);
        }

        .la-right {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 56px 48px;
          gap: 20px;
        }
        .la-title {
          font-size: 28px; font-weight: 500; letter-spacing: 0.4px; color: #000;
          margin-bottom: 8px; text-align: center;
        }

        .la-input-wrap {
          width: 100%;
          position: relative; display: flex; align-items: center;
        }
        .la-input-icon {
          position: absolute; left: 16px; display: flex; align-items: center; pointer-events: none;
        }
        .la-input {
          width: 100%;
          height: 58px;
          padding: 0 20px 0 50px;
          background: rgba(255,255,255,0.72);
          border: 1px solid #000;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
          border-radius: 30px;
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          color: rgba(0,0,0,0.75);
          outline: none;
          transition: box-shadow .2s, border-color .2s;
        }
        .la-input::placeholder { color: rgba(0,0,0,0.4); }
        .la-input:focus {
          border-color: #00A6FF;
          box-shadow: 0 4px 18px rgba(0,166,255,0.3);
        }

        .la-btn {
          width: 100%;
          height: 55px;
          background: rgba(0,166,255,0.72);
          border: none; border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-size: 20px; font-weight: 500; letter-spacing: 0.4px;
          color: #fff; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 18px rgba(0,120,255,0.28);
          margin-top: 6px;
        }
        .la-btn:hover:not(:disabled) {
          background: rgba(0,140,255,0.9);
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(0,120,255,0.38);
        }
        .la-btn:active:not(:disabled) { transform: translateY(0); }
        .la-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .la-error {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 87, 87, 0.15);
          border: 1px solid rgba(255, 87, 87, 0.4);
          border-radius: 12px;
          color: #d32f2f;
          font-size: 14px;
          text-align: center;
          animation: la-fadein .3s ease;
        }

        @keyframes la-shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-8px); }
          40%,80% { transform: translateX(8px); }
        }
        .la-shake { animation: la-shake 0.45s ease; }

        @media (max-width: 640px) {
          .la-card { flex-direction: column; width: 100%; border-radius: 28px; }
          .la-left { border-right: none; border-bottom: 2px solid rgba(0,0,0,0.1); padding: 36px 24px; }
          .la-right { padding: 40px 28px; }
          .la-back-btn { top: 20px; left: 20px; padding: 8px 16px; font-size: 13px; }
        }
      `}</style>

      <div className="la-root">
        {/* TOMBOL BACK DI POJOK KIRI ATAS */}
        {onBack && (
          <button className="la-back-btn" onClick={onBack}>
            <BackIcon />
            <span>Kembali</span>
          </button>
        )}

        <div className={`la-card ${shake ? "la-shake" : ""}`}>
          <div className="la-left">
            <img
              src="/assets/Bridge.png"
              alt="Bridge Com Logo"
              className="la-logo-img"
            />
          </div>
          <div className="la-right">
            <h2 className="la-title">Masuk Sebagai Admin</h2>

            {error && <div className="la-error">{error}</div>}

            <div className="la-input-wrap">
              <span className="la-input-icon">
                <UserIcon />
              </span>
              <input
                className="la-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={isLoading}
              />
            </div>

            <div className="la-input-wrap">
              <span className="la-input-icon">
                <LockIcon />
              </span>
              <input
                className="la-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={isLoading}
              />
            </div>

            <button 
              className="la-btn" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}