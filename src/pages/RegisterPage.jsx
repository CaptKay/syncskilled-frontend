import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const {user, register} = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({username:"", email:"", name:"", password:""})
    const [msg, setMsg] = useState("")

    useEffect(()=>{
        if(user) navigate("/me", {replace: true})
    },[user, navigate])

    async function onSubmit(e) {
        e.preventDefault()
        setMsg("")
        try {
            await register(form)
            navigate("/me", {replace:true})
        } catch (error) {
            setMsg(error?.response?.data?.error || "Registration failed")
            toast.error(error?.response?.data?.error || "Registration failed")
        }
    }

     //check the label for HTMLFOR and input for TYPE, and !!/&&
  return (
    <div className="container">
        <div className="card max-w-md mx-auto">
            <div className="card-header"><h3 className="card-title">Register</h3></div>
            <div className="card-content">
                <form onSubmit={onSubmit} className="grid gap-3">
                   <div className="grid gap-1">
                    <label htmlFor="username" className="label">Username</label>
                    <input id="username" type="text" className="input" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})}  />
                    </div> 
                   <div className="grid gap-1">
                    <label htmlFor="email" className="label">Email</label>
                    <input id="email" type="email" className="input" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}  />
                    </div> 
                   <div className="grid gap-1">
                    <label htmlFor="fullname" className="label">Full Name</label>
                    <input id="fullname" type="text" className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}  />
                    </div> 
                   <div className="grid gap-1">
                    <label htmlFor="password" className="label">Password</label>
                    <input id="password" type="password" className="input" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}  />
                    </div> 
                    <button className="btn-primary">Create account</button>
                    {!!msg && <div className="subtle">{msg}</div>}
                </form>
                <div className="subtle mt-2">
                    Already have an account? <Link to="/login" className="link">Login</Link>
                </div>
            </div>
        </div>
    </div>
  )

}