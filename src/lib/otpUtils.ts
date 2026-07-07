// lib/otpUtils.ts

export const OTP_MAX_ATTEMPTS = 30;
export const OTP_LOCK_MINUTES = 0.5; // 30 seconds
export const OTP_EXPIRE_MINUTES = 10;

export const normalizeEmail = (v: string) =>
  String(v).toLowerCase().trim();

export const normalizePhone = (v: string) => {
  const cleaned = String(v).replace(/\s+/g, "");

  if (!/^\+\d{10,15}$/.test(cleaned)) {
    throw new Error("Invalid phone number");
  }

  return cleaned; // ✅ E.164 only
};

export function normalizeTarget(
  channel: "email" | "phone",
  value: string
) {
  return channel === "email"
    ? normalizeEmail(value)
    : normalizePhone(value);
}