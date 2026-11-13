/**
 * lib/postSearchQuery.ts
 *
 * Builds the Mongo query clause for the listings search bar's free-text `q`
 * param — case-insensitive substring match against a Post's title (`name`)
 * and `description`. No text index required at this data volume; same
 * case-insensitive-substring convention as lib/postFilterQuery.ts's filter
 * matching and lib/mock/country-map.ts's keyword filtering for mock data.
 *
 * Returns null for an empty/whitespace-only keyword so callers can skip
 * merging an empty clause into their query.
 */

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildKeywordQuery(q: string | null | undefined): Record<string, unknown> | null {
  // Every word must appear somewhere in the title or description, in any
  // order — matching the whole phrase as one substring missed "Childcare &
  // Nurseries" for "childcare nurseries" and "Red mountain bike" for "red bike".
  const words = (q ?? "")
    .split(/[\s&,/+]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!words.length) return null;
  const clauses = words.map((w) => {
    const pattern = new RegExp(escapeRegex(w), "i");
    return { $or: [{ name: pattern }, { description: pattern }] };
  });
  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

/**
 * Free-text city/area match for the "browse by location" flow (footer's
 * Top Locations, LocationPicker picks with no category) — case-insensitive
 * substring against Post's `location.address`, same convention as
 * lib/mock/country-map.ts's getListingsForCity() locationLabel matching.
 * No `$or` of its own, so it's always safe to spread into a query alongside
 * buildKeywordQuery's clause.
 */
export function buildLocationQuery(loc: string | null | undefined): Record<string, unknown> | null {
  const trimmed = loc?.trim();
  if (!trimmed) return null;
  const pattern = new RegExp(escapeRegex(trimmed), "i");
  return { "location.address": pattern };
}
