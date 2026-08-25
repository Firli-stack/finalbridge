import { useState, useEffect } from "react";

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
const SparklesIcon = (props) => (
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);


// ── Tech card data (Dibagi menjadi 2 baris interaktif) ───────
const technologiesRow1 = [
  {
    name: "Raspberry Pi 4",
    bg: "#C51A4A",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg",
    link: "https://www.raspberrypi.com/",
  },
  {
    name: "MediaPipe Hands",
    bg: "#fff",
    textColor: "#111",
    border: "1px solid #ddd",
    logo: "https://cdn.brandfetch.io/idL_Jl2SZd/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1670440040290",
    link: "https://developers.google.com/mediapipe",
  },
  {
    name: "TensorFlow Lite",
    bg: "#FF6F00",
    textColor: "#fff",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    link: "https://www.tensorflow.org/lite",
  },
  {
    name: "Python",
    bg: "#fff",
    textColor: "#111",
    border: "1px solid #ddd",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    link: "https://www.python.org/",
  },
];

const technologiesRow2 = [
  {
    name: "FastAPI",
    bg: "#fff",
    textColor: "#059669",
    border: "1px solid #ddd",
    logo: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png",
    link: "https://fastapi.tiangolo.com/",
  },
  {
    name: "MQTT IoT Protocol",
    bg: "#fff",
    textColor: "#660066",
    border: "1px solid #ddd",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Mqtt-hor.svg",
    link: "https://mqtt.org/",
  },
  {
    name: "React JS",
    bg: "#20232a",
    textColor: "#61dafb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    link: "https://react.dev/",
  },
  {
    name: "Vite JS",
    bg: "#fff",
    textColor: "#646cff",
    border: "1px solid #ddd",
    logo: "https://vitejs.dev/logo.svg",
    link: "https://vitejs.dev/",
  },
  {
    name: "Docker",
    bg: "#fff",
    textColor: "#2496ED",
    border: "1px solid #ddd",
    logo: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
    link: "https://www.docker.com/",
  },
];



const team = [
  {
    name: "Firli Hanifurahman",
    role: "Developer",
    photo: "/assets/Ireng.png",
    github: "https://github.com/Firli-stack",
    linkedin: "https://www.linkedin.com/in/firli-hanifurahman/",
    email: "mailto:firlihanifurahman753@Gmail.com"
  },
  {
    name: "Marsel V.P Naibaho",
    role: "Developer",
    photo: "/assets/Ireng2.png",
    github: "https://github.com/tamanaibaho",
    linkedin: "https://www.linkedin.com/in/marsel-naibaho-648a70333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "mailto:marselvicentiuspaltakmanaibaho@Gmail.com"
  },
];


