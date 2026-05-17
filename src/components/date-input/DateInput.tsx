"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateInputFormat = "DMY" | "MDY" | "YMD";
export type DateSeparator = "/" | "-" | ".";
export type BlurDisplay = "none" | "long" | "medium" | "short" | "iso";

export type DateInputProps = {
  /** Controlled ISO value: YYYY-MM-DD */
  value?: string;
  /** Uncontrolled initial ISO value: YYYY-MM-DD */
  defaultValue?: string;
  /** Emits ISO string "YYYY-MM-DD" when complete and valid, null otherwise */
  onChange?: (iso: string | null) => void;
  /** Field order — DMY (default) | MDY | YMD */
  inputFormat?: DateInputFormat;
  /** Separator character between parts */
  separator?: DateSeparator;
  /**
   * How the date is displayed after the user leaves the field.
   * "none"   — stays as masked input (default)
   * "long"   — 21 July 2024
   * "medium" — 21 Jul 2024
   * "short"  — 21/07/2024
   * "iso"    — 2024-07-21
   */
  blurDisplay?: BlurDisplay;
  /** External error message — overrides internal validation message */
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildPlaceholder(format: DateInputFormat, sep: string): string {
  const s = ` ${sep} `;
  switch (format) {
    case "MDY": return `MM${s}DD${s}YYYY`;
    case "YMD": return `YYYY${s}MM${s}DD`;
    default:    return `DD${s}MM${s}YYYY`;
  }
}

/** Given raw digits, insert separators per format */
function applyMask(digits: string, format: DateInputFormat, sep: string): string {
  const s = ` ${sep} `;
  if (format === "YMD") {
    // YYYY MM DD  — 4 + 2 + 2
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    if (digits.length <= 4) return y;
    if (digits.length <= 6) return `${y}${s}${m}`;
    return `${y}${s}${m}${s}${d}`;
  }
  // DMY / MDY — 2 + 2 + 4
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 4);
  const p3 = digits.slice(4, 8);
  if (digits.length <= 2) return p1;
  if (digits.length <= 4) return `${p1}${s}${p2}`;
  return `${p1}${s}${p2}${s}${p3}`;
}

/** Extract raw digits from a masked string */
function stripMask(masked: string): string {
  return masked.replace(/[^0-9]/g, "");
}

/** Parse digits → { d, m, y } based on format */
function parseDigits(
  digits: string,
  format: DateInputFormat
): { d: number; m: number; y: number } | null {
  if (format === "YMD") {
    if (digits.length < 8) return null;
    const y = parseInt(digits.slice(0, 4), 10);
    const m = parseInt(digits.slice(4, 6), 10);
    const d = parseInt(digits.slice(6, 8), 10);
    return { d, m, y };
  }
  if (digits.length < 8) return null;
  const p1 = parseInt(digits.slice(0, 2), 10);
  const p2 = parseInt(digits.slice(2, 4), 10);
  const y  = parseInt(digits.slice(4, 8), 10);
  if (format === "MDY") return { d: p2, m: p1, y };
  return { d: p1, m: p2, y }; // DMY
}

