// src/auth/Login.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try { await login(identifier.trim(), password); setMsg("Logged in!"); }
    catch (e) { setMsg(e?.response?.data?.error || "Login failed"); }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="field-row">
        <label className="label">Email or username</label>
        <input className="input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
      </div>
      <div className="field-row">
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn-primary">Login</button>
      {!!msg && <div className="subtle">{msg}</div>}
    </form>
  );
}
