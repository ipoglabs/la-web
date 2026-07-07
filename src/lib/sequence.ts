import Counter from "@/models/counter";

/**
 * Generates next incrementing userId: "000000000001"
 * Atomic even under concurrency (safe for multiple registrations at same time).
 */
export async function getNextUserId(pad = 12) {
  const doc = await Counter.findByIdAndUpdate(
    "user", // sequence name
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();

  const n = doc?.seq ?? 1;
  return String(n).padStart(pad, "0");
}
