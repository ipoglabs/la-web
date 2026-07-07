import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  country?: string;
  theme: "light" | "dark";
  setCountry: (country: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
  country: undefined,
  theme: "light",
  setCountry: (country) => set({ country }),
  setTheme: (theme) => set({ theme }),
    }),
    {
      name: "app-storage", // key in localStorage
    }
  )
);
