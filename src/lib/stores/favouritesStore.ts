/**
 * favouritesStore — local-first favourites with server sync.
 *
 * Strategy:
 *   - Persisted to localStorage via Zustand `persist` middleware.
 *   - Works for all users (logged in or not).
 *   - `add`/`remove` also fire the matching server action (models/Favourite.ts).
 *     Local state updates immediately, so the UI never waits on the network.
 *   - `remove` records a tombstone in `removedIds`. A server delete that fails
 *     or races an in-flight `getMyFavourites()` read would otherwise be undone
 *     by the next `syncFromServer` merge (server row still present → re-added).
 *     The tombstone keeps the item hidden and gets retried until a server read
 *     confirms the row is gone (`syncFromServer`) or `reconcile()` succeeds.
 *   - On login: call `reconcile()` then `syncFromServer(serverItems)` to flush
 *     pending deletes and merge server data in (see AppHeader.tsx).
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

/** Bound on retained tombstones — far more than real usage needs. */
const MAX_TOMBSTONES = 200;

interface FavouritesState {
  items: FavItem[];
  /** ids removed locally whose server-side delete isn't confirmed yet */
  removedIds: string[];
  add: (item: FavItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  /** Merge server data in post-login; honours + reconciles tombstones. */
  syncFromServer: (serverItems: FavItem[]) => void;
  /** Retry every unconfirmed server delete. Safe to call anytime. */
  reconcile: () => Promise<void>;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      items: [],
      removedIds: [],

      add: (item) => {
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items
            : [...s.items, item],
          // Re-adding clears any pending delete for the same listing.
          removedIds: s.removedIds.filter((id) => id !== item.id),
        }));
        addFavourite(item).catch(() => {});
      },

      remove: (id) => {
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
          removedIds: s.removedIds.includes(id)
            ? s.removedIds
            : [...s.removedIds, id].slice(-MAX_TOMBSTONES),
        }));
        // Fast path. A guest has no server row that a later sync could
        // resurrect, so drop the tombstone immediately; for a signed-in user
        // keep it until a server read confirms the delete.
        removeFavourite(id)
          .then((res) => {
            if (res?.ok && res.persisted === false) {
              set((s) => ({ removedIds: s.removedIds.filter((rid) => rid !== id) }));
            }
          })
          .catch(() => {
            /* keep tombstone; reconcile()/syncFromServer will retry */
          });
      },

      has: (id) => get().items.some((i) => i.id === id),

      syncFromServer: (serverItems) => {
        const { removedIds, items } = get();
        const tombstoned = new Set(removedIds);

        // Rows the user deleted locally that the server still lists: fire the
        // delete again to reconcile.
        serverItems
          .filter((si) => tombstoned.has(si.id))
          .forEach((si) => {
            removeFavourite(si.id).catch(() => {});
          });

        set({
          items: [
            ...serverItems.filter((si) => !tombstoned.has(si.id)),
            ...items.filter(
              (i) =>
                !tombstoned.has(i.id) &&
                !serverItems.some((si) => si.id === i.id)
            ),
          ],
          // Keep only tombstones the server still shows — the rest are gone.
          removedIds: removedIds.filter((id) =>
            serverItems.some((si) => si.id === id)
          ),
        });
      },

      reconcile: async () => {
        const ids = get().removedIds;
        if (ids.length === 0) return;
        const settled = await Promise.allSettled(
          ids.map((id) => removeFavourite(id))
        );
        const confirmed = new Set(
          ids.filter((_, i) => {
            const r = settled[i];
            return (
              r.status === "fulfilled" &&
              (r.value as { ok?: boolean } | undefined)?.ok === true
            );
          })
        );
        if (confirmed.size > 0) {
          set((s) => ({
            removedIds: s.removedIds.filter((id) => !confirmed.has(id)),
          }));
        }
      },

      clear: () => set({ items: [], removedIds: [] }),
    }),
    {
      name: "la-favourites", // localStorage key
      skipHydration: true,   // prevent SSR/client hydration mismatch
      partialize: (s) => ({ items: s.items, removedIds: s.removedIds }),
    }
  )
);
