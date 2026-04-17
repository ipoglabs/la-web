// lib/otpUtils.ts
export const OTP_MAX_ATTEMPTS = 30;
export const OTP_LOCK_MINUTES = 0.5; // 30 seconds
export const OTP_EXPIRE_MINUTES = 10;

export const normalizeEmail = (v: string) => String(v).toLowerCase().trim();
export const normalizePhone = (v: string) => String(v).trim();

export function normalizeTarget(channel: "email" | "phone", value: string) {
  return channel === "email" ? normalizeEmail(value) : normalizePhone(value);
}