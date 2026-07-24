/**
 * loginStore — small wizard state for the Login journey: `/login` →
 * (`/login/verify` if phone/magic-link).
 *
 * Deliberately smaller than `onboardingStore` (Register's store) — Login
 * never collects Details/Role itself. It only needs to remember which
 * method/identifier was chosen on `/login` so `/login/verify` can read it
 * back without carrying it in the URL — same reasoning as Register's
 * store, just a smaller slice of state.
 *
 * Persisted to `sessionStorage` — survives a refresh or back/forward
 * mid-flow, gone once the tab closes. Same convention as `onboardingStore`.
 *
 * On the "no matching account" path (see `POST /api/auth/resolve-identity`),
 * this store is NOT where the hand-off data goes — that goes into the
 * shared `onboardingStore` instead (see its header), since that's what
 * `/register/details` and `/register/role` actually read from. This store
 * is only for Login's own two screens.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SignupMethod = "google" | "apple" | "magic_link" | "phone_otp";

interface LoginState {
  method: SignupMethod | null;
  /** Email (magic_link) or phone digits (phone_otp) — null for google/apple. */
  identifier: string | null;
  verified: boolean;

  setMethod: (method: SignupMethod, identifier: string | null) => void;
  setVerified: (verified: boolean) => void;
  reset: () => void;
}

const INITIAL: Pick<LoginState, "method" | "identifier" | "verified"> = {
  method: null,
  identifier: null,
  verified: false,
};

export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setMethod: (method, identifier) => set({ method, identifier, verified: false }),
      setVerified: (verified) => set({ verified }),
      reset: () => set({ ...INITIAL }),
    }),
    {
      name: "la-login-wizard",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
