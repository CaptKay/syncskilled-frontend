// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../auth/AuthContext";
// import { Auth } from "../api";
// import toast from "react-hot-toast";

// export default function MePage() {
//   const { user, setUser } = useAuth();
//   const [busy, setBusy] = useState(false);

//   // Always grab a fresh /me when arriving (populates relations)
//   useEffect(() => {
//     (async () => {
//       try {
//         const d = await Auth.me();
//         setUser(d.user);
//       } catch {
//         // ProtectedRoute + onUnauthenticated() will handle redirect if needed
//       }
//     })();
//   }, [setUser]);

//   // Normalize teach/learn arrays to a UI-friendly shape
//   const teach = useMemo(() => {
//     return (user?.skillsToTeach || []).map((t) => ({
//       id: t?.skillId?._id || String(t?.skillId || ""),
//       slug: t?.skillId?.slug,
//       name: t?.skillId?.name || "(Unknown skill)",
//       categoryName: t?.skillId?.category?.name || "",
//       creditsPerHour: t?.creditsPerHour ?? null,
//       isActive: !!t?.isActive,
//     }));
//   }, [user]);

//   const learn = useMemo(() => {
//     return (user?.skillsToLearn || []).map((l) => ({
//       id: l?.skillId?._id || String(l?.skillId || ""),
//       slug: l?.skillId?.slug,
//       name: l?.skillId?.name || "(Unknown skill)",
//       categoryName: l?.skillId?.category?.name || "",
//       since: l?.interestedSince ? new Date(l.interestedSince) : null,
//     }));
//   }, [user]);

//   // Prefer slug for DELETE endpoints; fall back to id
//   const skillKey = (row) => row.slug || row.id;

//   // ---- Optimistic helpers (use closure setUser) ----
//   function optimisticallyRemoveTeach(row) {
//     const key = skillKey(row);
//     setUser((prev) => {
//       if (!prev) return prev;
//       const nextTeach = (prev.skillsToTeach || []).filter((t) => {
//         const tId   = t?.skillId?._id || String(t?.skillId || "");
//         const tSlug = t?.skillId?.slug;
//         return (tSlug || tId) !== key;
//       });
//       return { ...prev, skillsToTeach: nextTeach };
//     });
//   }

//   function optimisticallyRemoveLearn(row) {
//     const key = skillKey(row);
//     setUser((prev) => {
//       if (!prev) return prev;
//       const nextLearn = (prev.skillsToLearn || []).filter((l) => {
//         const lId   = l?.skillId?._id || String(l?.skillId || "");
//         const lSlug = l?.skillId?.slug;
//         return (lSlug || lId) !== key;
//       });
//       return { ...prev, skillsToLearn: nextLearn };
//     });
//   }

//   async function safeRefetchMe() {
//     try {
//       const d = await Auth.me();
//       setUser(d.user);
//     } catch (error) {
//       // keep optimistic UI if refetch fails (e.g., transient 401)
//       console.warn("Soft refetch /me failed; keeping optimistic UI.", error);
//     }
//   }

//   // ---- Event handlers ----
//   async function removeTeach(row) {
//     if (busy) return;
//     setBusy(true);

//     // optimistic UI first
//     optimisticallyRemoveTeach(row);

//     try {
//       await Auth.removeTeach(skillKey(row));     // DELETE /me/teach/:idOrSlug
//       toast.success(`Removed "${row.name}" from teaching.`);
//     } catch (error) {
//       toast.error(error?.response?.data?.error || "Failed to remove teaching skill.");
//       await safeRefetchMe();                     // rollback via authoritative state
//       setBusy(false);
//       return;
//     }

//     await safeRefetchMe();                       // soft sync (don’t fail UX on error)
//     setBusy(false);
//   }

//   async function removeLearn(row) {
//     if (busy) return;
//     setBusy(true);

//     optimisticallyRemoveLearn(row);

