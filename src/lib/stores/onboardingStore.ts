/**
 * onboardingStore — shared account-completion state, written by TWO
 * callers (renamed 2026-07-16 from `registerStore`, per
 * `md/feature-spec-doc/login-journey.md` Architecture — a plain rename
 * plus this header note is what keeps the shared ownership obvious to any
 * future developer, instead of looking like a cross-feature bug):
 *
 *   1. Register (`/register` → `/register/verify` → `/register/details` →
 *      `/register/role`) — the full journey, writes every field.
 *   2. Login (`/login` → `/login/verify`) — convergence-only. When a
 *      Google/Apple/Magic-Link/Phone-OTP identity has no matching account,
 *      Login calls `setMethod()` + `markAccountCreated()` on THIS store
 *      (not its own smaller `loginStore`), then redirects into
 *      `/register/details` to finish the account. This is intentional,
 *      not a bug — see `DetailsStep.tsx`/`RoleStep.tsx` mount guards for
 *      the matching note on the read side.
 *
 * Persisted to `sessionStorage` (NOT `localStorage`) — survives an
 * accidental refresh or back/forward navigation mid-wizard (delivers the
 * "authenticate first, complete profile after" resilience promise below
 * for real), but is gone the moment the tab/browser closes, since this is
 * still transient signup data, not something that should survive a device
 * restart. Cleared explicitly via reset() once Role's Skip/Continue
 * completes, and also naturally expires with the browser session.
 *
 * Security-model note (locked 2026-07-15, see `md/feature-spec-doc/register-journey.md`):
 * "Authenticate first, complete profile after." The account/session is
 * considered created (`accountCreated: true`) the MOMENT identity is
 * proven — i.e. right after Google/Apple OAuth succeeds, or right after
 * phone/email OTP is verified. This is intentionally BEFORE Details/Role
 * are filled in, so a visitor who authenticates then abandons mid-journey
 * still has a real (if incomplete) account they can resume later, rather
 * than losing everything and having to redo OAuth/OTP from scratch.
 * A confirmation toast + redirect (to `?redirect=` or `/`) closes out the
 * journey once Role's Skip/Continue succeeds — no dedicated Success screen
 * (removed 2026-07-15 per Gopi) — but technically the account existed
 * since the verification step.
 *
 * Each step reads what it needs and writes its own answers, guarding
 * against direct URL access to a later step by redirecting back to
 * `/register` if a prerequisite is missing (see each step's mount guard).
 *
 * TODO [INTEGRATION]: Replace this client-only state hand-off with real
 * API calls once backend auth lands (see `md/feature-spec-doc/auth-multi-method.md`
 * and `md/feature-spec-doc/register-journey.md`):
 *   - setMethod(google/apple) → POST /api/auth/callback/google|apple, then
 *     immediately create session (accountCreated equivalent server-side)
 *   - setVerified(true) after OTP/magic-link → same, session created there
 *   - setDetails / setRoles → PATCH /api/users/me once real user id exists
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RoleId } from "@/config/roles";

export type SignupMethod = "google" | "apple" | "magic_link" | "phone_otp";

interface RegisterState {
  method: SignupMethod | null;
  /** Email (magic_link) or phone digits (phone_otp) — null for google/apple. */
  identifier: string | null;
  verified: boolean;
  /** Short-lived identity-proof token minted by verify-magic/phone verify-otp
   *  (see `lib/auth-proof.ts`) — required by `complete-profile`'s
   *  `verifyIdentityProof` check. Without this, complete-profile 401s. */
  proof: string | null;
  /** True the moment identity is proven (OAuth success or OTP verified) —
   *  the account/session already exists from this point on, even though
   *  Details/Role haven't been filled in yet. See header note above. */
  accountCreated: boolean;
  roleIds: RoleId[];
  specialties: Partial<Record<RoleId, string>>;
  customRole: string | null;
  fullName: string;
  gender: "Male" | "Female" | "Prefer not to say" | null;
  dateOfBirthIso: string;

  setMethod: (method: SignupMethod, identifier: string | null) => void;
  setVerified: (verified: boolean) => void;
  setProof: (proof: string | null) => void;
  /** Marks identity as proven and the account as (silently) created — call
   *  right after OAuth success or right after OTP verification succeeds. */
  markAccountCreated: (prefillFullName?: string) => void;
  setRoles: (roleIds: RoleId[], specialties: Partial<Record<RoleId, string>>, customRole: string | null) => void;
  setDetails: (fullName: string, gender: "Male" | "Female" | "Prefer not to say", dateOfBirthIso: string) => void;
  reset: () => void;
}

const INITIAL: Pick<
  RegisterState,
  "method" | "identifier" | "verified" | "proof" | "accountCreated" | "roleIds" | "specialties" | "customRole" | "fullName" | "gender" | "dateOfBirthIso"
> = {
  method: null,
  identifier: null,
  verified: false,
  proof: null,
  accountCreated: false,
  roleIds: [],
  specialties: {},
  customRole: null,
  fullName: "",
  gender: null,
  dateOfBirthIso: "",
};

export const useOnboardingStore = create<RegisterState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setMethod: (method, identifier) => set({ method, identifier, verified: false, proof: null }),
      setVerified: (verified) => set({ verified }),
      setProof: (proof) => set({ proof }),
      markAccountCreated: (prefillFullName) =>
        set((state) => ({
          accountCreated: true,
          fullName: prefillFullName ?? state.fullName,
        })),
      setRoles: (roleIds, specialties, customRole) => set({ roleIds, specialties, customRole }),
      setDetails: (fullName, gender, dateOfBirthIso) => set({ fullName, gender, dateOfBirthIso }),
      reset: () => set({ ...INITIAL }),
    }),
    {
      name: "la-register-wizard",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
