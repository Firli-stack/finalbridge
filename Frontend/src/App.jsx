import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Landing } from "./pages/LandingPage";
import { TranslationPage } from "./pages/TranslationPage";

import { LoginAdmin } from "./pages/LoginAdmin";
import { Admindashboard } from "./pages/Admindashboard";

function NavigationWrapper() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <Landing
            onStart={() => navigate("/translation")}
            onAdmin={() => navigate("/login")}
          />
        }
      />

      {/* Translation Page */}
      <Route
        path="/translation"
        element={
          <TranslationPage
            onBack={() => navigate("/")}
          />
        }
      />

      {/* Login Admin */}
      <Route
        path="/login"
        element={
          <LoginAdmin
            onLogin={() => navigate("/dashboard")}
            onBack={() => navigate("/")}
          />
        }
      />

      {/* Dashboard Admin */}
      <Route
        path="/dashboard"
        element={
          <Admindashboard
            onLogout={() => navigate("/")}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationWrapper />
    </BrowserRouter>
  );
}

export default App;