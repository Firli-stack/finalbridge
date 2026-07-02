import { useEffect } from "react";

// ── Inline SVG Icons ────────────────────────────────────────
const GithubIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const MailIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MapPinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// ── Tech card data ───────────────────────────────────────────
const technologies = [
  {
    name: "Raspberry Pi",
    bg: "#C51A4A",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg",
    link: "https://www.raspberrypi.com/",
  },
  {
    name: "LSTM",
    bg: "#1a1a2e",
    textColor: "#fff",
    logoText: "LSTM",
    logoSub: "Long Short-Term Memory",
    link: "https://en.wikipedia.org/wiki/Long_short-term_memory",
  },
  {
    name: "MediaPipe",
    bg: "#fff",
    textColor: "#111",
    border: "1px solid #ddd",
    logo: "https://cdn.brandfetch.io/idL_Jl2SZd/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1670440040290",
    link: "https://developers.google.com/mediapipe",
  },
  {
    name: "React JS",
    bg: "#20232a",
    textColor: "#61dafb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    link: "https://react.dev/",
  },
  {
    name: "Python",
    bg: "#fff",
    textColor: "#111",
    border: "1px solid #ddd",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    link: "https://www.python.org/",
  },
  {
    name: "Vite JS",
    bg: "#fff",
    textColor: "#646cff",
    border: "1px solid #ddd",
    logo: "https://vitejs.dev/logo.svg",
    link: "https://vitejs.dev/",
  },
];

// ── Team data dengan foto dan social links ──────────────────
const team = [
  { 
    name: "Firli Hanifurahman", 
    role: "Developer",
    photo: "/assets/ireng.png", // Foto dari folder Frontend/assets/
    github: "https://github.com/Firli-stack",
    linkedin: "https://www.linkedin.com/in/firli-hanifurahman/",
    email: "mailto:firlihanifurahman753@Gmail.com"
  },
  { 
    name: "Marsel V.P Naibaho", 
    role: "Developer",
    photo: "/assets/ireng2.png", // Foto dari folder Frontend/assets/
    github: "https://github.com/tamanaibaho",
    linkedin: "https://www.linkedin.com/in/marsel-naibaho-648a70333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "mailto:marselvicentiuspaltakmanaibaho@Gmail.com"
  },
];

