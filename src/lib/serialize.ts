// src/lib/serialize.ts
export type Plain<T> = T & { id: string; createdAt?: string | null; updatedAt?: string | null };

export function toClientPost(d: any) {
  if (!d) return null;

  // if it’s a Mongoose doc, lean first (callers should already use .lean())
  const obj = JSON.parse(JSON.stringify(d)); // strips ObjectId/Date to strings

  // normalize ids & dates
  obj.id = String(d._id ?? obj._id);
  delete obj._id;

  if (d.ownerId != null) obj.ownerId = String(d.ownerId);
  if (d.createdAt != null) obj.createdAt = new Date(d.createdAt).toISOString();
  if (d.updatedAt != null) obj.updatedAt = new Date(d.updatedAt).toISOString();

  // (Optional) ensure nested fields you know could contain ObjectIds are strings

  return obj as Plain<typeof obj>;
}
