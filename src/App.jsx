import { Routes, Route, Navigate, Link } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MePage from "./pages/MePage";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="brabd">SyncSkilled</div>
            <div className="flex items-center gap-2">
              <Link to="/" className="btn-outline">
                Home
              </Link>
              {!user ? (
                <>
                  <Link to="/login" className="btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn-outline">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/me" className="btn-outline">
                    Profile
                  </Link>
                  <button className="btn-primary" onClick={logout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <MePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
