// src/pages/MePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Auth } from "../api";

export default function MePage() {
  const { user, setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch a fresh /me on entry to ensure populated relations
  useEffect(() => {
    (async () => {
      try {
        const d = await Auth.me();
        setUser(d.user);
      } catch {
        // ignore; ProtectedRoute already guards this page
      }
    })();
  }, [setUser]);

  // Helpers to safely read the populated shape you showed
  const teach = useMemo(() => {
    return (user?.skillsToTeach || []).map((t) => ({
      id: t?.skillId?._id || String(t?.skillId || ""),
      slug: t?.skillId?.slug,
      name: t?.skillId?.name || "(Unknown skill)",
      categoryName: t?.skillId?.category?.name || "",
      creditsPerHour: t?.creditsPerHour ?? null,
      isActive: !!t?.isActive,
    }));
  }, [user]);

  const learn = useMemo(() => {
    return (user?.skillsToLearn || []).map((l) => ({
      id: l?.skillId?._id || String(l?.skillId || ""),
      slug: l?.skillId?.slug,
      name: l?.skillId?.name || "(Unknown skill)",
      categoryName: l?.skillId?.category?.name || "",
      since: l?.interestedSince ? new Date(l.interestedSince) : null,
    }));
  }, [user]);

  // pick the most stable identifier your backend accepts (slug or id)
  const skillKey = (row) => row.slug || row.id;

  async function removeTeach(row) {
    if (busy) return;
    setBusy(true);
    setMsg("");
    try {
      await Auth.removeTeach(skillKey(row));
      // refresh local user after mutation
      const d = await Auth.me();
      setUser(d.user);
      setMsg(`Removed "${row.name}" from teaching.`);
    } catch (e) {
      setMsg(e?.response?.data?.error || "Failed to remove teaching skill.");
    } finally {
      setBusy(false);
    }
  }

  async function removeLearn(row) {
    if (busy) return;
    setBusy(true);
    setMsg("");
    try {
      await Auth.removeLearn(skillKey(row));
      const d = await Auth.me();
      setUser(d.user);
      setMsg(`Removed "${row.name}" from learning.`);
    } catch (e) {
      setMsg(e?.response?.data?.error || "Failed to remove learning skill.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  return (
    <div className="grid gap-6">
   {/* Profile summary */}
<div className="card">
  <div className="card-header">
    <h3 className="card-title">My Profile</h3>
  </div>
  <div className="card-content grid gap-3">

    {/* Profile photo + name */}
    <div className="flex items-center gap-4">
      <img
        src={user.profilePhoto || "https://via.placeholder.com/80x80.png?text=?"}
        alt={user.name}
        className="w-20 h-20 rounded-full border object-cover"
      />
      <div>
        <div className="text-lg font-bold text-gray-900">{user.name}</div>
        <div className="subtle">@{user.username}</div>
        <div className="subtle">{user.email}</div>
      </div>
    </div>

    {/* Credits */}
    <div>
      <strong>Credits:</strong> {user.credits}
    </div>

    {/* Bio with label */}
    {user.bio && (
      <div>
        <div className="label">Bio</div>
        <p className="subtle">{user.bio}</p>
      </div>
    )}
  </div>
</div>


      {/* Skills to Teach */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Skills to Teach</h3>
        </div>
        <div className="card-content">
          {teach.length === 0 ? (
            <div className="subtle">No teaching skills yet.</div>
          ) : (
            <ul className="list">
              {teach.map((t) => (
                <li key={skillKey(t)} className="row">
                  <div className="row-left">
                    <div className="avatar">
                      {(t.name || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t.name}</div>
                      <div className="subtle">{t.categoryName || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge">
                      {t.creditsPerHour ?? "n/a"} cr/hr
                    </span>
                    {!t.isActive && <span className="badge-soft">inactive</span>}
                    <button
                      className="btn-ghost"
                      disabled={busy}
                      onClick={() => removeTeach(t)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Skills to Learn */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Skills to Learn</h3>
        </div>
        <div className="card-content">
          {learn.length === 0 ? (
            <div className="subtle">No learning skills yet.</div>
          ) : (
            <ul className="list">
              {learn.map((l) => (
                <li key={skillKey(l)} className="row">
                  <div className="row-left">
                    <div className="avatar">
                      {(l.name || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{l.name}</div>
                      <div className="subtle">{l.categoryName || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {l.since && (
                      <span className="badge-soft">
                        since {l.since.toLocaleDateString()}
                      </span>
                    )}
                    <button
                      className="btn-ghost"
                      disabled={busy}
                      onClick={() => removeLearn(l)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {!!msg && <div className="success">{msg}</div>}
    </div>
  );
}
