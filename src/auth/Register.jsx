// src/auth/Register.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ username:"", email:"", name:"", password:"" });
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        name: form.name.trim(),
        password: form.password,
      });
      setMsg("Registered!");
    } catch (e) {
      setMsg(e?.response?.data?.error || "Register failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="field-row">
        <label className="label">Username</label>
        <input className="input" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} />
      </div>
      <div className="field-row">
        <label className="label">Email</label>
        <input className="input" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
      </div>
      <div className="field-row">
        <label className="label">Full name</label>
        <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
      </div>
      <div className="field-row">
        <label className="label">Password</label>
        <input className="input" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
      </div>
      <button className="btn-primary">Create account</button>
      {!!msg && <div className="subtle">{msg}</div>}
    </form>
  );
}
