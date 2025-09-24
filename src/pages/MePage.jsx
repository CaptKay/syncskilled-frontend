import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Auth } from "../api";
import toast from "react-hot-toast";

export default function MePage() {
  const { user, setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Always grab a fresh /me when arriving (populates relations)
  useEffect(() => {
    (async () => {
      try {
        const d = await Auth.me();
        setUser(d.user);
      } catch {
        // ProtectedRoute + onUnauthenticated() will handle redirect if needed
      }
    })();
  }, [setUser]);

  // Normalize teach/learn arrays to a UI-friendly shape
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

  // Prefer slug for DELETE endpoints; fall back to id
  const skillKey = (row) => row.slug || row.id;

  // ---- Optimistic helpers (use closure setUser) ----
  function optimisticallyRemoveTeach(row) {
    const key = skillKey(row);
    setUser((prev) => {
      if (!prev) return prev;
      const nextTeach = (prev.skillsToTeach || []).filter((t) => {
        const tId   = t?.skillId?._id || String(t?.skillId || "");
        const tSlug = t?.skillId?.slug;
        return (tSlug || tId) !== key;
      });
      return { ...prev, skillsToTeach: nextTeach };
    });
  }

  function optimisticallyRemoveLearn(row) {
    const key = skillKey(row);
    setUser((prev) => {
      if (!prev) return prev;
      const nextLearn = (prev.skillsToLearn || []).filter((l) => {
        const lId   = l?.skillId?._id || String(l?.skillId || ""); // fixed from `skilled`
        const lSlug = l?.skillId?.slug;
        return (lSlug || lId) !== key;
      });
      return { ...prev, skillsToLearn: nextLearn };
    });
  }

  async function safeRefetchMe() {
    try {
      const d = await Auth.me();
      setUser(d.user);
    } catch (error) {
      // keep optimistic UI if refetch fails (e.g., transient 401)
      console.warn("Soft refetch /me failed; keeping optimistic UI.", error);
    }
  }

  // ---- Event handlers ----
  async function removeTeach(row) {
    if (busy) return;
    setBusy(true);
    setMsg("");

    // optimistic UI first
    optimisticallyRemoveTeach(row);

    try {
      await Auth.removeTeach(skillKey(row));     // DELETE /me/teach/:idOrSlug
      setMsg(`Removed "${row.name}" from teaching.`);
      toast.success(`Removed "${row.name} from teaching."`)
    } catch (error) {
      setMsg(error?.response?.data?.error || "Failed to remove teaching skill.");
      toast.error(error?.response?.data?.error || "Failed to remove teaching skill.")
      await safeRefetchMe();                     // rollback via authoritative state
      setBusy(false);
      return;
    }

    await safeRefetchMe();                       // soft sync (don’t fail UX on error)
    setBusy(false);
  }

  async function removeLearn(row) {
    if (busy) return;
    setBusy(true);
    setMsg("");

    optimisticallyRemoveLearn(row);

    try {
      await Auth.removeLearn(skillKey(row));     // DELETE /me/learn/:idOrSlug
      setMsg(`Removed "${row.name}" from learning.`);
      toast.success(`Removed "${row.name}" from learning.`)
    } catch (error) {
      setMsg(error?.response?.data?.error || "Failed to remove learning skill.");
      toast.error(error?.response?.data?.error || "Failed to remove learning skill.")
      await safeRefetchMe();
      setBusy(false);
      return;
    }

    await safeRefetchMe();
    setBusy(false);
  }

  if (!user) return null; // ProtectedRoute will redirect if unauthenticated

  return (
    <div className="grid gap-6">
      {/* Profile summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Profile</h3>
        </div>
        <div className="card-content grid gap-3">
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
          <div><strong>Credits:</strong> {user.credits}</div>
          {user.bio && (
            <div>
              <div className="label">Bio</div>
              <p className="subtle">{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Teach list */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Skills to Teach</h3></div>
        <div className="card-content">
          {teach.length === 0 ? (
            <div className="subtle">No teaching skills yet.</div>
          ) : (
            <ul className="list">
              {teach.map((t) => (
                <li key={skillKey(t)} className="row">
                  <div className="row-left">
                    <div className="avatar">{(t.name || "?").slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{t.name}</div>
                      <div className="subtle">{t.categoryName || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge">{t.creditsPerHour ?? "n/a"} cr/hr</span>
                    {!t.isActive && <span className="badge-soft">inactive</span>}
                    <button className="btn-ghost" disabled={busy} onClick={() => removeTeach(t)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Learn list */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Skills to Learn</h3></div>
        <div className="card-content">
          {learn.length === 0 ? (
            <div className="subtle">No learning skills yet.</div>
          ) : (
            <ul className="list">
              {learn.map((l) => (
                <li key={skillKey(l)} className="row">
                  <div className="row-left">
                    <div className="avatar">{(l.name || "?").slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{l.name}</div>
                      <div className="subtle">{l.categoryName || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {l.since && <span className="badge-soft">since {l.since.toLocaleDateString()}</span>}
                    <button className="btn-ghost" disabled={busy} onClick={() => removeLearn(l)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* {!!msg && <div className="success">{msg}</div>} */}
    </div>
  );
}
