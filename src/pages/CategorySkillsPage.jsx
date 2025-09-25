// src/pages/CategorySkillsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Catalog, Auth } from "../api";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function CategorySkillsPage() {
  const { idOrSlug } = useParams();
  const { refreshUser } = useAuth();

  const [category, setCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [busyKey, setBusyKey] = useState(null); // which skill is acting

  // Load skills for this category (by id or slug)
  useEffect(() => {
    (async () => {
      try {
        const data = await Catalog.categorySkills(idOrSlug, {
          active: true,
          limit: 100,
        });
        setSkills(data.items || data || []);
        // placeholder until we resolve real name:
        setCategory((prev) => prev ?? { name: "Category", slug: idOrSlug });
      } catch (error) {
        console.error("Failed to load skills.", error);
        toast.error("Failed to load skills.");
      }
    })();
  }, [idOrSlug]);

  // 🔹 Best-effort: fetch all categories, find the one matching idOrSlug, and show its name
  useEffect(() => {
    (async () => {
      try {
        const all = await Catalog.categories({ active: true, limit: 200 });
        const list = all.items || all || [];
        const found = list.find(
          (c) => c.slug === idOrSlug || c._id === idOrSlug
        );
        if (found) setCategory(found);
      } catch {
        // ignore; we already have a placeholder
      }
    })();
  }, [idOrSlug]);

  const skillKey = (s) => s.slug || s._id;

  async function addTeach(skill) {
    if (busyKey) return;
    const key = skillKey(skill);
    setBusyKey(key);
    try {
      // omit creditsPerHour → backend uses skill.defaultCreditsPerHour
      await Auth.addTeach({ skill: key });
      toast.success(`Added "${skill.name}" to Teach.`);
      await refreshUser();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to add to Teach.");
    } finally {
      setBusyKey(null);
    }
  }

  async function addLearn(skill) {
    if (busyKey) return;
    const key = skillKey(skill);
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
          <Link to="/catalog" className="btn-ghost">
            ← Back
          </Link>
        </div>

        <div className="card-content">
          {skills.length === 0 ? (
            <div className="subtle">No skills found.</div>
          ) : (
            <ul className="list">
              {skills.map((s) => {
                const key = skillKey(s);
                const isBusy = busyKey === key;
                return (
                  <li key={key} className="row">
                    <div className="row-left">
                      <div className="avatar">
                        {(s.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {s.name}
                        </div>
                        <div className="subtle">
                          Default rate: {s.defaultCreditsPerHour ?? 0} cr/hr
                        </div>
                        {s.description && (
                          <div className="subtle">{s.description}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="btn-outline"
                        disabled={!!busyKey}
                        onClick={() => addTeach(s)}
                        aria-busy={isBusy}
                      >
                        Teach
                      </button>
                      <button
                        className="btn-primary"
                        disabled={!!busyKey}
                        onClick={() => addLearn(s)}
                        aria-busy={isBusy}
                      >
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
