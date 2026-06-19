import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Landing } from "./pages/LandingPage";
import { TranslationPage } from "./pages/TranslationPage";
import { LoginAdmin } from "./pages/LoginAdmin";
import { Admindashboard } from "./pages/Admindashboard";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import Satpam

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
        element={<TranslationPage onBack={() => navigate("/")} />}
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

      {/* Dashboard Admin - DILINDUNGI */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Admindashboard 
              onLogout={() => {
                localStorage.removeItem("admin_token");
                navigate("/login");
              }} 
            />
          </ProtectedRoute>
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