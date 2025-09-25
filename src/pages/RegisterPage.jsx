// import { useEffect, useState } from "react";
// import { useAuth } from "../auth/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function RegisterPage() {
//     const {user, register} = useAuth()
//     const navigate = useNavigate()
//     const [form, setForm] = useState({
//         username:"",
//          email:"", 
//          name:"", 
//          password:""
//         })
//     const [msg, setMsg] = useState("")

//     useEffect(()=>{
//         if(user) navigate("/me", {replace: true})
//     },[user, navigate])

//     async function onSubmit(e) {
//         e.preventDefault()
//         setMsg("")
//         try {
//             await register(form)
//             navigate("/me", {replace:true})
//         } catch (error) {
//             setMsg(error?.response?.data?.error || "Registration failed")
//             toast.error(error?.response?.data?.error || "Registration failed")
//         }
//     }

//      //check the label for HTMLFOR and input for TYPE, and !!/&&
//   return (
//     <div className="container">
//         <div className="card max-w-md mx-auto">
//             <div className="card-header"><h3 className="card-title">Register</h3></div>
//             <div className="card-content">
//                 <form onSubmit={onSubmit} className="grid gap-3">
//                    <div className="grid gap-1">
//                     <label htmlFor="username" className="label">Username</label>
//                     <input id="username" type="text" className="input" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})}  />
//                     </div> 
//                    <div className="grid gap-1">
//                     <label htmlFor="email" className="label">Email</label>
//                     <input id="email" type="email" className="input" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}  />
//                     </div> 
//                    <div className="grid gap-1">
//                     <label htmlFor="fullname" className="label">Full Name</label>
//                     <input id="fullname" type="text" className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}  />
//                     </div> 
//                    <div className="grid gap-1">
//                     <label htmlFor="password" className="label">Password</label>
//                     <input id="password" type="password" className="input" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}  />
//                     </div> 
//                     <button className="btn-primary">Create account</button>
//                     {!!msg && <div className="subtle">{msg}</div>}
//                 </form>
//                 <div className="subtle mt-2">
//                     Already have an account? <Link to="/login" className="link">Login</Link>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )

// }

//==========================================================================================================================================================

// import { useState } from "react";
// import { useAuth } from "../auth/AuthContext";
// import toast from "react-hot-toast";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");

//   async function onSubmit(e) {
//     e.preventDefault();
//     if (busy) return;

//     setBusy(true);
//     setErr("");

//     const fd = new FormData(e.currentTarget);
//     const payload = {
//       name: String(fd.get("name") || "").trim(),
//       username: String(fd.get("username") || "").trim().toLowerCase(),
//       email: String(fd.get("email") || "").trim().toLowerCase(),
//       password: String(fd.get("password") || ""),
//     };

//     try {
//       await register(payload);
//       toast.success("Welcome! Your account was created.");
//     } catch (error) {
//       // read error safely without crashing
//       const msg =
//         error?.response?.data?.error ||
//         error?.message ||
//         "Registration failed";
//       setErr(msg);
//       toast.error(msg);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="card">
//       <div className="card-header"><h3 className="card-title">Create account</h3></div>
//       <div className="card-content">
//         <form className="form" onSubmit={onSubmit} noValidate>
//           <div className="grid md:grid-cols-2 gap-3">
//             <div className="field-row">
//               <label htmlFor="name" className="label">Name</label>
//               <input id="name" name="name" type="text" className="input" required />
//             </div>
//             <div className="field-row">
//               <label htmlFor="username" className="label">Username</label>
//               <input id="username" name="username" type="text" className="input" required />
//             </div>
//             <div className="field-row">
//               <label htmlFor="email" className="label">Email</label>
//               <input id="email" name="email" type="email" autoComplete="email" className="input" />
//             </div>
//             <div className="field-row">
//               <label htmlFor="password" className="label">Password</label>
//               <input id="password" name="password" type="password" autoComplete="new-password" className="input" />
//             </div>
//           </div>

//           {err && <div className="error mt-1">{err}</div>}

//           <div>
//             <button className="btn-primary" disabled={busy}>
//               {busy ? "Creating…" : "Register"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


//===============================================================================================================================

// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
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
      password: String(fd.get("password") || ""),
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
