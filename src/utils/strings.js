export function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function makeSafeRx(q) {
  const t = String(q || "").trim();
  if (!t) return null;
  try {
    return new RegExp(escapeRegex(t), "i");
  } catch {
    return null;
  }
}
