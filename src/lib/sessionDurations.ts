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

export const SESSION_DURATIONS = [
  { seconds: 60 * 60 * 24,       label: "24 hours" },
  { seconds: 60 * 60 * 24 * 7,   label: "7 days" },
  { seconds: 60 * 60 * 24 * 14,  label: "14 days" },
  { seconds: 60 * 60 * 24 * 30,  label: "30 days" },
] as const;

export const SESSION_DURATION_SECONDS: number[] = SESSION_DURATIONS.map(
  (d) => d.seconds
);

/** Default when a token carries no readable lifetime (fresh login = 7 days). */
export const DEFAULT_SESSION_DURATION = 60 * 60 * 24 * 7;

/** Snap an arbitrary remaining-seconds value to the closest preset. */
export function nearestSessionDuration(seconds: number): number {
  return SESSION_DURATION_SECONDS.reduce((best, cur) =>
    Math.abs(cur - seconds) < Math.abs(best - seconds) ? cur : best
  );
}
