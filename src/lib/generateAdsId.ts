import Counter from "@/models/counter";

export async function generateAdsId(): Promise<string> {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "postAdsId" }, // 🔥 sequence name
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = counter.seq;

  // ADS-0001 format
  return `ADS-${String(seq).padStart(4, "0")}`;
}