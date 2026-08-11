/**
 * recentSearchesStore — local-first recent searches for signed-out visitors
 * who have no DB account to persist to.
 *
 * Strategy:
 *   - Persisted to localStorage via Zustand `persist` middleware.
 *   - `useRecentSearches()` (lib/hooks/use-recent-searches.ts) reads/writes
 *     this store only when signed out; once a session is confirmed it
 *     switches to the real DB-backed list (models/user.ts's recentSearches)
 *     via saveSearch/removeSearch/clearSearches instead.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { upsertRecentSearch, type RecentSearch } from "@/lib/searchUtils";

interface RecentSearchesState {
  items: RecentSearch[];
  add: (entry: Omit<RecentSearch, "id" | "savedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (entry) => set({ items: upsertRecentSearch(get().items, entry) }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "la-recent-searches", // localStorage key
      skipHydration: true,        // prevent SSR/client hydration mismatch
    }
  )
);
