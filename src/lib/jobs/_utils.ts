/**
 * lib/jobs/_utils.ts
 *
 * Shared utilities for job query building.
 * Internal to lib/jobs/ — not exported outside this folder.
 */

/**
 * Escape special MongoDB regex characters in a user-supplied keyword.
 * Prevents keyword values like "c++" or "$100" from breaking the regex query.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
