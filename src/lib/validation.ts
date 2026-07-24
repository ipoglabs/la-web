export function isValidEmail(value: string) {
  if (!value) return false;
  return /^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(value.trim());
}

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string, minLen = 6) {
  const digits = normalizePhoneDigits(value);
  return digits.length >= minLen;
}

/** E.164-ish check for a fully-formatted number like "+65 9123 4567" — strips
 *  separators first, then requires a leading "+" and 7-15 digits total. */
export function isValidE164Phone(value: string) {
  const digits = normalizePhoneDigits(value);
  return /^\+/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
}

/**
 * Strip HTML tags, null bytes, and ASCII control chars, then trim and cap at
 * `maxLen`. Returns null if input isn't a string or is empty after cleanup.
 * Use at API boundaries for any free-text field from the client.
 */
export function sanitizeText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
  return cleaned || null;
}

/** Age gate — subject must be `minAge` or older. Accepts an ISO date string (YYYY-MM-DD). */
export function isAgeValid(dobIso: string, minAge = 18) {
  const birth = new Date(`${dobIso}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - minAge);
  return birth <= cutoff;
}

/**
 * Strips anything that can't appear in a real person's name as the user types:
 * keeps letters (any language/script), spaces, apostrophes, hyphens, and
 * periods (for initials like "J.K."). Blocks digits and symbols entirely —
 * garbage like "????1234" can never be typed in the first place.
 */
export function sanitizeFullNameInput(value: string) {
  return value.replace(/[^\p{L}\p{M} '.-]/gu, "");
}

/** True if `value` is a plausible real name: starts with a letter, then letters/spaces/apostrophes/hyphens/periods only. */
export function isValidFullName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[\p{L}\p{M}][\p{L}\p{M} '.-]*$/u.test(trimmed);
}

/**
 * Looser sanitizer for short free-text labels that aren't strictly names
 * (e.g. a custom role or a specialty like "3D Printing Service"). Keeps
 * letters, digits, spaces, and a small set of punctuation; strips control
 * characters, symbols, and emoji so the field can't be filled with garbage.
 */
export function sanitizeFreeTextInput(value: string) {
  return value.replace(/[^\p{L}\p{N}\p{M} &/,.'-]/gu, "");
}

/** True if `value` contains at least one real letter once trimmed — rejects empty/whitespace-only or pure punctuation/digit strings. */
export function isMeaningfulText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /\p{L}/u.test(trimmed);
}

export const PASSWORD_MIN_LENGTH = 8;

/** Minimum viable password strength: at least 8 chars, one letter, one digit. Server must still enforce this independently — never trust client-side validation alone. */
export function isValidPassword(value: string) {
  if (value.length < PASSWORD_MIN_LENGTH) return false;
  return /[A-Za-z]/.test(value) && /\d/.test(value);
}
