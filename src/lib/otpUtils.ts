/**
 * Normalizes an OTP target (email or phone) to a single canonical form, so
 * the record written by sendOtpService, the lookup in verifyOtpService, and
 * the final verified-record check in updateContact.ts all agree on the same
 * key — otherwise a verified OTP for "+65 9123 4567" would never match a
 * lookup for "+6591234567" (or vice versa).
 */
export function normalizeTarget(channel: "email" | "phone", value: string): string {
  const trimmed = value.trim();
  if (channel === "email") return trimmed.toLowerCase();
  // Phone: keep a leading "+" (if present) and strip everything but digits.
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}
