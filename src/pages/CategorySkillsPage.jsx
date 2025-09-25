// import { useEffect, useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Catalog, Auth } from "../api";
// import { useAuth } from "../auth/AuthContext";
// import toast from "react-hot-toast";

// export default function CategorySkillsPage() {
//   const { idOrSlug } = useParams();
//   const { refreshUser, user } = useAuth();

//   const [category, setCategory] = useState(null);
//   const [skills, setSkills] = useState([]);
//   const [busyKey, setBusyKey] = useState(null); // which skill is acting
//   const [q, setQ] = useState("");               // local filter text
//   const [rates, setRates] = useState({});       // { [skillKey]: number|string }

//   // Load skills for this category (by id or slug)
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await Catalog.categorySkills(idOrSlug, {
//           active: true,
//           limit: 200,
//         });
//         const list = data.items || data || [];
//         setSkills(list);
//         // prefill rates with defaults
//         const nextRates = {};
//         for (const s of list) {
//           const key = s.slug || s._id;
//           nextRates[key] = s.defaultCreditsPerHour ?? 0;
//         }
//         setRates(nextRates);
//         setCategory((prev) => prev ?? { name: "Category", slug: idOrSlug });
//       } catch (error) {
//         console.error("Failed to load skills.", error);
//         toast.error("Failed to load skills.");
//       }
//     })();
//   }, [idOrSlug]);

//   // Best-effort: fetch category name
//   useEffect(() => {
//     (async () => {
//       try {
//         const all = await Catalog.categories({ active: true, limit: 200 });
//         const list = all.items || all || [];
//         const found = list.find((c) => c.slug === idOrSlug || c._id === idOrSlug);
//         if (found) setCategory(found);
//       } catch {/* ignore */}
//     })();
//   }, [idOrSlug]);

//   const skillKey = (s) => s.slug || s._id;

//   // Already added? (soft client-side guard; server is authoritative)
//   const teachSet = useMemo(() => new Set(
//     (user?.skillsToTeach || []).map(t => (t?.skillId?.slug || String(t?.skillId || "")))
//   ), [user]);
//   const learnSet = useMemo(() => new Set(
//     (user?.skillsToLearn || []).map(l => (l?.skillId?.slug || String(l?.skillId || "")))
//   ), [user]);

//   // Live filter
//   const filtered = useMemo(() => {
//     const rx = q.trim() ? new RegExp(q.trim(), "i") : null;
//     return rx ? skills.filter(s => rx.test(s.name || "")) : skills;
//   }, [skills, q]);

//   function onRateChange(key, value) {
//     // allow empty string to let user clear then type
//     if (value === "") {
//       setRates((r) => ({ ...r, [key]: "" }));
//       return;
//     }
//     const n = Number(value);
//     if (Number.isNaN(n)) return; // ignore non-numerics
//     if (n < 0 || n > 9999) return; // simple clamp rule
//     setRates((r) => ({ ...r, [key]: n }));
//   }

//   async function addTeach(skill) {
//     const key = skillKey(skill);
//     if (busyKey) return;
//     if (teachSet.has(key)) {
//       toast("You already teach this skill.", { icon: "ℹ️" });
//       return;
//     }

//     setBusyKey(key);
//     try {
//       const maybe = rates[key];
//       // Only send creditsPerHour if user typed something different from default
//       const payload =
//         maybe === undefined || maybe === skill.defaultCreditsPerHour
//           ? { skill: key }
//           : { skill: key, creditsPerHour: Number(maybe) };

//       await Auth.addTeach(payload);
//       toast.success(`Added "${skill.name}" to Teach.`);
//       await refreshUser();
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Failed to add to Teach.");
//     } finally {
//       setBusyKey(null);
//     }
//   }

//   async function addLearn(skill) {
//     const key = skillKey(skill);
//     if (busyKey) return;
//     if (learnSet.has(key)) {
//       toast("This skill is already in your Learn list.", { icon: "ℹ️" });
//       return;
//     }

//     setBusyKey(key);
//     try {
//       await Auth.addLearn({ skill: key });
//       toast.success(`Added "${skill.name}" to Learn.`);
//       await refreshUser();
//     } catch (e) {
//       toast.error(e?.response?.data?.error || "Failed to add to Learn.");
//     } finally {
//       setBusyKey(null);
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="card">
//         <div className="card-header">
//           <h3 className="card-title">{category?.name || "Skills"}</h3>
//           <Link to="/catalog" className="btn-ghost">← Back</Link>
//         </div>

//         <div className="card-content grid gap-4">
//           {/* Search box */}
//           <div className="field-row">
//             <label htmlFor="q" className="label">Search skills</label>
//             <div className="flex items-center gap-2">
//               <input
//                 id="q"
//                 name="q"
//                 type="text"
//                 className="input"
//                 placeholder="Type to filter…"
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 autoComplete="off"
//               />
//               {q && (
//                 <button className="btn-ghost" onClick={() => setQ("")}>Clear</button>
//               )}
//             </div>
//           </div>

//           {filtered.length === 0 ? (
//             <div className="subtle">No skills found.</div>
//           ) : (
//             <ul className="list">
//               {filtered.map((s) => {
//                 const key = skillKey(s);
//                 const isBusy = busyKey === key;
//                 const current = rates[key] ?? s.defaultCreditsPerHour ?? 0;
//                 return (
//                   <li key={key} className="row">
//                     <div className="row-left">
//                       <div className="avatar">{(s.name || "?").slice(0, 2).toUpperCase()}</div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{s.name}</div>
//                         {s.description && <div className="subtle">{s.description}</div>}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       {/* Rate input (optional override for Teach) */}
//                       <label htmlFor={`rate-${key}`} className="label">cr/hr</label>
//                       <input
//                         id={`rate-${key}`}
//                         type="number"
//                         min={0}
//                         max={9999}
//                         className="input w-24"
//                         value={current}
//                         onChange={(e) => onRateChange(key, e.target.value)}
//                         disabled={isBusy}
//                       />
//                       <button
//                         className="btn-outline"
//                         disabled={isBusy}
//                         onClick={() => addTeach(s)}
//                         aria-busy={isBusy}
//                       >
//                         Teach
//                       </button>
//                       <button
//                         className="btn-primary"
//                         disabled={isBusy}
//                         onClick={() => addLearn(s)}
//                         aria-busy={isBusy}
//                       >
//                         Learn
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//======================================================================================================================================

// src/pages/CategorySkillsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Catalog, Auth } from "../api";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { makeSafeRx } from "../utils/strings"; // 👈 use your helper

export default function CategorySkillsPage() {
  const { idOrSlug } = useParams();
  const { refreshUser, user } = useAuth();

  const [category, setCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [busyKey, setBusyKey] = useState(null);
  const [q, setQ] = useState("");
  const [rates, setRates] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await Catalog.categorySkills(idOrSlug, { active: true, limit: 200 });
        const list = data.items || data || [];
        setSkills(list);
        const nextRates = {};
        for (const s of list) nextRates[s.slug || s._id] = s.defaultCreditsPerHour ?? 0;
        setRates(nextRates);
        setCategory((prev) => prev ?? { name: "Category", slug: idOrSlug });
      } catch (error) {
        console.error("Failed to load skills.", error);
        toast.error("Failed to load skills.");
      }
    })();
  }, [idOrSlug]);

  useEffect(() => {
    (async () => {
      try {
        const all = await Catalog.categories({ active: true, limit: 200 });
        const list = all.items || all || [];
        const found = list.find((c) => c.slug === idOrSlug || c._id === idOrSlug);
        if (found) setCategory(found);
      } catch {}
    })();
  }, [idOrSlug]);

  const skillKey = (s) => s.slug || s._id;

  const teachSet = useMemo(
    () => new Set((user?.skillsToTeach || []).map((t) => t?.skillId?.slug || String(t?.skillId || ""))),
    [user]
  );
  const learnSet = useMemo(
    () => new Set((user?.skillsToLearn || []).map((l) => l?.skillId?.slug || String(l?.skillId || ""))),
    [user]
  );

  // 👇 SAFE filter (no crash on special chars)
  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return skills;
    const rx = makeSafeRx(t);
    if (!rx) return skills;
    return skills.filter((s) => rx.test(s?.name || ""));
  }, [skills, q]);

  function onRateChange(key, value) {
    if (value === "") { setRates((r) => ({ ...r, [key]: "" })); return; }
    const n = Number(value);
    if (Number.isNaN(n) || n < 0 || n > 9999) return;
    setRates((r) => ({ ...r, [key]: n }));
  }

  async function addTeach(skill) {
    const key = skillKey(skill);
    if (busyKey) return;
    if (teachSet.has(key)) return toast("You already teach this skill.", { icon: "ℹ️" });

    setBusyKey(key);
    try {
      const maybe = rates[key];
      const payload =
        maybe === undefined || maybe === skill.defaultCreditsPerHour
          ? { skill: key }
          : { skill: key, creditsPerHour: Number(maybe) };
      await Auth.addTeach(payload);
      toast.success(`Added "${skill.name}" to Teach.`);
      await refreshUser();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to add to Teach.");
    } finally {
      setBusyKey(null);
    }
  }

  async function addLearn(skill) {
    const key = skillKey(skill);
    if (busyKey) return;
    if (learnSet.has(key)) return toast("This skill is already in your Learn list.", { icon: "ℹ️" });

    setBusyKey(key);
    try {
      await Auth.addLearn({ skill: key });
      toast.success(`Added "${skill.name}" to Learn.`);
      await refreshUser();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to add to Learn.");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{category?.name || "Skills"}</h3>
          <Link to="/catalog" className="btn-ghost">← Back</Link>
        </div>

        <div className="card-content grid gap-4">
          <div className="field-row">
            <label htmlFor="q" className="label">Search skills</label>
            <div className="flex items-center gap-2">
              <input
                id="q" name="q" type="text" className="input"
                placeholder="Type to filter…" value={q}
                onChange={(e) => setQ(e.target.value)} autoComplete="off"
              />
              {q && <button className="btn-ghost" onClick={() => setQ("")}>Clear</button>}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="subtle">No skills found.</div>
          ) : (
            <ul className="list">
              {filtered.map((s) => {
                const key = skillKey(s);
                const isBusy = busyKey === key;
                const current = rates[key] ?? s.defaultCreditsPerHour ?? 0;
                return (
                  <li key={key} className="row">
                    <div className="row-left">
                      <div className="avatar">{(s.name || "?").slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{s.name}</div>
                        {s.description && <div className="subtle">{s.description}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label htmlFor={`rate-${key}`} className="label">cr/hr</label>
                      <input
                        id={`rate-${key}`} type="number" min={0} max={9999}
                        className="input w-24" value={current}
                        onChange={(e) => onRateChange(key, e.target.value)}
                        disabled={isBusy}
                      />
                      <button className="btn-outline" disabled={isBusy} onClick={() => addTeach(s)} aria-busy={isBusy}>
                        Teach
                      </button>
                      <button className="btn-primary" disabled={isBusy} onClick={() => addLearn(s)} aria-busy={isBusy}>
                        Learn
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
