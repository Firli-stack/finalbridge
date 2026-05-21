import { useState } from "react";

import { Landing } from "./pages/LandingPage";
import { TranslationPage } from "./pages/TranslationPage";

import { LoginAdmin } from "./pages/LoginAdmin";
import { Admindashboard } from "./pages/Admindashboard";

function App() {
  // landing | login | dashboard | translation
  const [view, setView] = useState("landing");

  // ── Login Admin ──
  if (view === "login") {
    return (
      <LoginAdmin
        onLogin={() => setView("dashboard")}
        onBack={() => setView("landing")}
      />
    );
  }

  // ── Dashboard Admin ──
  if (view === "dashboard") {
    return (
      <Admindashboard
        onLogout={() => setView("landing")}
      />
    );
  }

  // ── Translation Page ──
  if (view === "translation") {
    return (
      <TranslationPage
        onBack={() => setView("landing")}
      />
    );
  }

  // ── Landing Page ──
  return (
    <Landing
      // tombol mulai sekarang
      onStart={() => setView("translation")}

      // tombol login admin
      onAdmin={() => setView("login")}
    />
  );
}

export default App;