// src/components/layout/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { user, booting, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">SyncSkilled</div>
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Home</NavLink>
          {!user && !booting && (
            <>
              <NavLink to="/login" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Register</NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink to="/me" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Profile</NavLink>
              <button className="btn-primary" onClick={onLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
