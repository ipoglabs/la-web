/**
 * config/categories/types.ts
 *
 * Simple type definitions for the global category + subcategory list.
 * This is the ONE SOURCE OF TRUTH for category navigation across:
 *   - Landing page category grid
 *   - Design system demos
 *   - Create Alert journey (category/sub selection step)
 *   - Any future consumer
 *
 * NO filters live here. Filters belong to their own feature folders:
 *   - components/create-alert/config/  (alert filters)
 *   - (listing filters go in their own place)
 */

export type SubCategoryItem = {
  readonly id: string;
  readonly label: string;
};

export type CategoryItem = {
  readonly id: string;
  readonly label: string;
  /** Short description shown on category cards */
  readonly description: string;
  /**
   * Semantic color token — e.g. "blue", "amber", "violet".
   * Resolved to gradient + text classes via resolveCardColor() in visuals.ts.
   */
  readonly color: string;
  /**
   * Icon key — e.g. "home", "truck", "briefcase".
   * Resolved to a Heroicon component via resolveCardIcon() in visuals.ts.
   */
  readonly cardIcon: string;
  readonly subcategories: readonly SubCategoryItem[];
};
