/**
 * Detects whether the current device supports touch input.
 * Safe to call on the client only (checks `window`/`navigator`).
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}