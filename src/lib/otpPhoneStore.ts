// lib/otpPhoneStore.ts

/**
 * Phone OTP in-memory store (shared globally across server reloads)
 * Used for Step 3: Mobile Verification
 */

export type PhoneOtpRecord = {
  otp: string;
  expiresAt: number;
  verified?: boolean;
};

declare global {
  // Allow re-use across hot reloads in Next.js (globalThis scope)
  // eslint-disable-next-line no-var
  var otpPhoneStore: Record<string, PhoneOtpRecord> | undefined;
}

// Initialize global singleton for phone OTPs
const otpPhoneStore: Record<string, PhoneOtpRecord> = global.otpPhoneStore || {};
if (!global.otpPhoneStore) global.otpPhoneStore = otpPhoneStore;

export default otpPhoneStore;
