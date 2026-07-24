import Post from "@/models/post";

/**
 * Generates a unique adsId for a new Post document.
 * Post.adsId has a unique index but no fixed format, so this produces a
 * short random alphanumeric-free numeric code and retries on collision
 * (extremely unlikely past 1-2 tries at any realistic listing volume).
 *
 * Usage: const adsId = await generateAdsId();
 */
export async function generateAdsId(length = 8): Promise<string> {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const existing = await Post.findOne({ adsId: candidate }).select("_id").lean();
    if (!existing) return candidate;
  }

  throw new Error("Failed to generate a unique adsId after several attempts.");
}