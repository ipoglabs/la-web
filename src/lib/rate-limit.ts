/**
 * lib/rate-limit.ts
 *
 * Minimal in-memory sliding-window rate limiter for public API routes.
 *
 * POC-scoped: state lives in a single process's memory (a Map), so limits
 * reset on redeploy/cold start and are NOT shared across multiple serverless
 * instances or regions. This is enough to blunt basic scripted abuse against
 * the routes it protects (autocomplete, handle checks, a paid external API
 * proxy) — it is NOT a substitute for a real distributed limiter before
 * production traffic at scale.
 *
 * TODO [INTEGRATION — BEFORE PRODUCTION]: swap for a distributed limiter
 * (e.g. Upstash Redis + @upstash/ratelimit) once deployed across more than
 * one serverless instance.
 */

import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic sweep so the Map doesn't grow unbounded in a long-lived process.
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupExpired(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Best-effort client IP — trusts the platform's forwarded-for header
 * (set by Vercel, Cloudflare, and most reverse proxies). `NextRequest` has
 * no built-in `.ip` in this Next.js version, so this is read manually.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if `key` is within `limit` requests per `windowMs` and
 * increments its counter; returns false once the limit is exceeded for the
 * remainder of the current window (does not increment further).
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

/** Standard 429 JSON response with a Retry-After hint. */
export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "rate_limited", message: "Too many requests — please slow down." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
