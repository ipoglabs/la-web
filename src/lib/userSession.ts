/**
 * lib/userSession.ts
 *
 * Backs the account-settings "Devices" list (Login and Security section):
 * one `Session` document per signed-in device, keyed by an opaque `sid`
 * embedded in the session JWT at sign-time. See `models/session.ts` for the
 * revocation model.
 *
 * Every route that mints a session JWT (`resolve-identity`, `complete-profile`,
 * `google-callback`, `google-complete`, `login`) must call `createUserSession()`
 * first and put its `sid` in the JWT payload. Every route that *reads* a
 * session (`lib/auth.ts`, `lib/session.ts`, `app/actions/getCurrentUser.ts`)
 * must call `isSessionRevoked()` after `jwt.verify` succeeds.
 */
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Session from "@/models/session";
import { parseDeviceLabel } from "@/lib/deviceLabel";

// Legacy tokens minted before this feature existed carry no `sid` claim.
// Throttle window below re-used as the "how stale can lastActiveAt be
// before we bother writing it again" cutoff — avoids a DB write on every
// single session-read (root layout renders on every page load).
const ACTIVITY_UPDATE_INTERVAL_MS = 5 * 60_000;

export function getRequestIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

/** Creates the Session record for a freshly-authenticated device and returns its `sid`. */
export async function createUserSession(userId: string, req: Request): Promise<string> {
  await dbConnect();
  const userAgent = req.headers.get("user-agent") ?? "";
  const sessionId = crypto.randomUUID();

  await Session.create({
    userId,
    sessionId,
    userAgent,
    deviceLabel: parseDeviceLabel(userAgent),
    ip: getRequestIp(req),
    lastActiveAt: new Date(),
  });

  return sessionId;
}

/**
 * True if this `sid` has been revoked (or never existed) — callers must
 * treat the token as logged out. A missing `sid` (legacy token, or a JWT
 * minted by a path that hasn't been wired to session tracking) is
 * grandfathered in as valid rather than mass-logging-out existing sessions.
 */
export async function isSessionRevoked(sid: string | undefined, userId: string): Promise<boolean> {
  if (!sid) return false;

  await dbConnect();
  const record = await Session.findOne({ sessionId: sid, userId })
    .select("revokedAt lastActiveAt")
    .lean<{ revokedAt: Date | null; lastActiveAt: Date }>();

  if (!record || record.revokedAt) return true;

  const isStale = !record.lastActiveAt || Date.now() - new Date(record.lastActiveAt).getTime() > ACTIVITY_UPDATE_INTERVAL_MS;
  if (isStale) {
    // Fire-and-forget-ish, but awaited to keep Mongoose connection handling
    // simple — this is a single indexed update, not worth backgrounding.
    await Session.updateOne({ sessionId: sid }, { $set: { lastActiveAt: new Date() } });
  }

  return false;
}
