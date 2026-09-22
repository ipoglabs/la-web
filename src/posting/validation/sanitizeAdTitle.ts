// Ad title only allows letters, digits, spaces, and . , -
const DISALLOWED_AD_TITLE_CHARS = /[^a-zA-Z0-9 .,-]/g;

export function sanitizeAdTitle(value: string): string {
  return value.replace(DISALLOWED_AD_TITLE_CHARS, "");
}