function isValidDate(d: number, m: number, y: number): boolean {
  if (m < 1 || m > 12 || d < 1 || y < 1000 || y > 9999) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function toISO(d: number, m: number, y: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Parse an ISO string (YYYY-MM-DD) to { d, m, y } */
function fromISO(iso: string): { d: number; m: number; y: number } | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { y: parseInt(match[1], 10), m: parseInt(match[2], 10), d: parseInt(match[3], 10) };
}

/** Convert { d, m, y } to display digits based on format */
function toDigits(d: number, m: number, y: number, format: DateInputFormat): string {
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const yyyy = String(y).padStart(4, "0");
  if (format === "MDY") return `${mm}${dd}${yyyy}`;
  if (format === "YMD") return `${yyyy}${mm}${dd}`;
  return `${dd}${mm}${yyyy}`;
}

function formatBlurDisplay(d: number, m: number, y: number, mode: BlurDisplay, sep: string): string {
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const yyyy = String(y);
  switch (mode) {
    case "long":   return `${d} ${MONTHS_LONG[m - 1]} ${yyyy}`;
    case "medium": return `${dd} ${MONTHS_SHORT[m - 1]} ${yyyy}`;
    case "short":  return `${dd}${sep}${mm}${sep}${yyyy}`;
    case "iso":    return toISO(d, m, y);
    default:       return "";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      inputFormat = "DMY",
      separator = "/",
      blurDisplay = "none",
      error,
      placeholder,
      disabled,
      id,
      label,
      className,
      inputClassName,
    },
    ref
  ) => {
    const controlled = typeof value !== "undefined";

    const isoToMasked = React.useCallback((iso: string | undefined): string => {
      if (!iso) return "";
      const parsed = fromISO(iso);
      if (!parsed) return "";
      const digits = toDigits(parsed.d, parsed.m, parsed.y, inputFormat);
      return applyMask(digits, inputFormat, separator);
    }, [inputFormat, separator]);

    const [masked, setMasked] = React.useState<string>(() =>
      isoToMasked(controlled ? value : defaultValue)
    );
    const [focused, setFocused] = React.useState(false);
    const [valid, setValid] = React.useState<boolean | null>(null); // null = incomplete
    const [touched, setTouched] = React.useState(false);

    // sync controlled value changes from outside
    React.useEffect(() => {
      if (controlled) {
        setMasked(isoToMasked(value));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, inputFormat, separator, isoToMasked]);

    /** Shared: apply mask + update state + emit */
    const applyAndEmit = React.useCallback((digits: string) => {
      const next = applyMask(digits, inputFormat, separator);
      setMasked(next);
      const parsed = parseDigits(digits, inputFormat);
      if (parsed && isValidDate(parsed.d, parsed.m, parsed.y)) {
        setValid(true);
        onChange?.(toISO(parsed.d, parsed.m, parsed.y));
      } else {
        setValid(digits.length > 0 ? false : null);
        onChange?.(null);
      }
    }, [inputFormat, separator, onChange]);

    const derivedPlaceholder = placeholder ?? buildPlaceholder(inputFormat, separator);

    // Determine blurDisplayText
    const blurDisplayText = React.useMemo(() => {
      if (blurDisplay === "none") return "";
      const digits = stripMask(masked);
      const parsed = parseDigits(digits, inputFormat);
      if (!parsed) return "";
      if (!isValidDate(parsed.d, parsed.m, parsed.y)) return "";
      return formatBlurDisplay(parsed.d, parsed.m, parsed.y, blurDisplay, separator);
    }, [masked, blurDisplay, inputFormat, separator]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const digits = stripMask(e.target.value).slice(0, 8);
      applyAndEmit(digits);
    }

    // Show inline auto-error only after blur and only if digits were typed
    const digits = stripMask(masked);
    const isIncomplete = digits.length > 0 && digits.length < 8;
    const isInvalid    = digits.length === 8 && valid === false;
    const autoError =
      touched && !focused && isIncomplete ? "Please complete the date" :
      touched && !focused && isInvalid    ? "Please enter a valid date" :
      null;
    const errorMessage = error ?? autoError;
    const errorId = id ? `${id}-error` : undefined;

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      // Allow: backspace, delete, tab, escape, arrows
      const allowed = ["Backspace", "Delete", "Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (allowed.includes(e.key)) return;
      // Block non-digit keys
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      e.preventDefault();
      const digits = stripMask(e.clipboardData.getData("text/plain")).slice(0, 8);
      applyAndEmit(digits);
    }

    // Show blur display when blurred, complete, and valid
    const showBlurDisplay = !focused && blurDisplay !== "none" && !!blurDisplayText;

    const borderClass =
      errorMessage        ? "border-red-400"   :
      valid === true      ? "border-green-500" :
      "border-gray-700/50";

    const baseInputClass = cn(
      "flex h-10 w-full rounded-sm border-[1.5px] bg-gray-50 px-3 py-2 text-base font-normal text-gray-900 caret-gray-900 placeholder:text-gray-400 transition-colors",
      "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      borderClass,
      inputClassName
    );

    return (
      <div className={cn("relative w-full", className)}>
        {label && (
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
        )}

        {/* Blur display overlay — shows friendly text when not focused */}
        {showBlurDisplay ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Date field, click to edit"
            onKeyDown={(e) => e.key === "Enter" || e.key === " " ? setFocused(true) : undefined}
            onClick={() => setFocused(true)}
            className={cn(
              "flex h-10 w-full items-center rounded-sm border-[1.5px] bg-gray-50 px-3 text-base font-normal text-gray-900 cursor-text transition-colors",
              borderClass,
              inputClassName
            )}
          >
            {blurDisplayText}
          </div>
        ) : (
          <input
            id={id}
            ref={ref}
            type="text"
            inputMode="numeric"
            autoFocus={focused && blurDisplay !== "none"}
            value={masked}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTouched(true); }}
            placeholder={derivedPlaceholder}
            disabled={disabled}
            aria-label={label ?? derivedPlaceholder}
            aria-describedby={errorId}
            className={baseInputClass}
          />
        )}

        {errorMessage && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
