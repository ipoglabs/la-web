import { create } from "zustand";
import { softDeleteAccount } from "@/app/actions/profile/deleteAccount";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DeleteStage = 2 | 3 | 4;

// ─── API calls ──────────────────────────────────────────────────────────────

async function apiCheckEligibility(): Promise<{ eligible: boolean; reason?: string }> {
  // No separate eligibility rules exist yet (no subscriptions/pending-txn
  // concept in the User model) — softDeleteAccount() itself still checks
  // session validity + isDeleted, so this stays a simple pass-through.
  return { eligible: true };
}

async function apiSubmitFeedback(reasons: string[], details: string): Promise<void> {
  // TODO: [API] POST /account/delete-feedback — no backend endpoint for
  // storing delete-reason feedback yet. Fire-and-forget, non-blocking.
  void reasons; void details;
}

async function apiDeleteAccount(feedback?: string): Promise<void> {
  const result = await softDeleteAccount(feedback);
  if (!result.success) {
    throw new Error(result.message || "We couldn't delete your account.");
  }
  // Server already cleared the session cookie — tell the rest of the app
  // (AppHeader's checkAuth listener) to re-check auth state immediately.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-changed"));
  }
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
    const { reasons, details } = get();
    set({ isLoading: true, error: null });
    try {
      const feedback = [reasons.join("; "), details].filter(Boolean).join(" — ");
      await apiDeleteAccount(feedback);
      set({ stage: 4 });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "We couldn't delete your account. Please try again or contact support.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
