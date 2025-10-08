// lib/otpStore.ts

/**
 * Email OTP in-memory store (shared globally across server reloads)
 * Used for Step 2: Email Verification
 */

export type OtpRecord = {
  otp: string;
  expiresAt: number;
  verified?: boolean;
};

declare global {
  // Allow re-use across hot reloads in Next.js (globalThis scope)
  // eslint-disable-next-line no-var
  var otpStore: Record<string, OtpRecord> | undefined;
}

// Initialize a single global store instance (to survive hot reloads)
const otpStore: Record<string, OtpRecord> = global.otpStore || {};
if (!global.otpStore) global.otpStore = otpStore;

export default otpStore;
