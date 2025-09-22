// src/pages/MePage.jsx
import { useEffect, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { Auth } from "../api";
import { normalizeTeach, normalizeLearn } from "../utils/skills";

export default function MePage() {
  const { user, setUser } = useAuth();

  useEffect(() => { (async () => { try { const d = await Auth.me(); setUser(d.user); } catch {} })(); }, [setUser]);

  const teach = useMemo(() => (user?.skillsToTeach || []).map(normalizeTeach).filter(Boolean), [user]);
  const learn = useMemo(() => (user?.skillsToLearn || []).map(normalizeLearn).filter(Boolean), [user]);

  if (!user) return null;

  const initials = (s) => (s?.name || s?.slug || "?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="card-header"><h3 className="card-title">My Profile</h3></div>
        <div className="card-content">
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Credits:</strong> {user.credits}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Skills to Teach</h3></div>
        <div className="card-content">
          <ul className="list">
            {teach.length === 0 && <li className="subtle">No teaching skills yet.</li>}
            {teach.map((t, i) => (
              <li key={i} className="row">
                <div className="row-left">
                  <span className="avatar">{initials(t)}</span>
                  <div>
                    <div className="heading">{t.name || t.slug || "Unknown skill"}</div>
                    <div className="subtle">{t.category?.name || "—"}</div>
                  </div>
                </div>
                <div className="row-left">
                  <span className="pill">{t.creditsPerHour ?? "n/a"} cr/hr</span>
                  {!t.isActive && <span className="badge-soft">inactive</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Skills to Learn</h3></div>
        <div className="card-content">
          <ul className="list">
            {learn.length === 0 && <li className="subtle">No learning skills yet.</li>}
            {learn.map((l, i) => (
              <li key={i} className="row">
                <div className="row-left">
                  <span className="avatar">{initials(l)}</span>
                  <div>
                    <div className="heading">{l.name || l.slug || "Unknown skill"}</div>
                    <div className="subtle">{l.category?.name || "—"}</div>
                  </div>
                </div>
                <div className="row-left">
                  {l.interestedSince && (
                    <span className="badge-soft">
                      since {new Date(l.interestedSince).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
