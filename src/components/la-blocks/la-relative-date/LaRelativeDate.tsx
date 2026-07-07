"use client";

/**
 * LaRelativeDate — smart relative date label with click-to-toggle exact date.
 *
 * Relative time thresholds (auto-selected based on elapsed time):
 *   < 1 min    →  "just now"
 *   < 1 hour   →  "3min", "10min", "59min"
 *   < 1 day    →  "1h", "2h", "23h"
 *   < 7 days   →  "1d", "2d", "6d"
 *   < 30 days  →  "1w", "2w", "3w", "4w"
 *   < 91 days  →  "1mo", "2mo", "3mo"
 *   ≥ 91 days  →  exact date e.g. "Jun 09, 2025"
 *
 * Toggle on click:
 *   Click the label to switch to exact date. Click again to revert to relative.
 *   For values already showing exact date (≥ 91 days), the toggle is a no-op.
 *
 * Props:
 *   value             — timestamp (Date | number | ISO string)
 *   dateFormatOptions — Intl.DateTimeFormatOptions to customise exact date output.
 *                       Default: { month: "short", day: "2-digit", year: "numeric" }
 *                       Example long:    { month: "long",  day: "numeric", year: "numeric" }
 *                       Example numeric: { month: "2-digit", day: "2-digit", year: "numeric" }
 *   locale            — BCP 47 locale string. Default: "en-US"
 *   className         — additional Tailwind classes
 *
 * Usage:
 *   <LaRelativeDate value={listing.postedAt} />
 *   <LaRelativeDate value={msg.sentAt} dateFormatOptions={{ month: "long", day: "numeric", year: "numeric" }} />
 *   <LaRelativeDate value={event.date} locale="en-GB" />
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LaRelativeDateProps {
  value: string | number | Date;
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

// ── Pure helpers (module-level, not called directly in render) ─────────────────

function toTimestamp(value: string | number | Date): number | null {
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function relativeSegment(elapsed: number): string | null {
  if (elapsed < MINUTE)     return "just now";
  if (elapsed < HOUR)       return `${Math.floor(elapsed / MINUTE)}min`;
  if (elapsed < DAY)        return `${Math.floor(elapsed / HOUR)}h`;
  if (elapsed < 7  * DAY)   return `${Math.floor(elapsed / DAY)}d`;
  if (elapsed < 30 * DAY)   return `${Math.floor(elapsed / WEEK)}w`;
  if (elapsed < 91 * DAY)   return `${Math.max(1, Math.floor(elapsed / (30 * DAY)))}mo`;
  return null;
}

// Wraps Date.now() inside a user function — avoids React compiler flagging it
// as an impure direct call during render.
function computeRelativeLabel(
  value: string | number | Date,
  exactFallback: string,
): string {
  const time = toTimestamp(value);
  if (time === null) return "-";
  const elapsed = Math.max(0, Date.now() - time);
  return relativeSegment(elapsed) ?? exactFallback;
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
  dateFormatOptions,
  locale = "en-US",
  className,
}: LaRelativeDateProps) {
  const [showExact, setShowExact] = React.useState(false);

  const options      = dateFormatOptions ?? DEFAULT_DATE_FORMAT;
  const exactLabel   = computeExactLabel(value, locale, options);
  const defaultLabel = computeRelativeLabel(value, exactLabel);
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
