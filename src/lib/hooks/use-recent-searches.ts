"use client";

/**
 * use-recent-searches.ts
 *
 * Recent search history for LaSearchBar (dropdown recents + landing page
 * "Recent Searches" section). Each entry captures keyword + category scope.
 * Max MAX_RECENT_SEARCHES entries — oldest are dropped automatically.
 *
 * Signed-in accounts: backed by the real DB (models/user.ts's
 * recentSearches, via saveSearch/removeSearch/clearSearches server actions)
 * so search history follows the user across devices.
 *
 * Signed-out visitors have no account to persist to, but the feature still
 * needs to work for them — falls back to recentSearchesStore
 * (lib/stores/recentSearchesStore.ts), a localStorage-backed Zustand store,
 * so saving/removing/clearing behaves the same either way. Mirrors the
 * pattern useSavedLocations.ts already uses for saved locations.
 */
import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { saveSearch } from "@/app/actions/profile/saveSearch";
import { removeSearch } from "@/app/actions/profile/removeSearch";
import { clearSearches } from "@/app/actions/profile/clearSearches";
import { useRecentSearchesStore } from "@/lib/stores/recentSearchesStore";
import type { RecentSearch } from "@/lib/searchUtils";

export type { RecentSearch };

export function useRecentSearches() {
  const [dbRecents, setDbRecents] = useState<RecentSearch[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const guestItems = useRecentSearchesStore((s) => s.items);
  const guestAdd = useRecentSearchesStore((s) => s.add);
  const guestRemove = useRecentSearchesStore((s) => s.remove);
  const guestClear = useRecentSearchesStore((s) => s.clear);

  useEffect(() => {
    // skipHydration: true on the store (avoids SSR/client mismatch) means
    // it starts empty on the client too until explicitly rehydrated here.
    useRecentSearchesStore.persist.rehydrate();
  }, []);

  const refresh = useCallback(async () => {
    const user = await getCurrentUser().catch(() => null);
    setLoggedIn(Boolean(user));
    setDbRecents(user?.recentSearches ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    (entry: Omit<RecentSearch, "id" | "savedAt">) => {
      // Skip saving empty keyword with no scope
      if (!entry.keyword.trim() && !entry.scope) return;

      if (!loggedIn) {
        guestAdd(entry);
        return;
      }
      // Best-effort background save triggered by every search submit — a
      // failure here (transient account-state change) isn't worth
      // surfacing to the user mid-search.
      saveSearch({ keyword: entry.keyword, scope: entry.scope }).then(setDbRecents).catch(() => {});
    },
    [loggedIn, guestAdd]
  );

  const remove = useCallback(
    (id: string) => {
      if (!loggedIn) {
        guestRemove(id);
        return;
      }
      removeSearch(id).then(setDbRecents).catch(() => {});
    },
    [loggedIn, guestRemove]
  );

  const clear = useCallback(() => {
    if (!loggedIn) {
      guestClear();
      return;
    }
    clearSearches()
      .then(() => setDbRecents([]))
      .catch(() => {});
  }, [loggedIn, guestClear]);

  return { recents: loggedIn ? dbRecents : guestItems, save, remove, clear };
}
