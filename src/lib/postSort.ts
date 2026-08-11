/**
 * Maps a listings page `sort` URL param to a Mongo sort spec for Post.
 * Shared by /api/listings/[category], /api/listings (category-less browse),
 * and getFeaturedListings.ts so "Top Picks" means the same ranking
 * everywhere it's shown.
 *
 * Only newest/oldest/top-picks are backed by a real Post field today —
 * relevance and price_asc/price_desc fall back to newest since there's no
 * relevance score or a canonical numeric price field shared across every
 * category yet (property/vehicles use rentPrice/salePrice, most other
 * categories have no price field at all).
 */
export function resolvePostSort(sort: string | null): Record<string, 1 | -1> {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "top-picks":
      // Mirrors the previous "Top Picks" placeholder ranking: most recently
      // bumped/boosted listings. TODO: replace with a real quality signal
      // (seller rating, view count, manual editorial flag) once defined.
      return { lastBumpedAt: -1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}
