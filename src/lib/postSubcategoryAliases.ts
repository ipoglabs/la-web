/**
 * lib/postSubcategoryAliases.ts
 *
 * Real Post.subcategory values seen in the DB that don't match any current
 * canonical id or display label in SUBCATEGORY_LABELS (lib/category-map.ts) —
 * either because the post was written by a flow that predates a taxonomy
 * rename, or because the posting wizard's own category picker (still) uses
 * different wording than the landing/alert taxonomy for the same thing (see
 * "Car" vs "Cars": src/static/data.ts's Vehicles item is still singular).
 *
 * Consumed by both:
 *   - app/api/listings/[category]/route.ts, to fold these legacy/alternate
 *     raw strings back onto the right subcategory id for the facet counts
 *     AND the actual $in match when a user filters by that subcategory
 *   - lib/jobs/_utils.ts's findAlertMatches(), so an alert watching a
 *     subcategory still fires for a real post written with the old wording
 * — so real posts written with legacy wording stay filterable AND keep
 * triggering alert notifications instead of silently disappearing from both.
 *
 * Add an entry here (lowercase key) whenever a filter/count/alert-match
 * drops real posts because their stored subcategory doesn't match the
 * current taxonomy.
 */
export const LEGACY_SUBCATEGORY_ALIASES: Record<string, Record<string, string>> = {
  vehicles: {
    car: "cars",         // Post journey stores the singular "Car" (data.ts item name)
    bikes: "motorcycle", // pre-taxonomy label for motorcycles/two-wheelers
  },
};

/** Case-insensitive exact-match regex — real stored casing varies ("Car", "car", ...). */
export function exactCaseInsensitive(value: string): RegExp {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}
