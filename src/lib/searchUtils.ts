import type { LocationValue } from "@/components/location-picker";

/** Shared cap on saved recent searches — enforced client-side (guest
 *  localStorage, via recentSearchesStore) and server-side (saveSearch), so
 *  it holds regardless of which surface a search comes from. */
export const MAX_RECENT_SEARCHES = 8;

export interface RecentSearchScope {
  cat: string;
  label: string;
  sub?: string;
  subLabel?: string;
}

export interface RecentSearch {
  id: string;
  keyword: string;
  location: LocationValue | null;
  scope: RecentSearchScope | null;
  savedAt: number;
}

/**
 * Dedupe by keyword + category (case-insensitive), push the new entry to
 * the front, cap to MAX_RECENT_SEARCHES. Shared by the guest localStorage
 * store (recentSearchesStore.ts) and the logged-in DB path (saveSearch.ts)
 * so both behave identically.
 */
export function upsertRecentSearch(
  items: RecentSearch[],
  entry: Omit<RecentSearch, "id" | "savedAt">
): RecentSearch[] {
  const deduped = items.filter(
    (r) =>
      !(
        r.keyword.trim().toLowerCase() === entry.keyword.trim().toLowerCase() &&
        r.scope?.cat === entry.scope?.cat
      )
  );
  return [{ ...entry, id: String(Date.now()), savedAt: Date.now() }, ...deduped].slice(
    0,
    MAX_RECENT_SEARCHES
  );
}

/** Raw shape of a User.recentSearches Mongoose subdocument, as returned by
 *  a `.lean()` read or a saved document's array. */
export interface RawRecentSearch {
  _id: unknown;
  keyword?: string;
  scopeCat?: string;
  scopeLabel?: string;
  scopeSub?: string;
  scopeSubLabel?: string;
  searchedAt?: Date | string;
}

/** DB subdocument → client RecentSearch. Location is never persisted server
 *  side (LaSearchBar always saves location: null — the picker's location
 *  context lives separately), so it's always null here too. */
export function mapRecentSearch(raw: RawRecentSearch): RecentSearch {
  return {
    id: String(raw._id),
    keyword: raw.keyword || "",
    location: null,
    scope: raw.scopeCat
      ? { cat: raw.scopeCat, label: raw.scopeLabel || "", sub: raw.scopeSub, subLabel: raw.scopeSubLabel }
      : null,
    savedAt: raw.searchedAt ? new Date(raw.searchedAt).getTime() : Date.now(),
  };
}
