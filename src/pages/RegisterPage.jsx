// src/pages/RegisterPage.jsx
import Register from "../auth/Register";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/me", { replace: true }); }, [user, navigate]);

  return (
    <div className="grid gap-4">
      <div className="card max-w-md w-full mx-auto">
        <div className="card-header"><h3 className="card-title">Create your account</h3></div>
        <div className="card-content"><Register /></div>
      </div>
      <div className="card max-w-md w-full mx-auto">
        <div className="card-content">
          <span className="subtle">Already have an account? </span>
          <Link to="/login" className="link">Login</Link>
        </div>
      </div>
    </div>
  );
}
