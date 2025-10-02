import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Catalog } from "../api";
import toast from "react-hot-toast";
import { makeSafeRx } from "../utils/strings"; // 👈 use your helper

const DEBOUNCE_MS = 300;

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false); //loading
  const [error, setError] = useState("");
  const qParam = params.get("q") ?? "";

  const [q, setQ] = useState(qParam);
  useEffect(() => { setQ(qParam); }, [qParam]);

  const abortRef = useRef(null);
  useEffect(() => {
    setBusy(true);
    setError("");

    const t = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const data = await Catalog.categories(
          { q: qParam || undefined, active: true, limit: 100 },
          { signal: ac.signal } // ok if wrapper ignores it
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

    return () => clearTimeout(t);
  }, [qParam]);

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

  // 👇 SAFE filtering (no crash on special chars)
  const filtered = useMemo(() => {
    if (!qParam) return items;
    const rx = makeSafeRx(qParam);
    if (!rx) return items;
    return items.filter((c) => rx.test(c?.name || ""));
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
                id="q" name="q" type="text" className="input"
                placeholder="Search categories..." value={q}
                onChange={onChange} autoComplete="off"
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
