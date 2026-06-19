import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  // Cek apakah ada token admin di localStorage
  const token = localStorage.getItem("admin_token");

  // Kalau gak ada token, tendang paksa ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada token, izinkan masuk ke halaman anak (Dashboard)
  return children;
}