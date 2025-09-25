import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Catalog } from "../api";

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const q = params.get("q") || "";

  useEffect(() => {
    (async () => {
      setBusy(true);
      try {
        const data = await Catalog.categories({ q, active: true, limit: 100 });
        setItems(data.items || data || []);
      } finally {
        setBusy(false);
      }
    })();
  }, [q]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const rx = new RegExp(q, "i");
    return items.filter((c) => rx.test(c.name));
  }, [items, q]);

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const search = fd.get("q")?.toString().trim() || "";
    const next = new URLSearchParams(params);
    if (search) next.set("q", search);
    else next.delete("q");
    setParams(next);
  }

  return (
    <div className="grid gap-6">
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Browse Categories</h3>
            </div>
            <div className="card-content">
                <form onSubmit={onSubmit} className="form">
                    <div className="field-row">
                        <label htmlFor="q" className="label">Search</label>
                        <input id="q" name="q" type="text" className="input" defaultValue={q} placeholder="Search categories..." />
                    </div>
                    <div>
                        <button className="btn-primary" disabled={busy}>Search</button>
                    </div>
                </form>
            </div>
        </div>

        <div className="grid gap-3">
        {busy && <div className="subtle">Loading...</div>}
        {!busy && filtered.length === 0 && <div className="subtle">No categories found.</div>}
        <ul className="list">
            {filtered.map((c)=>(
                <li key={c._id || c.slug} className="row">
                    <div className="row-left">
                        <div className="avatar">{(c.name || "?").slice(0,2).toUpperCase()}</div>
                        <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        {c.description && <div className="subtle">{c.description}</div>}
                    </div>
                    </div>
                    <Link className="btn-outline" to={`/catalog/${c.slug || c._id}`}>View SKills</Link>
                </li>
            ))}
        </ul>
    </div>
    </div>

    
  );
}
