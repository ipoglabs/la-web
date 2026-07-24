import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Country } from "@/lib/data/countries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(country: Country, phone: string) {
  return `${country.dial} ${phone}`;
}

/**
 * Appends a `?redirect=` query param to `path` if `redirect` is present —
 * shared by Register's and Login's step components so the `?redirect=`
 * target (e.g. `/post`) survives every hop of the wizard instead of only
 * being read on the final step. Returns `path` unchanged when `redirect`
 * is null/empty.
 */
export function withRedirectParam(path: string, redirect: string | null): string {
  return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
}

/**
 * Controls how the email is displayed in the verify-otp stage.
 *
 * - `"local-first"` (Option A): `j***@gmail.com`         — first char only + domain
 * - `"partial"`     (Option B): `jo***ne@gmail.com`       — first 2 + last 1 of local part
 * - `"full"`        (Option C): `johndoe@gmail.com`       — unmasked (default)
 */
export type EmailMaskMode = "local-first" | "partial" | "full";

export type RelativeTimeInput = string | number | Date;

export type RelativeTimeStyle = "compact" | "short" | "long";

export interface RelativeTimeOptions {
  now?: number;
  style?: RelativeTimeStyle;
  invalidFallback?: string;
}

/** Masks an email address according to the chosen mode. */
export function maskEmail(email: string, mode: EmailMaskMode): string {
  if (mode === "full") return email;
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 1) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex); // includes the @
  if (mode === "local-first") return `${local[0]}***${domain}`;
  // partial — show first 2 + last 1 of local (fallback to local-first if too short)
  if (local.length <= 3) return `${local[0]}***${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}${domain}`;
}

function normalizeTimestamp(input: RelativeTimeInput): number | null {
  const value = input instanceof Date ? input.getTime() : new Date(input).getTime();
  return Number.isFinite(value) ? value : null;
}

function formatUnit(value: number, unit: "minute" | "hour" | "day" | "month" | "year", style: RelativeTimeStyle) {
  if (style === "compact") {
    const compactMap: Record<typeof unit, string> = {
      minute: "m",
      hour: "h",
      day: "d",
      month: "mo",
      year: "y",
    };
    return `${value}${compactMap[unit]} ago`;
  }

  if (style === "short") {
    const shortMap: Record<typeof unit, string> = {
      minute: "min",
      hour: "hr",
      day: "day",
      month: "mo",
      year: "yr",
    };
    const label = shortMap[unit];
    const plural = unit === "day" ? "s" : value > 1 ? "s" : "";
    return `${value}${label}${plural} ago`;
  }

  const longLabel = value === 1 ? unit : `${unit}s`;
  return `${value} ${longLabel} ago`;
}

export function formatRelativeTime(input: RelativeTimeInput, options: RelativeTimeOptions = {}): string {
  const {
    now = Date.now(),
    style = "compact",
    invalidFallback = "-",
  } = options;

  const inputTime = normalizeTimestamp(input);
  if (inputTime === null) return invalidFallback;

  const elapsedMs = Math.max(0, now - inputTime);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (elapsedMs < hour) {
    const value = Math.max(1, Math.floor(elapsedMs / minute));
    return formatUnit(value, "minute", style);
  }

  if (elapsedMs < day) {
    const value = Math.floor(elapsedMs / hour);
    return formatUnit(value, "hour", style);
  }

  if (elapsedMs < month) {
    const value = Math.floor(elapsedMs / day);
    return formatUnit(value, "day", style);
  }

  if (elapsedMs < year) {
    const value = Math.floor(elapsedMs / month);
    return formatUnit(value, "month", style);
  }

  const value = Math.floor(elapsedMs / year);
  return formatUnit(value, "year", style);
}
