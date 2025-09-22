// Normalize a "teach" entry coming from either shape:
// A) { skillId: { _id, name, slug, category }, creditsPerHour, isActive }
// B) { skill: { id/_id, name, slug, category }, creditsPerHour, isActive }
export function normalizeTeach(entry) {
  if (!entry) return null;

  const skillObj = entry.skill || entry.skillId || null;
  const id = skillObj?._id || skillObj?.id || null;

  const cat = skillObj?.category || null;
  const catId = cat?._id || cat?.id || null;

  return {
    id: id ? String(id) : null,
    name: skillObj?.name || "",
    slug: skillObj?.slug || "",
    category: cat
      ? { id: catId ? String(catId) : null, name: cat?.name || "", slug: cat?.slug || "" }
      : null,
    creditsPerHour: entry.creditsPerHour ?? null,
    isActive: entry.isActive ?? true,
  };
}

// Normalize a "learn" entry:
// A) { skillId: {...}, interestedSince }
// B) { skill: {...}, interestedSince }
export function normalizeLearn(entry) {
  if (!entry) return null;

  const skillObj = entry.skill || entry.skillId || null;
  const id = skillObj?._id || skillObj?.id || null;

  const cat = skillObj?.category || null;
  const catId = cat?._id || cat?.id || null;

  return {
    id: id ? String(id) : null,
    name: skillObj?.name || "",
    slug: skillObj?.slug || "",
    category: cat
      ? { id: catId ? String(catId) : null, name: cat?.name || "", slug: cat?.slug || "" }
      : null,
    interestedSince: entry.interestedSince || null,
  };
}
