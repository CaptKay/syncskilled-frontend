// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="card-soft">
      <div className="card-content">
        <h1 className="heading-xl">Share skills. Earn credits. Learn faster.</h1>
        <p className="subtle">
          Teach what you know, learn what you want — all powered by a simple credit system and a friendly community.
        </p>
        <div className="flex gap-2 mt-2">
          {!user ? (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-outline">Create account</Link>
            </>
          ) : (
            <Link to="/me" className="btn-primary">Go to profile</Link>
          )}
        </div>
      </div>
    </div>
  );
}
