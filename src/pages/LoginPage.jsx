import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/me", { replace: true });
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      await login({ identifier, password });
      // If redirected from a protected page, go back there
      const dest = location.state?.from?.pathname || "/me";
      navigate(dest, { replace: true });
    } catch (error) {
      const errMsg =
        error?.response?.data?.error || error?.message || "Login failed";
      setMsg(errMsg);
      toast.error(errMsg);
    }
  }

  return (
    <div className="container">
      <div className="card max-w-sm mx-auto">
        <div className="card-header">
          <h3 className="card-title">Login</h3>
        </div>
        <div className="card-content">
          <form onSubmit={onSubmit} className="grid gap-3">
            {/* Identifier */}
            <div className="grid gap-1">
              <label htmlFor="identifier" className="label">
                Email or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                className="input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              Login
            </button>

            {!!msg && <div className="error">{msg}</div>}
          </form>

          <div className="subtle mt-2">
            No account?{" "}
            <Link to="/register" className="link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
