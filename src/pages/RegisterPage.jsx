import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false); //you can call it loading 
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setErr("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      username: String(fd.get("username") || "").trim().toLowerCase(),
      email: String(fd.get("email") || "").trim().toLowerCase(),
      password: String(fd.get("password") || "").trim(),
    };

    // light client checks (server is still source of truth)
    if (!payload.name || !payload.username || !payload.email || !payload.password) {
      setBusy(false);
      const msg = "All fields are required";
      setErr(msg);
      toast.error(msg);
      return;
    }
    if (payload.password.length < 8) {
      setBusy(false);
      const msg = "Password must be at least 8 characters";
      setErr(msg);
      toast.error(msg);
      return;
    }

    try {
      await register(payload); // sets cookies + fetches /me in AuthContext
      toast.success("Welcome! Your account was created.");
      navigate("/me", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed";
      setErr(String(msg));           // ensure it's a string (prevents render crash)
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="card max-w-lg mx-auto">
        <div className="card-header">
          <h3 className="card-title">Create account</h3>
        </div>
        <div className="card-content">
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-3">
              {/* Name */}
              <div className="field-row">
                <label htmlFor="name" className="label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input"
                  autoComplete="name"
                  required
                />
              </div>

              {/* Username */}
              <div className="field-row">
                <label htmlFor="username" className="label">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="input"
                  autoComplete="username"
                  required
                />
              </div>

              {/* Email */}
              <div className="field-row">
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="field-row">
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            {!!err && <div className="error mt-1">{err}</div>}

            <div>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? "Creating…" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