// ── Main Component ───────────────────────────────────────────
export function Landing({ onStart, onAdmin, onAbout }) {
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
        .bc-header-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .bc-nav-btn {
          background: transparent;
          color: #003087;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: all .2s;
        }
        .bc-nav-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          color: #001f5c;
        }
        .bc-admin-btn {
          background: #005DFF;
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.3px;
          padding: 11px 28px;
          border-radius: 24px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 93, 255, 0.3);
          transition: all 0.2s ease;
        }
        .bc-admin-btn:hover {
          background: #004ecc;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 93, 255, 0.4);
        }



        /* ─── HERO (TOP ROW LOGO+TITLE, BOTTOM DESC) ─── */
        .bc-hero {
          max-width: 1200px; 
          margin: 30px auto 48px;
          padding: 0 48px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Baris Atas: Logo & Judul Sejajar */
        .bc-hero-top {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .bc-hero-logo-frame {
          flex-shrink: 0;
          width: 180px;
          height: 180px;
          border-radius: 32px;
          background: #ffffff;
          border: 4px solid #005DFF;
          box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.7), 0 18px 40px rgba(0, 93, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .bc-hero-logo-frame:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.85), 0 24px 50px rgba(0, 93, 255, 0.32);
        }
        .bc-hero-logo-frame img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .bc-hero-title-group {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bc-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          color: #005DFF;
          font-weight: 700;
          font-size: 14.5px;
          padding: 6px 18px;
          border-radius: 20px;
          margin-bottom: 12px;
          width: fit-content;
          box-shadow: 0 2px 10px rgba(0, 93, 255, 0.12);
        }

        .bc-hero-title {
          font-weight: 800; 
          font-size: 42px; 
          line-height: 52px; 
          letter-spacing: 0.5px;
          color: #002b66; 
        }

        /* Baris Bawah: Deskripsi Luas, Highlight Cards & Tombol CTA */
        .bc-hero-bottom {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 32px;
          padding: 36px 44px;
          box-shadow: 0 10px 30px rgba(93, 134, 148, 0.2);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .bc-hero-desc {
          font-weight: 400; 
          font-size: 17.5px; 
          line-height: 32px; 
          letter-spacing: 0.3px;
          color: #0f172a; 
        }

        .bc-hero-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .bc-hero-features {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .bc-hero-feat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #003087;
          background: rgba(255, 255, 255, 0.85);
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid rgba(0, 93, 255, 0.15);
        }

        .bc-cta {
          display: inline-flex; align-items: center; gap: 12px;
          background: #005DFF;
          box-shadow: 0 6px 24px rgba(0, 93, 255, 0.4);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-weight: 600; font-size: 20px; letter-spacing: 0.5px;
          padding: 16px 44px; border-radius: 100px; border: none; cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
        }
        .bc-cta:hover {
          background: #004ecc;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 93, 255, 0.5);
        }


        /* ─── TECH SECTION (CONTINUOUS INFINITE FLOW) ─── */
        .bc-tech-wrap {
          padding: 0 48px 64px;
        }
        .bc-tech-box {
          max-width: 1200px; 
          margin: 0 auto;
          background: #B9F9FF;
          border-radius: 28px;
          box-shadow: 0 4px 50px 2px #26C8FF;

          padding: 40px 0 48px;
          overflow: hidden;
          position: relative;
        }
        /* Efek bayangan pudar di ujung kiri dan kanan */
        .bc-tech-box::before,
        .bc-tech-box::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 140px;
          z-index: 10;
          pointer-events: none;
        }
        .bc-tech-box::before {
          left: 0;
          background: linear-gradient(90deg, #B9F9FF 20%, rgba(185, 249, 255, 0) 100%);
        }
        .bc-tech-box::after {
          right: 0;
          background: linear-gradient(270deg, #B9F9FF 20%, rgba(185, 249, 255, 0) 100%);
        }

        .bc-marquee-track-left {
          display: flex;
          width: max-content;
          gap: 28px;
          animation: bcScrollLeft 24s linear infinite;
          padding: 10px 0;
        }
        .bc-marquee-track-left:hover {
          animation-play-state: paused;
        }

        .bc-marquee-track-right {
          display: flex;
          width: max-content;
          gap: 28px;
          animation: bcScrollRight 24s linear infinite;
          padding: 10px 0;
        }
        .bc-marquee-track-right:hover {
          animation-play-state: paused;
        }

        @keyframes bcScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes bcScrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }


        .bc-marquee-card {
          flex-shrink: 0;
          width: 220px;
          height: 165px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 16px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          text-decoration: none;
        }
        .bc-marquee-card:hover {
          transform: translateY(-8px) scale(1.08);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
          z-index: 5;
        }
        .bc-marquee-card img {
          max-height: 60px;
          max-width: 120px;
          object-fit: contain;
        }
        .bc-tech-name {
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.3px;
          text-align: center;
        }
        .bc-tech-sub {
          font-size: 11px;
          opacity: 0.75;
          text-align: center;
          margin-top: -8px;
        }
        .bc-lstm-big {
          font-weight: 800;
          font-size: 38px;
          letter-spacing: 2px;
        }
 .bc-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(0, 93, 255, 0.25);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .bc-dot.active {
          width: 24px;
          border-radius: 12px;
          background: #005DFF;
        }


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

        /* ─── Responsive (Mobile, Tablet, Desktop) ─── */
        @media (max-width: 1024px) {
          .bc-header { padding: 0 32px; }
          .bc-hero { padding: 0 32px; }
          .bc-hero-title { font-size: 36px; line-height: 46px; }
          .bc-team-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .bc-vm-grid { gap: 32px; }
        }

        @media (max-width: 768px) {
          .bc-header { 
            padding: 0 16px; 
            height: 70px; 
            gap: 12px;
          }
          .bc-logo-mark {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }
          .bc-logo-mark img {
            width: 38px !important;
            height: 38px !important;
          }
          .bc-header-nav { 
            gap: 8px; 
          }
          .bc-nav-btn { 
            font-size: 13px; 
            padding: 6px 10px; 
          }
          .bc-admin-btn { 
            font-size: 13px; 
            padding: 8px 14px; 
            letter-spacing: 0;
            white-space: nowrap;
          }

          .bc-hero { padding: 0 20px; gap: 24px; margin: 20px auto 36px; }
          .bc-hero-top { flex-direction: column; text-align: center; gap: 20px; }
          .bc-hero-logo-frame { width: 140px; height: 140px; border-radius: 28px; padding: 16px; }
          .bc-hero-badge { margin: 0 auto 12px auto; font-size: 13px; }
          .bc-hero-title { font-size: 28px; line-height: 38px; }

          .bc-hero-bottom { padding: 24px 20px; border-radius: 24px; gap: 20px; }
          .bc-hero-desc { font-size: 15px; line-height: 28px; }
          .bc-hero-footer-row { flex-direction: column; align-items: stretch; gap: 20px; }
          .bc-hero-features { justify-content: center; }
          .bc-hero-feat-item { font-size: 13.5px; padding: 6px 14px; }
          .bc-cta { width: 100%; justify-content: center; font-size: 18px; padding: 14px 28px; }

          .bc-tech-wrap, .bc-team-wrap, .bc-vm-wrap, .bc-footer { padding-left: 20px; padding-right: 20px; }
          .bc-tech-box { border-radius: 20px; padding: 30px 0 36px; }
          .bc-marquee-card { width: 180px; height: 140px; border-radius: 18px; padding: 14px 10px; }
          .bc-marquee-card img { max-height: 48px; max-width: 90px; }
          .bc-tech-name { font-size: 14px; }

          .bc-team-grid { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
          .bc-vm-grid, .bc-footer-grid { grid-template-columns: 1fr; gap: 28px; }
        }

        @media (max-width: 480px) {
          .bc-header {
            padding: 0 12px;
            height: 64px;
          }
          .bc-logo-mark {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }
          .bc-logo-mark img {
            width: 32px !important;
            height: 32px !important;
          }
          .bc-nav-btn {
            font-size: 12px;
            padding: 5px 8px;
          }
          .bc-admin-btn {
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 18px;
          }
          .bc-hero-title { font-size: 24px; line-height: 34px; }
          .bc-hero-features { flex-direction: column; width: 100%; }
          .bc-hero-feat-item { justify-content: center; width: 100%; }
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
          <div className="bc-header-nav">
            <button className="bc-nav-btn" onClick={onAbout}>
              Tentang Kami
            </button>
            <button className="bc-admin-btn" onClick={onAdmin}>
              Login sebagai Admin
            </button>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="bc-hero">
          {/* Baris Atas: Logo dan Judul Sejajar */}
          <div className="bc-hero-top">
            <div className="bc-hero-logo-frame">
              <img
                src="/assets/Bridge.png"
                alt="BridgeCom Official Emblem"
              />
            </div>

            <div className="bc-hero-title-group">
              <div className="bc-hero-badge">
                <SparklesIcon /> Sistem Cerdas Penerjemah BISINDO
              </div>
              <h1 className="bc-hero-title">
                Bangun Sistem Pembelajaran Inklusif Dengan BridgeCom
              </h1>
            </div>
          </div>

          {/* Baris Bawah: Deskripsi Luas, Highlight Badges & Tombol CTA */}
          <div className="bc-hero-bottom">
            <p className="bc-hero-desc">
              BridgeCom menghadirkan sistem penerjemah bahasa isyarat berbasis
              Internet of Things (IoT) yang dirancang untuk mendukung proses
              pembelajaran inklusif, khususnya di lingkungan Kampus. Sistem ini
              membantu mahasiswa memahami komunikasi dari mahasiswa berkebutuhan
              khusus, serta memudahkan dosen dalam menyampaikan materi secara
              lebih inklusif.
            </p>

            <div className="bc-hero-footer-row">
              <div className="bc-hero-features">
                <div className="bc-hero-feat-item">
                  <span>✨</span> Real-time AI Vision
                </div>
                <div className="bc-hero-feat-item">
                  <span>📡</span> IoT Connected
                </div>
                <div className="bc-hero-feat-item">
                  <span>🎓</span> Inovasi PBL Polibatam
                </div>
              </div>

              <button className="bc-cta" onClick={onStart}>
                <PlayIcon />
                Mulai Sekarang
              </button>
            </div>
          </div>
        </section>



        {/* ── Teknologi 3D Carousel ── */}
        <section className="bc-tech-wrap">
          <div className="bc-tech-box">
            <h2
              style={{
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: 0.4,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Teknologi yang kami gunakan
            </h2>

            {/* ── Baris 1: Mengalir ke Kiri ── */}
            <div className="bc-marquee-track-left">
              {[...technologiesRow1, ...technologiesRow1].map((tech, index) => (
                <a
                  key={`row1-${tech.name}-${index}`}
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bc-marquee-card"
                  style={{
                    background: tech.bg,
                    color: tech.textColor,
                    border: tech.border || "none",
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
                </a>
              ))}
            </div>

            {/* ── Baris 2: Mengalir ke Kanan ── */}
            <div className="bc-marquee-track-right" style={{ marginTop: 16 }}>
              {[...technologiesRow2, ...technologiesRow2].map((tech, index) => (
                <a
                  key={`row2-${tech.name}-${index}`}
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bc-marquee-card"
                  style={{
                    background: tech.bg,
                    color: tech.textColor,
                    border: tech.border || "none",
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
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: 14,
                  }}
                >
                  <div style={{ marginTop: 2}}><PhoneIcon />
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: 2}}>
                  <span>+6295-6118-81808</span>
                  <span>+62821-7025-1116</span>
                  </div>
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
                <button className="bc-footer-link" onClick={onAbout}>
                  <ChevronRightIcon /> Tentang Kami
                </button>
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
