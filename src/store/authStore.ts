"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | Date;
  gender?: string;

  nationality?: string;
  residency?: string;
  country?: string;
  state?: string;

  email: string;
  isEmailVerified?: boolean;

  primaryNumber: string;
  secondaryNumber1?: string;
  secondaryNumber2?: string;
  isPhoneVerified?: boolean;

  locality?: string;          // 👈 new

  username?: string;          // 👈 keep optional, since register no longer sends it

  image?: string;
  provider?: string;
  marketingOptIn?: boolean;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;

  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setAuth: (token: string, user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setAuth: (token, user) => set({ token, user }),
      updateUser: (partial) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...partial } } : state
        ),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
