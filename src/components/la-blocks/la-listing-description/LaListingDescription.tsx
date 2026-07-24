"use client";

/**
 * LaListingDescription — renders rich HTML description content from the API.
 *
 * Accepts a plain HTML string (p, ul, ol, strong, em, u, s, a, br, h3, h4).
 * - <ul> items get the green tick circle icon (matching the rest of the design system)
 * - <ol> items use standard decimal numbering
 * - Inline: bold, italic, underline, strikethrough, links all styled
 * - All other HTML is rendered via dangerouslySetInnerHTML
 *
 * Security: content must be sanitised server-side before being passed here.
 * TODO [INTEGRATION]: run through DOMPurify or your server sanitiser before rendering.
 *
 * Usage:
 *   <LaListingDescription html={listing.description} />
 */

import * as React from "react";

export interface LaListingDescriptionProps {
  html: string;
  className?: string;
}

// ─── Tick icon — matches the green circle-check used throughout the design system ──
function TickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5 shrink-0 text-emerald-600 mt-px"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Split HTML string into segments: <ul>…</ul> blocks vs everything else ───
// We handle <ul> specially to inject tick icons; all other HTML goes through
// dangerouslySetInnerHTML so bold, italic, links, ol, etc. all work as-is.
function parseSegments(html: string): { type: "html" | "ul"; content: string }[] {
  const segments: { type: "html" | "ul"; content: string }[] = [];
  // Matches <ul ...>…</ul> (case-insensitive, dotAll)
  const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ulRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }
    segments.push({ type: "ul", content: match[1] }); // inner HTML of the <ul>
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", content: html.slice(lastIndex) });
  }

  return segments;
}

// ─── Extract <li> inner HTML strings from a <ul> inner content string ─────────
function extractListItems(ulInnerHtml: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = liRegex.exec(ulInnerHtml)) !== null) {
    items.push(match[1]);
  }
  return items;
}

export default function LaListingDescription({ html, className }: LaListingDescriptionProps) {
  const segments = parseSegments(html);

  return (
    <div className={["la-desc", className].filter(Boolean).join(" ")}>
      {segments.map((seg, i) => {
        if (seg.type === "ul") {
          const items = extractListItems(seg.content);
          return (
            <ul key={i} className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {items.map((itemHtml, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                  <TickIcon />
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: itemHtml }} />
                </li>
              ))}
            </ul>
          );
        }

        // All other HTML (p, ol, strong, em, h3, h4, a, br, etc.)
        return seg.content.trim() ? (
          // eslint-disable-next-line react/no-danger
          <div key={i} dangerouslySetInnerHTML={{ __html: seg.content }} />
        ) : null;
      })}
    </div>
  );
}
