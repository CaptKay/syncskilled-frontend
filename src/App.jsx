import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/AuthContext";
import Container from "./components/layout/Container";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MePage from "./pages/MePage";

function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <div className="container">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Shell() {
  return (
    <div className="page">
      <Container>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
      </Container>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}
