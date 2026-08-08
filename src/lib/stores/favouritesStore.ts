/**
 * favouritesStore — local-first favourites with server sync.
 *
 * Strategy:
 *   - Persisted to localStorage via Zustand `persist` middleware.
 *   - Works for all users (logged in or not).
 *   - `add`/`remove` also fire the matching server action (models/Favourite.ts)
 *     fire-and-forget — silently no-ops for guests (no session), persists +
 *     logs to ActivityLog for signed-in users. Local state updates
 *     immediately either way, so the UI never waits on the network.
 *   - On login: call `syncFromServer(serverItems)` to merge server data in
 *     (see AppHeader.tsx, which does this on mount for a signed-in user).
 *   - On logout: optionally call `clear()` or keep local items for continuity.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ListingStatus } from "@/types/listing";
import { addFavourite } from "@/app/actions/favourites/addFavourite";
import { removeFavourite } from "@/app/actions/favourites/removeFavourite";

export interface FavItem {
  id: string;
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: number; // unix ms — serialises cleanly to JSON
  status?: ListingStatus;
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

      add: (item) => {
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items
            : [...s.items, item],
        }));
        addFavourite(item).catch(() => {});
      },

      remove: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
        removeFavourite(id).catch(() => {});
      },

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
