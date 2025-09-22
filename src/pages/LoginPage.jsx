// src/pages/LoginPage.jsx
import Login from "../auth/Login";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/me", { replace: true }); }, [user, navigate]);

  return (
    <div className="grid gap-4">
      <div className="card max-w-sm w-full mx-auto">
        <div className="card-header"><h3 className="card-title">Welcome back</h3></div>
        <div className="card-content"><Login /></div>
      </div>
      <div className="card max-w-sm w-full mx-auto">
        <div className="card-content">
          <span className="subtle">Not registered? </span>
          <Link to="/register" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
