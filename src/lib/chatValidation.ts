// Allowed: a-z A-Z 0-9 space newline . , - & @ +
const STRIP_RE = /[^a-zA-Z0-9 \n.,\-&@+]/g;

/** Remove every character not in the allowed set. */
export function filterChatChars(raw: string): string {
  return raw.replace(STRIP_RE, "");
}

/** True if text contains a phone number (7+ digits) or an email address. */
export function hasContactInfo(text: string): boolean {
  const phone = /(\+?\d[\d\s\-.+]{5,}\d)/;
  const email = /[a-zA-Z0-9._%+]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  return phone.test(text) || email.test(text);
}
