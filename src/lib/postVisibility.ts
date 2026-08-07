/**
 * The single filter every public-facing read path must apply to `Post` so
 * pending/rejected/suspended ads never leak into listings, search, or
 * detail pages. Spread into a query object rather than imported as a
 * constant reference, since callers merge it with their own category/
 * country clauses.
 */
export function publicPostFilter(): Record<string, unknown> {
  return {
    status: "active",
    isSuspended: { $ne: true },
  };
}