// ── Main Component ───────────────────────────────────────────
export function Landing({ onStart, onAdmin }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bc-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180.86deg, #00BFFF 24.68%, #BDEEF5 58.09%);
          overflow-x: hidden;
          color: #000;
        }

        /* ─── HEADER ─── */
        .bc-header {
          position: sticky; top: 0; z-index: 100;
          height: 80px;
          background: #76DEFF;
          box-shadow: 0 4px 4px rgba(0,0,0,0.18);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
        }
        .bc-logo-mark {
          width: 54px; height: 54px;
          background: rgba(20,152,254,0.12);
          border: 1px solid rgba(0,0,0,0.25);
          box-shadow: 0 4px 6px 2px rgba(93,134,148,0.55);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .bc-admin-btn {
          background: #005DFF;
          color: #93D7FF;
          font-family: 'Poppins', sans-serif;
          font-weight: 500; font-size: 15px; letter-spacing: 0.4px;
          padding: 10px 28px; border-radius: 20px; border: none; cursor: pointer;
          transition: opacity .15s;
        }
        .bc-admin-btn:hover { opacity: .85; }

        /* ─── HERO ─── */
        .bc-hero {
          max-width: 1300px; margin: 0 auto;
          padding: 60px 48px 72px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
        }
        .bc-hero-card {
          background: rgba(185, 249, 255, 0);
          border-radius: 62px;
          padding: 48px 40px;
          box-shadow: 0 4px 50px 2px rgba(93, 134, 148, 0);
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .bc-logo-preview {
          width: 100%; max-width: 300px;
          aspect-ratio: 1;
          background: rgba(255,255,255,0.85);
          border-radius: 32px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
        }
        .bc-hero-title {
          font-weight: 800; font-size: 52px; line-height: 62px; letter-spacing: 1px;
          color: #000; margin-bottom: 22px;
        }
        .bc-hero-desc {
          font-weight: 400; font-size: 16px; line-height: 30px; letter-spacing: 1px;
          color: #000; margin-bottom: 40px;
        }
        .bc-cta {
          display: inline-flex; align-items: center; gap: 12px;
          background: rgba(0,50,250,0.82);
          box-shadow: 0 4px 29px 15px rgba(60,0,255,0.28);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-weight: 600; font-size: 22px; letter-spacing: 1px;
          padding: 18px 50px; border-radius: 100px; border: none; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .bc-cta:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 36px 18px rgba(60,0,255,0.34);
        }

        /* ─── TECH SECTION ─── */
        .bc-tech-wrap {
          padding: 0 48px 64px;
        }
        .bc-tech-box {
          max-width: 1100px; margin: 0 auto;
          background: #B9F9FF;
          border-radius: 20px;
          box-shadow: 0 4px 50px 2px #26C8FF;
          padding: 40px 48px 48px;
        }
        .bc-tech-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .bc-tech-card {
          border-radius: 20px;
          height: 171px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
          padding: 20px 16px;
          cursor: default;
          transition: transform .18s;
          overflow: hidden;
        }
        .bc-tech-card:hover { transform: scale(1.04); }
        .bc-tech-card img { max-height: 60px; max-width: 120px; object-fit: contain; }
        .bc-tech-name { font-weight: 600; font-size: 15px; letter-spacing: 0.3px; text-align: center; }
        .bc-tech-sub { font-size: 10px; opacity: .7; text-align: center; margin-top: -8px; }
        .bc-lstm-big { font-weight: 800; font-size: 40px; letter-spacing: 3px; }

        /* ─── TEAM ─── */
        .bc-team-wrap { padding: 0 48px 64px; }
        .bc-team-grid {
          display: grid; grid-template-columns: repeat(2, 320px); gap: 48px; justify-content: center;
        }
        .bc-team-card {
          background: #B9F9FF;
          border-radius: 20px;
          box-shadow: 0 4px 52px 5px #7DC9FF;
          padding: 28px 24px 28px;
          display: flex; flex-direction: column; align-items: center;
          transition: transform .18s;
        }
        .bc-team-card:hover { transform: translateY(-5px); }
        .bc-avatar {
          width: 200px; height: 200px;
          background: #e0f4ff;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; 
          overflow: hidden;
          border: 3px solid rgba(0, 93, 255, 0.3);
        }
        .bc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bc-social-btn {
          width: 38px; height: 38px;
          background: rgba(0,0,0,0.07);
          border: none; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #222;
          transition: background .15s, transform .15s;
          text-decoration: none;
        }
        .bc-social-btn:hover { 
          background: rgba(0,0,0,0.16);
          transform: translateY(-2px);
        }

        /* ─── VISI MISI ─── */
        .bc-vm-wrap {
          background: rgba(185,249,255,0.2);
          border-top: 1px solid rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(0,0,0,0.2);
          padding: 64px 48px;
        }
        .bc-vm-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
        }

        /* ─── FOOTER ─── */
        .bc-footer {
          background: #38B6FF;
          padding: 52px 48px 28px;
        }
        .bc-footer-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 40px;
          margin-bottom: 32px;
        }
        .bc-footer-link {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Poppins', sans-serif; font-size: 14px; color: #000;
          background: none; border: none; cursor: pointer;
          text-decoration: none; padding: 3px 0;
          transition: opacity .15s;
        }
        .bc-footer-link:hover { opacity: .6; }
        .bc-divider { border-top: 1px solid rgba(0,0,0,0.15); padding-top: 20px; text-align: center; font-size: 14px; }

        /* ─── Responsive ─── */
        @media (max-width: 900px) {
          .bc-hero { grid-template-columns: 1fr; padding: 40px 24px 56px; }
          .bc-hero-title { font-size: 34px; line-height: 46px; }
          .bc-tech-grid { grid-template-columns: repeat(2, 1fr); }
          .bc-team-grid { grid-template-columns: 1fr; }
          .bc-vm-grid, .bc-footer-grid { grid-template-columns: 1fr; }
          .bc-tech-wrap, .bc-team-wrap, .bc-vm-wrap, .bc-footer { padding-left: 24px; padding-right: 24px; }
          .bc-header { padding: 0 20px; }
        }
      `}</style>

      <div className="bc-root">
        {/* ── Header ── */}
        <header className="bc-header">
          <div className="bc-logo-mark">
            <img
              src="/assets/Bridge.png"
              alt="Bridge Com Logo"
              style={{
                width: 70,
                height: 70,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <button className="bc-admin-btn" onClick={onAdmin}>
            Login sebagai Admin
          </button>
        </header>

        {/* ── Hero ── */}
        <section className="bc-hero">
          {/* Logo card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="bc-hero-card">
              {/* Stylized "B" wordmark */}
              <svg viewBox="0 0 240 240" width="500" height="500">
                <image
                  href="/assets/Bridge.png"
                  x="0"
                  y="0"
                  width="240"
                  height="240"
                  preserveAspectRatio="xMidYMid slice"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="bc-hero-title">
              Bangun Sistem Pembelajaran Inklusif Dengan BridgeCom
            </h1>
            <p className="bc-hero-desc">
              BridgeCom menghadirkan sistem penerjemah bahasa isyarat berbasis
              Internet of Things (IoT) yang dirancang untuk mendukung proses
              pembelajaran inklusif, khususnya di lingkungan Kampus. Sistem ini
              membantu mahasiswa memahami komunikasi dari mahasiswa berkebutuhan
              khusus, serta memudahkan dosen dalam menyampaikan materi secara
              lebih inklusif.
            </p>
            <button className="bc-cta" onClick={onStart}>
              <PlayIcon />
              Mulai Sekarang
            </button>
          </div>
        </section>

        {/* ── Teknologi ── */}
        <section className="bc-tech-wrap">
          <div className="bc-tech-box">
            <h2
              style={{
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: 0.4,
                textAlign: "center",
                marginBottom: 36,
              }}
            >
              Teknologi yang kami gunakan
            </h2>
            <div className="bc-tech-grid">
              {technologies.map((tech) => (
                <a
                  key={tech.name}
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="bc-tech-card"
                    style={{
                      background: tech.bg,
                      border: tech.border || "none",
                      color: tech.textColor,
                      cursor: "pointer",
                    }}
                  >
                    {tech.logo ? (
                      <img src={tech.logo} alt={tech.name} />
                    ) : (
                      <>
                        <span
                          className="bc-lstm-big"
                          style={{ color: tech.textColor }}
                        >
                          {tech.logoText}
                        </span>

                        {tech.logoSub && (
                          <span
                            className="bc-tech-sub"
                            style={{ color: "#aaa" }}
                          >
                            {tech.logoSub}
                          </span>
                        )}
                      </>
                    )}

                    <span
                      className="bc-tech-name"
                      style={{ color: tech.textColor }}
                    >
                      {tech.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tim Pengembang ── */}
        <section className="bc-team-wrap">
          <h2
            style={{
              fontWeight: 700,
              fontSize: 36,
              letterSpacing: 0.4,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Tim Pengembang
          </h2>
          <div className="bc-team-grid">
            {team.map((member) => (
              <div key={member.name} className="bc-team-card">
                <div className="bc-avatar">
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    onError={(e) => {
                      // Fallback jika foto tidak ditemukan
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Ccircle cx='80' cy='58' r='38' fill='%2390CAF9'/%3E%3Cellipse cx='80' cy='148' rx='60' ry='36' fill='%2390CAF9'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: 0.4,
                    marginBottom: 4,
                  }}
                >
                  {member.name}
                </span>
                <span style={{ fontSize: 14, color: "#444", marginBottom: 18 }}>
                  {member.role}
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bc-social-btn"
                    title="GitHub"
                  >
                    <GithubIcon />
                  </a>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bc-social-btn"
                    title="LinkedIn"
                  >
                    <LinkedinIcon />
                  </a>
                  <a 
                    href={member.email} 
                    className="bc-social-btn"
                    title="Email"
                  >
                    <MailIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Visi & Misi ── */}
        <section className="bc-vm-wrap">
          <div className="bc-vm-grid">
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                Visi
              </h2>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 28,
                  lineHeight: "42px",
                  letterSpacing: 1,
                }}
              >
                Membantu Mahasiswa inklusif
              </p>
            </div>
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                Misi
              </h2>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 28,
                  lineHeight: "42px",
                  letterSpacing: 1,
                }}
              >
                Membantu interaksi yang efektif antara mahasiswa dan dosen dalam
                lingkungan kampus
              </p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bc-footer">
          <div className="bc-footer-grid">
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    background: "rgba(255, 255, 255, 0)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/assets/Bridge.png"
                    alt="Bridge Com Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <p
                style={{ fontSize: 14, lineHeight: "28px", letterSpacing: 0.4 }}
              >
                © 2026 BridgeCom. All rights reserved.
                <br />
                Mendukung pembelajaran inklusif melalui teknologi penerjemah
                bahasa isyarat berbasis IoT di Polibatam.
              </p>
            </div>

            {/* Hubungi Kami */}
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 17, marginBottom: 20 }}>
                Hubungi Kami
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <PhoneIcon /> <span>+6295-6118-81808</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, paddingLeft: 28 }}>
                  Customer Support: 09.00 – 17.00 WIB
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <MailIcon /> <span>bridgecom@polibatam.ac.id</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <MapPinIcon /> <span>Politeknik Negeri Batam</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 17, marginBottom: 20 }}>
                Tautan Cepat
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="bc-footer-link" onClick={onStart}>
                  <ChevronRightIcon /> Mulai Menggunakan
                </button>
                <a className="bc-footer-link" href="#">
                  <ChevronRightIcon /> Dokumentasi
                </a>
                <a className="bc-footer-link" href="#">
                  <ChevronRightIcon /> Tentang Kami
                </a>
              </div>
            </div>
          </div>

          <div className="bc-divider">
            Dikembangkan dengan untuk pendidikan inklusif di Indonesia
          </div>
        </footer>
      </div>
    </>
  );
}