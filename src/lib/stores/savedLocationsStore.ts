/**
 * savedLocationsStore — local-first saved locations for the LocationPicker,
 * used for signed-out visitors who have no DB account to persist to.
 *
 * Strategy:
 *   - Persisted to localStorage via Zustand `persist` middleware.
 *   - `useSavedLocations()` (lib/hooks/useSavedLocations.ts) reads/writes this
 *     store only when signed out; once a session is confirmed it switches to
 *     the real DB-backed list (models/user.ts's savedLocations) instead.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_SAVED_LOCATIONS } from "@/lib/locationUtils";
import type { SavedSuggestion } from "@/components/location-picker";

interface SavedLocationsState {
  items: SavedSuggestion[];
  /** Returns false (and leaves items untouched) once MAX_SAVED_LOCATIONS is hit — callers use this to surface a "limit reached" message. */
  add: (item: SavedSuggestion) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useSavedLocationsStore = create<SavedLocationsState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const s = get();
        const isDuplicate = s.items.some(
          (i) => i.label === item.label && i.sublabel === item.sublabel
        );
        if (isDuplicate) return true;
        if (s.items.length >= MAX_SAVED_LOCATIONS) return false;
        const withId: SavedSuggestion = { ...item, id: item.id ?? `local-${Date.now()}` };
        set({ items: [withId, ...s.items] });
        return true;
      },

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "la-saved-locations", // localStorage key
      skipHydration: true,        // prevent SSR/client hydration mismatch
    }
  )
);