//     try {
//       await Auth.removeLearn(skillKey(row));     // DELETE /me/learn/:idOrSlug
//       toast.success(`Removed "${row.name}" from learning.`);
//     } catch (error) {
//       toast.error(error?.response?.data?.error || "Failed to remove learning skill.");
//       await safeRefetchMe();
//       setBusy(false);
//       return;
//     }

//     await safeRefetchMe();
//     setBusy(false);
//   }

//   if (!user) return null; // ProtectedRoute will redirect if unauthenticated

//   return (
//     <div className="grid gap-6">
//       {/* Profile summary */}
//       <div className="card">
//         <div className="card-header">
//           <h3 className="card-title">My Profile</h3>
//         </div>
//         <div className="card-content grid gap-3">
//           <div className="flex items-center gap-4">
//             <img
//               src={user.profilePhoto || "https://via.placeholder.com/80x80.png?text=?"}
//               alt={user.name}
//               className="w-20 h-20 rounded-full border object-cover"
//             />
//             <div>
//               <div className="text-lg font-bold text-gray-900">{user.name}</div>
//               <div className="subtle">@{user.username}</div>
//               <div className="subtle">{user.email}</div>
//             </div>
//           </div>
//           <div><strong>Credits:</strong> {user.credits}</div>
//           {user.bio && (
//             <div>
//               <div className="label">Bio</div>
//               <p className="subtle">{user.bio}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Teach list */}
//       <div className="card">
//         <div className="card-header"><h3 className="card-title">Skills to Teach</h3></div>
//         <div className="card-content">
//           {teach.length === 0 ? (
//             <div className="subtle">No teaching skills yet.</div>
//           ) : (
//             <ul className="list">
//               {teach.map((t) => (
//                 <li key={skillKey(t)} className="row">
//                   <div className="row-left">
//                     <div className="avatar">{(t.name || "?").slice(0, 2).toUpperCase()}</div>
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{t.name}</div>
//                       <div className="subtle">{t.categoryName || "—"}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="badge">{t.creditsPerHour ?? "n/a"} cr/hr</span>
//                     {!t.isActive && <span className="badge-soft">inactive</span>}
//                     <button className="btn-ghost" disabled={busy} onClick={() => removeTeach(t)}>Remove</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Learn list */}
//       <div className="card">
//         <div className="card-header"><h3 className="card-title">Skills to Learn</h3></div>
//         <div className="card-content">
//           {learn.length === 0 ? (
//             <div className="subtle">No learning skills yet.</div>
//           ) : (
//             <ul className="list">
//               {learn.map((l) => (
//                 <li key={skillKey(l)} className="row">
//                   <div className="row-left">
//                     <div className="avatar">{(l.name || "?").slice(0, 2).toUpperCase()}</div>
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{l.name}</div>
//                       <div className="subtle">{l.categoryName || "—"}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     {l.since && <span className="badge-soft">since {l.since.toLocaleDateString()}</span>}
//                     <button className="btn-ghost" disabled={busy} onClick={() => removeLearn(l)}>Remove</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//========================================================================================================================================================================================

// src/pages/MePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Auth } from "../api";
import toast from "react-hot-toast";

