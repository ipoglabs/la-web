/**
 * favouritesStore — local-first favourites with server sync.
 *
 * Strategy:
 *   - Persisted to localStorage via Zustand `persist` middleware.
 *   - Works for all users (logged in or not).
 *   - On login: call `syncFromServer(serverItems)` to merge server data in.
 *   - On logout: optionally call `clear()` or keep local items for continuity.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavItem {
  id: string;
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: number; // unix ms — serialises cleanly to JSON
  status?: "active" | "closed" | "off-market";
}

interface FavouritesState {
  items: FavItem[];
  add: (item: FavItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  /** Replace local items with server data post-login (dedupes by id). */
  syncFromServer: (serverItems: FavItem[]) => void;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items
            : [...s.items, item],
        })),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      has: (id) => get().items.some((i) => i.id === id),

      syncFromServer: (serverItems) =>
        set((s) => ({
          items: [
            ...serverItems,
            ...s.items.filter((i) => !serverItems.some((si) => si.id === i.id)),
          ],
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "la-favourites", // localStorage key
      skipHydration: true,   // prevent SSR/client hydration mismatch
    }
  )
);
