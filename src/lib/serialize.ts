// src/lib/serialize.ts

export type Plain<T> = T & {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastBumpedAt?: string | null; // ✅ added
};

export function toClientPost(d: any) {
  if (!d) return null;

  // strip ObjectId / Date via JSON (safe because caller uses .lean())
  const obj = JSON.parse(JSON.stringify(d));

  // normalize id
  obj.id = String(d._id ?? obj._id);
  delete obj._id;

  // normalize ownerId
  if (d.ownerId != null) obj.ownerId = String(d.ownerId);

  // normalize dates
  if (d.createdAt != null)
    obj.createdAt = new Date(d.createdAt).toISOString();

  if (d.updatedAt != null)
    obj.updatedAt = new Date(d.updatedAt).toISOString();

  // ✅ normalize bump date (THIS IS IMPORTANT)
  if (d.lastBumpedAt != null)
    obj.lastBumpedAt = new Date(d.lastBumpedAt).toISOString();
  else
    obj.lastBumpedAt = null;

  return obj as Plain<typeof obj>;
}
