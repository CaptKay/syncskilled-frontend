// src/App.jsx
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { Fragment } from "react";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MePage from "./pages/MePage";
import CategoriesPage from "./pages/CategoriesPage";
import CategorySkillsPage from "./pages/CategorySkillsPage";
import PostPage from "./pages/PostPage";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="container">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="flex flex-col gap-1">
              <span className="brand">SyncSkilled</span>
              <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Learn • Share • Grow
              </span>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:flex-1 md:pl-8">
              <div className="nav-links">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                  end
                >
                  Home
                </NavLink>
                <NavLink
                  to="/posts"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  Posts
                </NavLink>

                {user && (
                  <NavLink
                    to="/catalog"
                    className={({ isActive }) =>
                      isActive ? "nav-link nav-link-active" : "nav-link"
                    }
                  >
                    Catalog
                  </NavLink>
                )}
              </div>

              <div className="nav-cta">
                {user ? (
                  <Fragment>
                    <NavLink
                      to="/posts/create"
                      className={({ isActive }) =>
                        isActive
                          ? "btn-primary"
                          : "btn-outline"
                      }
                    >
                      New Post
                    </NavLink>
                    <NavLink
                      to="/me"
                      className={({ isActive }) =>
                        isActive ? "nav-link nav-link-active" : "nav-link"
                      }
                    >
                      Profile
                    </NavLink>
                    <button className="btn-muted" onClick={logout}>
                      Logout
                    </button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "nav-link nav-link-active" : "nav-link"
                      }
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive ? "btn-primary" : "btn-outline"
                      }
                    >
                      Join now
                    </NavLink>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostPage />} />
          <Route path="/posts/:postId" element={<PostDetails />} />

          {/* Protected pages */}
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <MePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog/:idOrSlug"
            element={
              <ProtectedRoute>
                <CategorySkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
