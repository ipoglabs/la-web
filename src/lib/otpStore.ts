// lib/otpStore.ts
type OtpRecord = {
  otp: string;
  expiresAt: number;
  verified?: boolean;

  // 👇 new fields for server-side abuse protection
  attempts?: number;         // failed attempts counter
  lockedUntil?: number | null; // epoch ms; if now < lockedUntil => locked
};

declare global {
  // eslint-disable-next-line no-var
  var otpStore: { [email: string]: OtpRecord } | undefined;
}

const store: { [email: string]: OtpRecord } = global.otpStore || {};
if (!global.otpStore) global.otpStore = store;

export default store;
export type { OtpRecord };
