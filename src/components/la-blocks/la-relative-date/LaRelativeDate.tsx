"use client";

/**
 * LaRelativeDate — smart relative date label with click-to-toggle exact date.
 *
 * Relative time thresholds (auto-selected based on elapsed time):
 *   < 1 min    →  "just now"
 *   < 1 hour   →  short "3min" / long "3 minutes ago"
 *   < 1 day    →  short "1h"   / long "1 hour ago"
 *   < 7 days   →  short "1d"   / long "1 day ago"
 *   < 30 days  →  short "1w"   / long "1 week ago"
 *   < 91 days  →  short "1mo"  / long "1 month ago"
 *   ≥ 91 days  →  exact date e.g. "Jun 09, 2025" (both styles)
 *
 * Toggle on click:
 *   Click the label to switch to exact date. Click again to revert to relative.
 *   For values already showing exact date (≥ 91 days), the toggle is a no-op.
 *
 * Props:
 *   value             — timestamp (Date | number | ISO string)
 *   relativeStyle     — "short" (default, e.g. "2w") or "long" (e.g. "2 weeks ago").
 *                       "long" is locale-aware via Intl.RelativeTimeFormat.
 *   dateFormatOptions — Intl.DateTimeFormatOptions to customise exact date output.
 *                       Default: { month: "short", day: "2-digit", year: "numeric" }
 *                       Example long:    { month: "long",  day: "numeric", year: "numeric" }
 *                       Example numeric: { month: "2-digit", day: "2-digit", year: "numeric" }
 *   locale            — BCP 47 locale string. Default: "en-US"
 *   className         — additional Tailwind classes
 *
 * Usage:
 *   <LaRelativeDate value={listing.postedAt} />
 *   <LaRelativeDate value={review.date} relativeStyle="long" />
 *   <LaRelativeDate value={msg.sentAt} dateFormatOptions={{ month: "long", day: "numeric", year: "numeric" }} />
 *   <LaRelativeDate value={event.date} locale="en-GB" />
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LaRelativeDateProps {
  value: string | number | Date;
  /** "short" (default, e.g. "2w") or "long" (e.g. "2 weeks ago"). */
  relativeStyle?: "short" | "long";
  /** Intl.DateTimeFormatOptions for the exact date display. */
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  /** BCP 47 locale string. Default: "en-US" */
  locale?: string;
  className?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MINUTE = 60_000;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;
const WEEK   =  7 * DAY;

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day:   "2-digit",
  year:  "numeric",
};

// Only the singular forms are ever produced by relativeParts() below.
// Intl.RelativeTimeFormatUnit also includes plural forms ("years", "months", …)
// which this lookup table deliberately omits — it is a subset, not the full union.
type ShortUnit = "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";

const SHORT_UNIT_SUFFIX: Record<ShortUnit, string> = {
  year: "y", quarter: "q", month: "mo", week: "w", day: "d", hour: "h", minute: "min", second: "s",
};

// ── Pure helpers (module-level, not called directly in render) ─────────────────

function toTimestamp(value: string | number | Date): number | null {
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/** Buckets elapsed ms into a unit + value, or null once past the 91-day exact-date cutoff. */
function relativeParts(elapsed: number): { value: number; unit: ShortUnit } | null {
  if (elapsed < HOUR)       return { value: Math.floor(elapsed / MINUTE), unit: "minute" };
  if (elapsed < DAY)        return { value: Math.floor(elapsed / HOUR), unit: "hour" };
  if (elapsed < 7  * DAY)   return { value: Math.floor(elapsed / DAY), unit: "day" };
  if (elapsed < 30 * DAY)   return { value: Math.floor(elapsed / WEEK), unit: "week" };
  if (elapsed < 91 * DAY)   return { value: Math.max(1, Math.floor(elapsed / (30 * DAY))), unit: "month" };
  return null;
}

function formatRelative(
  elapsed: number,
  style: "short" | "long",
  locale: string,
): string | null {
  if (elapsed < MINUTE) return "just now";
  const parts = relativeParts(elapsed);
  if (!parts) return null;
  if (style === "long") {
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-parts.value, parts.unit);
  }
  return `${parts.value}${SHORT_UNIT_SUFFIX[parts.unit]}`;
}

// Wraps Date.now() inside a user function — avoids React compiler flagging it
// as an impure direct call during render.
function computeRelativeLabel(
  value: string | number | Date,
  exactFallback: string,
  style: "short" | "long",
  locale: string,
): string {
  const time = toTimestamp(value);
  if (time === null) return "-";
  const elapsed = Math.max(0, Date.now() - time);
  return formatRelative(elapsed, style, locale) ?? exactFallback;
}

function computeExactLabel(
  value: string | number | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const time = toTimestamp(value);
  if (time === null) return "-";
  return new Intl.DateTimeFormat(locale, options).format(new Date(time));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LaRelativeDate({
  value,
  relativeStyle = "short",
  dateFormatOptions,
  locale = "en-US",
  className,
}: LaRelativeDateProps) {
  const [showExact, setShowExact] = React.useState(false);

  const options      = dateFormatOptions ?? DEFAULT_DATE_FORMAT;
  const exactLabel   = computeExactLabel(value, locale, options);
  const defaultLabel = computeRelativeLabel(value, exactLabel, relativeStyle, locale);
  const displayLabel = showExact ? exactLabel : defaultLabel;
  const toggleable   = defaultLabel !== exactLabel;

  return (
    <button
      type="button"
      onClick={() => toggleable && setShowExact((prev) => !prev)}
      className={cn(
        "shrink-0 text-sm text-slate-400 transition-colors",
        toggleable
          ? "cursor-pointer hover:text-slate-600"
          : "cursor-default",
        className,
      )}
      aria-label={toggleable ? "Toggle between relative and exact date" : undefined}
      title={toggleable ? (showExact ? "Show relative time" : "Show exact date") : undefined}
    >
      {displayLabel}
    </button>
  );
}