export default function MePage() {
  const { user, setUser } = useAuth();

  // busy flags
  const [busy, setBusy] = useState(false);   // for list remove actions
  const [pBusy, setPBusy] = useState(false); // save profile
  const [pwBusy, setPwBusy] = useState(false); // change password

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

  // --------- Profile form state (seeded from user) ----------
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePhoto: user?.profilePhoto || "",
    location: user?.location || "",
  });

  useEffect(() => {
    // Keep form synced when user changes (e.g., after /me refresh)
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePhoto: user?.profilePhoto || "",
      location: user?.location || "",
    });
  }, [user]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSaveProfile(e) {
    e.preventDefault();
    if (pBusy) return;
    setPBusy(true);
    try {
      // send only fields that make sense; backend trims/validates
      const payload = {
        ...(form.name && { name: form.name }),
        ...(form.username && { username: form.username }),
        ...(form.email && { email: form.email }),
        ...(form.bio !== undefined && { bio: form.bio }),
        ...(form.profilePhoto && { profilePhoto: form.profilePhoto }),
        ...(form.location && { location: form.location }),
      };
      const { user: updated } = await Auth.updateProfile(payload);
      toast.success("Profile updated");

      // Fetch authoritative /me (ensures populated relations + server state)
      const fresh = await Auth.me();
      setUser(fresh.user);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to update profile");
    } finally {
      setPBusy(false);
    }
  }

  async function onChangePassword(e) {
    e.preventDefault();
    if (pwBusy) return;
    const fd = new FormData(e.currentTarget);
    const oldPassword = String(fd.get("oldPassword") || "");
    const newPassword = String(fd.get("newPassword") || "");
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPwBusy(true);
    try {
      await Auth.changePassword({ oldPassword, newPassword });
      e.currentTarget.reset();
      toast.success("Password changed");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to change password");
    } finally {
      setPwBusy(false);
    }
  }

  // --------- Normalize teach/learn arrays to UI shape ----------
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
        const tId = t?.skillId?._id || String(t?.skillId || "");
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
        const lId = l?.skillId?._id || String(l?.skillId || "");
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

  // ---- Event handlers (remove teach/learn) ----
  async function removeTeach(row) {
    if (busy) return;
    setBusy(true);

    optimisticallyRemoveTeach(row);

    try {
      await Auth.removeTeach(skillKey(row)); // DELETE /me/teach/:idOrSlug
      toast.success(`Removed "${row.name}" from teaching.`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to remove teaching skill.");
      await safeRefetchMe(); // rollback state
      setBusy(false);
      return;
    }

    await safeRefetchMe();
    setBusy(false);
  }

  async function removeLearn(row) {
    if (busy) return;
    setBusy(true);

    optimisticallyRemoveLearn(row);

    try {
      await Auth.removeLearn(skillKey(row)); // DELETE /me/learn/:idOrSlug
      toast.success(`Removed "${row.name}" from learning.`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to remove learning skill.");
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

      {/* Edit Profile */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Edit Profile</h3>
        </div>
        <div className="card-content">
          <form className="form" onSubmit={onSaveProfile}>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="field-row">
                <label htmlFor="name" className="label">Name</label>
                <input id="name" name="name" type="text" className="input"
                       value={form.name} onChange={onChange} />
              </div>

              <div className="field-row">
                <label htmlFor="username" className="label">Username</label>
                <input id="username" name="username" type="text" className="input"
                       value={form.username} onChange={onChange} />
              </div>

              <div className="field-row">
                <label htmlFor="email" className="label">Email</label>
                <input id="email" name="email" type="email" className="input"
                       value={form.email} onChange={onChange} />
              </div>

              <div className="field-row">
                <label htmlFor="location" className="label">Location</label>
                <input id="location" name="location" type="text" className="input"
                       value={form.location} onChange={onChange} />
              </div>

              <div className="field-row md:col-span-2">
                <label htmlFor="profilePhoto" className="label">Profile photo URL</label>
                <input id="profilePhoto" name="profilePhoto" type="url" className="input"
                       value={form.profilePhoto} onChange={onChange} />
              </div>

              <div className="field-row md:col-span-2">
                <label htmlFor="bio" className="label">Bio</label>
                <textarea id="bio" name="bio" rows={3} className="input"
                          value={form.bio} onChange={onChange} />
              </div>
            </div>

            <div>
              <button className="btn-primary" disabled={pBusy}>
                {pBusy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Change Password</h3>
        </div>
        <div className="card-content">
          <form className="form" onSubmit={onChangePassword}>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="field-row">
                <label htmlFor="oldPassword" className="label">Current password</label>
                <input id="oldPassword" name="oldPassword" type="password" className="input" />
              </div>
              <div className="field-row">
                <label htmlFor="newPassword" className="label">New password</label>
                <input id="newPassword" name="newPassword" type="password" className="input" />
              </div>
            </div>
            <div>
              <button className="btn-outline" disabled={pwBusy}>
                {pwBusy ? "Changing…" : "Change password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
