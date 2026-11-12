/**
 * lib/sanitizeDescription.ts
 *
 * Turns a raw, user-submitted (untrusted) Post.description into safe HTML
 * for LaListingDescription, which renders it via `dangerouslySetInnerHTML`.
 *
 * The post form's RichTextEditor saves its contentEditable innerHTML, so a
 * description is HTML: "<p>Fish &amp; chips</p><ul><li>…</li></ul>". Older
 * and seeded posts are plain text with newlines.
 *
 * Strategy: an allow-list rebuild, not a filter. Only the editor's own tags
 * survive, always without attributes, and every other tag is dropped
 * (script/style together with their contents). Text is entity-decoded once
 * and re-escaped, so "&amp;" shows as "&" rather than as "&amp;". Tags are
 * re-balanced, so stray or unclosed tags can't break the page around it.
 */

/** Editor tag → the tag we output. Anything not listed is dropped. */
const ALLOWED: Record<string, string> = {
  p: "p",
  div: "p", // contentEditable's line wrapper
  br: "br",
  strong: "strong",
  b: "strong",
  em: "em",
  i: "em",
  u: "u",
  s: "s",
  strike: "s",
  ul: "ul",
  ol: "ol",
  li: "li",
  h2: "h2",
  h3: "h3",
  blockquote: "blockquote",
};
const BLOCK = new Set(["p", "ul", "ol", "li", "h2", "h3", "blockquote"]);
const DROP_WITH_CONTENT = /<(script|style|template|iframe|object|noscript)\b[\s\S]*?<\/\1\s*>/gi;

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };

/** Decodes HTML entities (named basics + numeric) to plain characters. */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    const lower = code.toLowerCase();
    if (lower.startsWith("#x")) return safeChar(parseInt(lower.slice(2), 16), m);
    if (lower.startsWith("#")) return safeChar(parseInt(lower.slice(1), 10), m);
    return NAMED[lower] ?? m;
  });
}

function safeChar(cp: number, fallback: string): string {
  if (!Number.isFinite(cp) || cp <= 0 || cp > 0x10ffff) return fallback;
  return cp === 0xa0 ? " " : String.fromCodePoint(cp);
}

const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain text with blank lines between paragraphs → <p>/<br /> HTML. */
function plainToHtml(text: string): string {
  return escapeText(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

export function sanitizeDescriptionToHtml(raw: string): string {
  const src = raw.replace(DROP_WITH_CONTENT, "");
  // No markup at all → a plain-text description (older/seeded posts).
  if (!/<\/?[a-z][^>]*>/i.test(src)) return plainToHtml(decodeEntities(src));

  const out: string[] = [];
  const stack: string[] = [];
  const close = (tag: string) => {
    const at = stack.lastIndexOf(tag);
    if (at === -1) return;
    while (stack.length > at) out.push(`</${stack.pop()}>`);
  };

  for (const token of src.split(/(<[^>]*>)/)) {
    if (!token) continue;
    const m = /^<\s*(\/)?\s*([a-z0-9]+)/i.exec(token);
    if (!token.startsWith("<") || !m) {
      // Text, including a lone "<" that isn't a tag.
      const text = decodeEntities(token).replace(/\n/g, " ");
      if (text) out.push(escapeText(text));
      continue;
    }
    const tag = ALLOWED[m[2].toLowerCase()];
    if (!tag) continue;
    if (tag === "br") {
      out.push("<br />");
    } else if (m[1]) {
      close(tag);
    } else {
      // A new block closes any open inline tags, and a <p> can't nest.
      if (BLOCK.has(tag)) {
        while (stack.length && !BLOCK.has(stack[stack.length - 1])) out.push(`</${stack.pop()}>`);
        if (tag === "p" || tag === "h2" || tag === "h3") close("p");
      }
      out.push(`<${tag}>`);
      stack.push(tag);
    }
  }
  while (stack.length) out.push(`</${stack.pop()}>`);

  return out
    .join("")
    .replace(/<(p|h2|h3|li|blockquote)>(\s|&nbsp;|<br \/>)*<\/\1>/g, "") // empty blocks
    .trim();
}

/** Description as plain text, e.g. for meta tags and structured data. */
export function descriptionToPlainText(raw: string): string {
  return decodeEntities(
    raw
      .replace(DROP_WITH_CONTENT, "")
      .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6])\b[^>]*>/gi, " ")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}
