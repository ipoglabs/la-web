import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DeleteStage = 2 | 3 | 4;

// ─── API Placeholders ──────────────────────────────────────────────────────
// Each function is a self-contained placeholder.
// Replace the body with the real fetch/axios call — the store handles
// loading, error, and state transitions for you.

async function apiCheckEligibility(): Promise<{ eligible: boolean; reason?: string }> {
  // TODO: [API] GET /account/delete-eligibility
  // Check for: active subscriptions, pending transactions, any blockers.
  // Returns { eligible: true } when safe to proceed.
  // Returns { eligible: false, reason: "You have an active subscription." } to block.
  return { eligible: true };
}

async function apiSubmitFeedback(reasons: string[], details: string): Promise<void> {
  // TODO: [API] POST /account/delete-feedback
  // Body: { reasons, details }
  // Fire-and-forget is fine — failure should NOT block the user from advancing.
  void reasons; void details;
}

async function apiDeleteAccount(): Promise<void> {
  // TODO: [API] DELETE /account
  // On 2xx: store will advance to stage 4 (goodbye screen).
  // On 4xx/5xx: throw an Error — the store will surface it as `state.error`.
  // After real success: clear auth tokens / session before advancing.
}

// ─── State & Actions ──────────────────────────────────────────────────────

interface DeleteAccountState {
  // ── Data
  stage: DeleteStage;
  reasons: string[];
  details: string;
  confirmed: boolean;

  // ── Async status
  isLoading: boolean;
  error: string | null;

  // ── Sync actions
  setStage: (stage: DeleteStage) => void;
  toggleReason: (reason: string) => void;
  setDetails: (details: string) => void;
  setConfirmed: (confirmed: boolean) => void;
  clearError: () => void;
  reset: () => void;

  // ── Async API actions
  checkEligibility: () => Promise<boolean>;
  submitFeedback: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const initialState = {
  stage: 2 as DeleteStage,
  reasons: [] as string[],
  details: "",
  confirmed: false,
  isLoading: false,
  error: null as string | null,
};

// ─── Store ─────────────────────────────────────────────────────────────────

export const useDeleteAccountStore = create<DeleteAccountState>((set, get) => ({
  ...initialState,

  // ── Sync ──────────────────────────────────────────────────────────────────

  setStage: (stage) => set({ stage }),

  toggleReason: (reason) =>
    set((s) => ({
      reasons: s.reasons.includes(reason)
        ? s.reasons.filter((r) => r !== reason)
        : [...s.reasons, reason],
    })),

  setDetails: (details) => set({ details }),

  setConfirmed: (confirmed) => set({ confirmed }),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),

  // ── Async ─────────────────────────────────────────────────────────────────

  checkEligibility: async () => {
    set({ isLoading: true, error: null });
    try {
      const { eligible, reason } = await apiCheckEligibility();
      if (!eligible) {
        set({ error: reason ?? "Your account is not eligible for deletion at this time." });
        return false;
      }
      return true;
    } catch {
      set({ error: "Something went wrong. Please try again." });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  submitFeedback: async () => {
    const { reasons, details } = get();
    set({ isLoading: true, error: null });
    try {
      await apiSubmitFeedback(reasons, details);
    } catch {
      // Non-blocking — advance regardless
    } finally {
      set({ isLoading: false, stage: 3 });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteAccount();
      set({ stage: 4 });
    } catch {
      set({ error: "We couldn't delete your account. Please try again or contact support." });
    } finally {
      set({ isLoading: false });
    }
  },
}));
