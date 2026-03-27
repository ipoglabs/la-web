import Counter from "@/models/counter";

export async function generateAdsId(countryCode?: string): Promise<string> {
  // ✅ normalize & fallback
  const code = (countryCode || "GLB").toUpperCase();

  // ✅ atomic increment (safe for concurrency)
  const counter = await Counter.findOneAndUpdate(
    { _id: `postAdsId-${code}` }, // ⭐ per-country sequence
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  // ✅ safety fallback (edge case)
  const seq = counter?.seq ?? 1;

  return `${code}-${String(seq).padStart(8, "0")}`;
}