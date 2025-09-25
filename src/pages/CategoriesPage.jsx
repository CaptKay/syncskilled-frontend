// src/pages/CategoriesPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Catalog } from "../api";
import toast from "react-hot-toast";

const DEBOUNCE_MS = 300;

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const qParam = params.get("q") ?? "";

  // local controlled input tied to ?q=…
  const [q, setQ] = useState(qParam);
  useEffect(() => {
    // keep input in sync if user navigates back/forward
    setQ(qParam);
  }, [qParam]);

  // fetch with debounce + abort when qParam changes
  const abortRef = useRef(null);
  useEffect(() => {
    setBusy(true);
    setError("");

    // debounce timer
    const t = setTimeout(async () => {
      // cancel previous request, if any
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const data = await Catalog.categories(
          { q: qParam || undefined, active: true, limit: 100 },
          { signal: ac.signal } // (api wrapper ignores extra config; this is future-proof)
        );
        setItems(data.items || data || []);
      } catch (e) {
        if (e?.name !== "CanceledError" && e?.name !== "AbortError") {
          setError("Failed to load categories");
          toast.error("Failed to load categories");
        }
      } finally {
        setBusy(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(t);
      // don’t abort here—only abort when new request starts
    };
  }, [qParam]);

  // live update URL param as user types
  function onChange(e) {
    const next = e.target.value;
    setQ(next);
    const sp = new URLSearchParams(params);
    if (next.trim()) sp.set("q", next.trim());
    else sp.delete("q");
    setParams(sp, { replace: true });
  }

  function onClear() {
    setQ("");
    const sp = new URLSearchParams(params);
    sp.delete("q");
    setParams(sp, { replace: true });
  }

  const filtered = useMemo(() => {
    // server already filters by q; this is a tiny client-side guard
    if (!qParam) return items;
    const rx = new RegExp(qParam, "i");
    return items.filter((c) => rx.test(c.name || ""));
  }, [items, qParam]);

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Browse Categories</h3>
        </div>
        <div className="card-content grid gap-3">
          <div className="field-row">
            <label htmlFor="q" className="label">Search</label>
            <div className="flex items-center gap-2">
              <input
                id="q"
                name="q"
                type="text"
                className="input"
                placeholder="Search categories..."
                value={q}
                onChange={onChange}
                autoComplete="off"
              />
              {q && (
                <button className="btn-ghost" onClick={onClear} aria-label="Clear search">
                  Clear
                </button>
              )}
            </div>
            <div className="subtle">
              {busy ? "Searching…" : (qParam ? `Results for “${qParam}”` : "All categories")}
            </div>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {busy && filtered.length === 0 && <div className="subtle">Loading…</div>}
        {!busy && filtered.length === 0 && <div className="subtle">No categories found.</div>}

        <ul className="list">
          {filtered.map((c) => (
            <li key={c._id || c.slug} className="row">
              <div className="row-left">
                <div className="avatar">{(c.name || "?").slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  {c.description && <div className="subtle">{c.description}</div>}
                </div>
              </div>
              <Link className="btn-outline" to={`/catalog/${c.slug || c._id}`}>
                View skills
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
