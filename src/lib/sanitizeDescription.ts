/**
 * lib/sanitizeDescription.ts
 *
 * Turns a raw, user-submitted (untrusted) Post.description string into safe
 * HTML for LaListingDescription, which renders its `html` prop via
 * `dangerouslySetInnerHTML` — see that component's own security note and
 * the matching TODO in listings/[listingId]/page.tsx, both of which existed
 * because Post-backed descriptions were never actually rendered there
 * before real DB wiring.
 *
 * Strategy: strip every tag the user typed (so nothing they wrote can ever
 * become markup, whether or not it looks like an XSS attempt), then wrap
 * the surviving plain text in `<p>` tags we control ourselves. No
 * client-only sanitizer (DOMPurify) is installed, and it would need a
 * jsdom shim to run server-side anyway — stripping instead of sanitizing
 * is simpler and strictly safer for plain user text.
 */
export function sanitizeDescriptionToHtml(raw: string): string {
  const stripped = raw.replace(/<[^>]*>/g, "");

  const escaped = stripped
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`);

  return paragraphs.join("\n");
}
