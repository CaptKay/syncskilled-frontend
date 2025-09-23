import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  //if already logged in
  useEffect(() => {
    if (user) navigate("/me", { replace: true });
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await login({ identifier, password });
      // if we were redirected here from a protected page, go back there
      const dest = location.state?.from?.pathname || "/me";
      navigate(dest, { replace: true });
    } catch (error) {
      setMsg(error?.response?.data?.error || "Login failed");
    }
  }

  //check the label for HTMLFOR and input for TYPE, and !!/&&
  return (
    <div className="container">
      <div className="card max-w-sm mx-auto">
        <div className="card-header">
          <h3 className="card-title">Login</h3>
        </div>
        <div className="card-content">
          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-1">
              <label htmlFor="" className="label">
                Email or Username
              </label>
              <input
                type="text"
                className="input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="" className="label">
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn-primary">Login</button>
            {!!msg && <div className="subtle">{msg}</div>}
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
