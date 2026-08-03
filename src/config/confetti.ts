/**
 * How long a `useConfettiCelebration()` burst stays mounted before its
 * caller is allowed to navigate away — see `lib/hooks/useConfettiCelebration.ts`.
 * Single source of truth so every "success" page (OAuth sign-in, OTP verify,
 * final registration step) tunes together instead of drifting apart.
 */
export const CONFETTI_CELEBRATION_MS = 2500;
