import React, { useEffect } from "react";

// ── Inline SVG Icons ────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const GithubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#005DFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const CpuIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#005DFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#005DFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
  </svg>
);

const team = [
  {
    name: "Firli Hanifurahman",
    role: "Developer",
    univ: "Politeknik Negeri Batam",
    photo: "/assets/Ireng.png",
    github: "https://github.com/Firli-stack",
    linkedin: "https://www.linkedin.com/in/firli-hanifurahman/",
    email: "mailto:firlihanifurahman753@Gmail.com",
    bio: "Fokus pada pengembangan arsitektur IoT, komunikasi telemetry MQTT, dan integrasi backend real-time FastAPI."
  },
  {
    name: "Marsel V.P Naibaho",
    role: "Developer",
    univ: "Politeknik Negeri Batam",
    photo: "/assets/Ireng2.png",
    github: "https://github.com/tamanaibaho",
    linkedin: "https://www.linkedin.com/in/marsel-naibaho-648a70333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "mailto:marselvicentiuspaltakmanaibaho@Gmail.com",
    bio: "Fokus pada pemodelan AI Computer Vision, optimasi model MediaPipe & TFLite (Siformer), serta interaksi pengguna."
  }
];

export function AboutPage({ onBack, onStart }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ab-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: linear-gradient(180.86deg, #00BFFF 24.68%, #BDEEF5 58.09%);
          color: #000;
          overflow-x: hidden;
        }

        /* ─── HEADER ─── */
        .ab-header {
          position: sticky; 
          top: 0; 
          z-index: 100;
          height: 80px;
          background: #76DEFF;
          box-shadow: 0 4px 4px rgba(0,0,0,0.18);
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          padding: 0 48px;
        }

        .ab-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #005DFF;
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.3px;
          padding: 11px 26px;
          border-radius: 24px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 93, 255, 0.3);
          transition: all 0.2s ease;
        }
        .ab-back-btn:hover {
          background: #004ecc;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 93, 255, 0.4);
        }


        .ab-logo-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ab-logo-mark {
          width: 54px; 
          height: 54px;
          background: rgba(20,152,254,0.12);
          border: 1px solid rgba(0,0,0,0.25);
          box-shadow: 0 4px 6px 2px rgba(93,134,148,0.55);
          border-radius: 14px;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }

        /* ─── HERO ─── */
        .ab-hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 32px 30px;
          text-align: center;
        }

        .ab-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 22px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.9);
          color: #003087;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .ab-title {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.3;
          color: #000000;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }

        .ab-desc {
          font-size: 20px;
          color: #1e293b;
          line-height: 1.8;
          max-width: 900px;
          margin: 0 auto 30px;
          font-weight: 500;
        }

        /* ─── 3 PILAR CARDS ─── */
        .ab-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1260px;
          margin: 40px auto;
          padding: 0 32px;
        }

        .ab-card {
          background: #B9F9FF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 32px;
          padding: 36px 30px;
          box-shadow: 0 8px 20px rgba(93, 134, 148, 0.25);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .ab-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px rgba(93, 134, 148, 0.38);
          background: #c5fbff;
        }

        .ab-card-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          box-shadow: 0 4px 10px rgba(0, 93, 255, 0.15);
        }

        .ab-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #002b66;
          margin-bottom: 14px;
        }

        .ab-card-text {
          font-size: 16px;
          color: #0f172a;
          line-height: 1.7;
          font-weight: 400;
        }

        /* ─── STORY / VISI MISI ─── */
        .ab-story-section {
          max-width: 1260px;
          margin: 60px auto;
          padding: 56px 52px;
          background: #B9F9FF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 36px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 56px;
          align-items: center;
          box-shadow: 0 12px 36px rgba(93, 134, 148, 0.28);
        }

        .ab-story-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ab-section-tag {
          color: #005DFF;
          font-weight: 800;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.9);
          padding: 6px 16px;
          border-radius: 20px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(0, 93, 255, 0.12);
        }

        .ab-story-title {
          font-size: 34px;
          font-weight: 800;
          color: #002b66;
          line-height: 1.3;
          margin-top: 4px;
        }

        .ab-story-p {
          font-size: 16.5px;
          color: #0f172a;
          line-height: 1.8;
          font-weight: 400;
        }

        .ab-story-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }

        .ab-story-point-item {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 93, 255, 0.15);
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14.5px;
          font-weight: 600;
          color: #003087;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ab-story-media {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ab-logo-frame {
          width: 270px;
          height: 270px;
          border-radius: 36px;
          background: #ffffff;
          border: 4px solid #005DFF;
          box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.7), 0 20px 40px rgba(0, 93, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .ab-logo-frame:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.85), 0 26px 50px rgba(0, 93, 255, 0.32);
        }


        .ab-logo-frame img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }


        /* ─── TIM PENGEMBANG ─── */
        .ab-team-section {
          max-width: 1200px;
          margin: 60px auto 90px;
          padding: 0 32px;
          text-align: center;
        }

        .ab-team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-top: 48px;
        }

        .ab-team-card {
          background: #B9F9FF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 36px;
          padding: 42px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 8px 24px rgba(93, 134, 148, 0.25);
          transition: all 0.3s ease;
        }
        .ab-team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(93, 134, 148, 0.35);
        }

        .ab-team-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 22px;
          border: 4px solid #005DFF;
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.8);
          background: #ffffff;
        }
        .ab-team-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ab-member-name {
          font-size: 24px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 6px;
        }

        .ab-member-role {
          font-size: 16px;
          color: #005DFF;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .ab-member-bio {
          font-size: 15px;
          color: #334155;
          line-height: 1.7;
          margin-bottom: 24px;
          font-weight: 400;
          max-width: 440px;
        }

        .ab-social-wrap {
          display: flex;
          gap: 14px;
        }

        .ab-social-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #005DFF;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
        .ab-social-btn:hover {
          background: #005DFF;
          color: #ffffff;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 6px 14px rgba(0, 93, 255, 0.35);
        }

        @media (max-width: 900px) {
          .ab-header { padding: 0 20px; }
          .ab-grid-3, .ab-team-grid, .ab-story-section { grid-template-columns: 1fr; }
          .ab-title { font-size: 32px; }
          .ab-desc { font-size: 17px; }
        }
      `}</style>

      <div className="ab-root">
        {/* ── Header ── */}
        <header className="ab-header">
          <button className="ab-back-btn" onClick={onBack}>
            <ArrowLeftIcon /> Kembali ke Beranda
          </button>
          
          <div className="ab-logo-group">
            <div className="ab-logo-mark">
              <img
                src="/assets/Bridge.png"
                alt="BridgeCom"
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: "#003087" }}>BridgeCom</span>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="ab-hero">
          <div className="ab-badge">
            <SparklesIcon /> Tentang Proyek & Pengembang
          </div>
          
          <h1 className="ab-title">
            Menjembatani Komunikasi Tanpa Batas dengan Kecerdasan Buatan & IoT
          </h1>
          
          <p className="ab-desc">
            BridgeCom lahir dari inisiatif Project-Based Learning (PBL) dan riset Tugas Akhir di 
            <strong> Politeknik Negeri Batam</strong> untuk menghadirkan solusi teknologi inklusif yang nyata bagi penyandang Tuli di Indonesia.
          </p>
        </section>

        {/* ── 3 Pilar Utama ── */}
        <div className="ab-grid-3">
          <div className="ab-card">
            <div className="ab-card-icon">
              <SparklesIcon />
            </div>
            <h3 className="ab-card-title">Inklusivitas Sosial</h3>
            <p className="ab-card-text">
              Membuka akses komunikasi dua arah yang setara antara penyandang Tuli dan masyarakat umum, khususnya dalam proses belajar mengajar di lingkungan kampus.
            </p>
          </div>

          <div className="ab-card">
            <div className="ab-card-icon">
              <CpuIcon />
            </div>
            <h3 className="ab-card-title">Edge AI & Computer Vision</h3>
            <p className="ab-card-text">
              Memanfaatkan MediaPipe Hands dan arsitektur model deep learning TensorFlow Lite (Siformer) untuk mengenali pola gerakan BISINDO secara presisi dan real-time.
            </p>
          </div>

          <div className="ab-card">
            <div className="ab-card-icon">
              <GlobeIcon />
            </div>
            <h3 className="ab-card-title">Ekosistem IoT Terdistribusi</h3>
            <p className="ab-card-text">
              Terintegrasi dengan protokol MQTT standar industri dan WebSocket, memungkinkan sistem penerjemah terhubung langsung ke smart kiosk maupun sensor eksternal.
            </p>
          </div>
        </div>

        {/* ── Visi & Latar Belakang ── */}
        <div className="ab-story-section">
          <div className="ab-story-content">
            <span className="ab-section-tag">
              <SparklesIcon /> Visi & Misi BridgeCom
            </span>
            <h2 className="ab-story-title">
              Teknologi Cerdas untuk Merangkul Keberagaman
            </h2>
            <p className="ab-story-p">
              Bahasa Isyarat Indonesia (BISINDO) adalah sarana komunikasi utama bagi teman Tuli. Namun, kendala komunikasi sering kali muncul karena keterbatasan pemahaman masyarakat umum terhadap bahasa isyarat.
            </p>
            <p className="ab-story-p">
              Melalui <strong>BridgeCom</strong>, kami menciptakan jembatan digital yang mampu menerjemahkan gesture BISINDO menjadi teks dan informasi secara instan, mendukung terciptanya lingkungan pendidikan dan publik yang ramah disabilitas.
            </p>

            {/* Poin-poin Sorotan Ringkas */}
            <div className="ab-story-points">
              <div className="ab-story-point-item">
                <span>🎯</span> Real-time AI Translation
              </div>
              <div className="ab-story-point-item">
                <span>📡</span> IoT Telemetry Enabled
              </div>
              <div className="ab-story-point-item">
                <span>🏫</span> Campus Inclusivity Focus
              </div>
              <div className="ab-story-point-item">
                <span>⚡</span> Edge-Optimized Speed
              </div>
            </div>
          </div>

          <div className="ab-story-media">
            <div className="ab-logo-frame">
              <img
                src="/assets/Bridge.png"
                alt="BridgeCom Official Emblem"
              />
            </div>
          </div>
        </div>


        {/* ── Tim Pengembang ── */}
        <section className="ab-team-section">
          <span className="ab-section-tag">
            Tim Pengembang
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, marginTop: 4, color: "#000" }}>
            Orang di Balik BridgeCom
          </h2>
          <p style={{ color: "#334155", fontSize: 18, marginTop: 8, fontWeight: 500 }}>
            Mahasiswa Teknik Informatika / IoT — Politeknik Negeri Batam
          </p>

          <div className="ab-team-grid">
            {team.map((member) => (
              <div key={member.name} className="ab-team-card">
                <div className="ab-team-avatar">
                  <img
                    src={member.photo}
                    alt={member.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerText = member.name.charAt(0);
                      e.target.parentNode.style.display = "flex";
                      e.target.parentNode.style.alignItems = "center";
                      e.target.parentNode.style.justifyContent = "center";
                      e.target.parentNode.style.fontSize = "40px";
                      e.target.parentNode.style.fontWeight = "bold";
                      e.target.parentNode.style.color = "#005DFF";
                    }}
                  />
                </div>
                <h3 className="ab-member-name">
                  {member.name}
                </h3>
                <span className="ab-member-role">
                  {member.role} • {member.univ}
                </span>
                <p className="ab-member-bio">
                  {member.bio}
                </p>

                <div className="ab-social-wrap">
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="ab-social-btn" title="GitHub">
                    <GithubIcon />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="ab-social-btn" title="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href={member.email} className="ab-social-btn" title="Email">
                    <MailIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
