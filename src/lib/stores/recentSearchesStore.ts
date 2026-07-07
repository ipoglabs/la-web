/**
 * recentSearchesStore — persisted recent search history.
 *
 * Stores the last MAX_ITEMS keyword searches with optional location context.
 * Persisted to localStorage. skipHydration prevents SSR mismatch.
 *
 * Usage:
 *   // Save on search submit:
 *   useRecentSearchesStore.getState().add({ keyword: "Honda City", locationLabel: "Delhi" });
 *
 *   // Read in component:
 *   const items = useRecentSearchesStore((s) => s.items);
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 8;

export interface RecentSearch {
  id: string;
  keyword: string;
  locationLabel?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  unit?: "km" | "mi";
  searchedAt: number;
}

interface RecentSearchesState {
  items: RecentSearch[];
  add: (entry: Omit<RecentSearch, "id" | "searchedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const NOW = Date.now();
const days = (n: number) => NOW - n * 24 * 60 * 60 * 1000;

/**
 * TODO(DEMO ONLY): Remove DUMMY_ITEMS before production.
 * Set initial state to `items: []` instead.
 *
 * ⚠️  IMPORTANT: These items seed the in-memory store on first load.
 * Once a user makes a real search, `add()` will persist the full `items`
 * array to localStorage — including these dummy entries. They will then
 * survive page reloads as if they were real user history.
 * Remove before shipping to real users.
 */
const DUMMY_ITEMS: RecentSearch[] = [
  { id: "rs-d1", keyword: "2 BHK Apartment",      locationLabel: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245, radius: 1,   unit: "km", searchedAt: days(0) },
  { id: "rs-d2", keyword: "Honda City",            locationLabel: "Delhi",                 lat: 28.7041, lng: 77.1025, radius: 5,   unit: "km", searchedAt: days(1) },
  { id: "rs-d3", keyword: "React Developer Remote", locationLabel: undefined,              searchedAt: days(2) },
  { id: "rs-d4", keyword: "Home Cleaning Service",  locationLabel: "Mumbai",               lat: 19.0760, lng: 72.8777, radius: 2,   unit: "km", searchedAt: days(3) },
  { id: "rs-d5", keyword: "iPhone 14 Pro",          locationLabel: "Chennai",              lat: 13.0827, lng: 80.2707, radius: 0.5, unit: "km", searchedAt: days(5) },
];

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      items: DUMMY_ITEMS,

      add: (entry) =>
        set((s) => {
          // Dedupe by keyword (case-insensitive) — move to top if already exists
          const filtered = s.items.filter(
            (i) => i.keyword.toLowerCase() !== entry.keyword.toLowerCase()
          );
          const newItem: RecentSearch = {
            ...entry,
            id: `rs-${Date.now()}`,
            searchedAt: Date.now(),
          };
          return { items: [newItem, ...filtered].slice(0, MAX_ITEMS) };
        }),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "la-recent-searches",
      skipHydration: true,
    }
  )
);
