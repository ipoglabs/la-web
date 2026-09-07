/**
 * lib/sessionDurations.ts
 *
 * The selectable session lengths offered by the avatar-menu "Session length"
 * switcher (see `components/avatar/AvatarDropdown.tsx` and
 * `app/api/auth/session-duration/route.ts`).
 *
 * Kept in its own module — no `next/headers`, `jsonwebtoken` or db imports —
 * so the client dropdown and the server route can share the same list.
 * `lib/auth.ts` still owns the default length applied at login (MAX_AGE = 7d).
 */

/**
 * `seconds: 0` is the "Off" sentinel — "don't keep me logged in". Not one of
 * the selectable presets below: it's driven by the on/off switch in the
 * avatar menu, not the duration pills. The server issues a session-only
 * cookie (no `maxAge`, cleared when the browser closes) and caps the JWT at
 * `SESSION_OFF_JWT_SECONDS`.
 */
export const SESSION_OFF = 0;

/** Hard cap on an "Off" (session-only) JWT — a safety ceiling, not a maxAge. */
export const SESSION_OFF_JWT_SECONDS = 60 * 60 * 12;

/** The selectable "stay logged in up to" presets (shown only when the switch is on). */
export const SESSION_DURATIONS = [
  { seconds: 60 * 60 * 24,       label: "24h" },
  { seconds: 60 * 60 * 24 * 7,   label: "7d" },
  { seconds: 60 * 60 * 24 * 14,  label: "14d" },
  { seconds: 60 * 60 * 24 * 30,  label: "1mo" },
] as const;

export const SESSION_DURATION_SECONDS: number[] = SESSION_DURATIONS.map(
  (d) => d.seconds
);

/** Every value the API accepts: the presets plus the "Off" sentinel. */
export function isValidSessionSeconds(seconds: number): boolean {
  return seconds === SESSION_OFF || SESSION_DURATION_SECONDS.includes(seconds);
}

/** Default when a token carries no readable lifetime (fresh login = 7 days). */
export const DEFAULT_SESSION_DURATION = 60 * 60 * 24 * 7;

/** Snap an arbitrary remaining-seconds value to the closest preset. */
export function nearestSessionDuration(seconds: number): number {
  return SESSION_DURATION_SECONDS.reduce((best, cur) =>
    Math.abs(cur - seconds) < Math.abs(best - seconds) ? cur : best
  );
}
