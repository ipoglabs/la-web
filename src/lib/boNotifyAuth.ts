import { timingSafeEqual } from "crypto";

/**
 * Auth for the back office's notify endpoints (/api/internal/listing-moderated,
 * /account-status, /report-updated): `Authorization: Bearer $BO_NOTIFY_SECRET`.
 * Set in this project AND in lokalads-bo, Production only. Its own secret,
 * separate from CRON_SECRET / INTERNAL_SECRET, so a leak of one doesn't open
 * the others. Each endpoint takes only an id and reads the rest from the
 * database, so even a leaked secret can only send a true notice, once.
 */
export function boNotifyAuthorised(req: Request): boolean {
  const secret = process.env.BO_NOTIFY_SECRET;
  if (!secret || secret.length < 32) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
