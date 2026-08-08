/**
 * app/api/reports/route.ts
 *
 * POST /api/reports — submit a new ad report
 *
 * Request body: ReportAdPayload (see components/report-ad/types.ts)
 *
 * Responses:
 *   201 { ticketId }              — report created
 *   400 { error, fields? }        — validation error
 *   409 { error }                 — reporter already has an active report for this ad
 *   429 { error }                 — IP rate limit exceeded (max 10/hr)
 *   500 { error }                 — unexpected server error
 *
 * TODO [INTEGRATION]: Replace IP-based rate limiting with a proper
 *   solution (e.g. Upstash Redis + @upstash/ratelimit) for production.
 */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdReport, { generateTicketId } from "@/components/report-ad/model";
import { REPORT_ISSUE_OPTIONS, type ReportAdPayload } from "@/components/report-ad/types";
import { getAuthUser } from "@/lib/session";
import User from "@/models/user";
import { logActivity } from "@/lib/activityLog";

// ── Simple in-memory IP rate limiter (dev/staging only) ───────────────────────
// For production use Upstash Redis or similar persistent store.
const IP_WINDOW_MS  = 60 * 60 * 1000; // 1 hour
const IP_MAX_CALLS  = 10;
const ipLog = new Map<string, { count: number; windowStart: number }>();

function isIpRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = ipLog.get(ip);
  if (!entry || now - entry.windowStart > IP_WINDOW_MS) {
    ipLog.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > IP_MAX_CALLS;
}

// ── Sanitisation helpers ───────────────────────────────────────────────────────

/** Strip HTML/script tags, null bytes, and ASCII control chars (except tab/newline). */
function sanitizeText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  return value
    .replace(/<[^>]*>/g, "")          // strip HTML/script tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLen);
}

// ── Validation ─────────────────────────────────────────────────────────────────

const VALID_ISSUES = new Set(REPORT_ISSUE_OPTIONS.map((o) => o.value));

function validate(body: unknown): { ok: true; data: ReportAdPayload } | { ok: false; fields: string[] } {
  const errors: string[] = [];
  const b = body as Record<string, unknown>;

  const adId       = sanitizeText(b.adId,       100);
  const adTitle    = sanitizeText(b.adTitle,     300);
  const sellerName = sanitizeText(b.sellerName,  200);
  const sellerId   = sanitizeText(b.sellerId ?? "", 100);
  const details    = sanitizeText(b.details ?? "", 500);

  if (!adId)       errors.push("adId");
  if (!adTitle)    errors.push("adTitle");
  if (!sellerName) errors.push("sellerName");

  if (!Array.isArray(b.issues) || b.issues.length === 0) {
    errors.push("issues");
  } else if (!b.issues.every((v) => VALID_ISSUES.has(v))) {
    errors.push("issues");
  }

  if (errors.length) return { ok: false, fields: errors };

  return {
    ok: true,
    data: {
      ...(b as unknown as ReportAdPayload),
      adId:       adId!,
      adTitle:    adTitle!,
      sellerName: sellerName!,
      sellerId:   sellerId ?? "",
      details:    details ?? "",
    },
  };
}

// ── POST handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // IP rate limit
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (isIpRateLimited(ip)) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    // Parse + validate body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const validation = validate(body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: "validation_error", fields: validation.fields },
        { status: 400 },
      );
    }

    const payload = validation.data;

    await dbConnect();

    // Never trust a client-supplied reporterId — always derive it from the
    // real session, same as every other identity field in this app.
    const session = await getAuthUser();
    const reporterId: string | null = session?.id ?? null;

    // Duplicate check — reporter already has an active report for this ad
    if (reporterId) {
      const existing = await AdReport.findOne({
        reporterId,
        adId:   payload.adId,
        status: { $in: ["pending", "reviewed"] },
      }).lean();
      if (existing) {
        return NextResponse.json({ error: "duplicate_report" }, { status: 409 });
      }
    }

    // Generate a unique ticket ID (retry on collision, max 5 attempts)
    let ticketId = generateTicketId();
    for (let i = 0; i < 4; i++) {
      const clash = await AdReport.exists({ ticketId });
      if (!clash) break;
      ticketId = generateTicketId();
    }

    // Boolean(...) rather than a plain `??` default — payload.hideIdentity is
    // unvalidated client JSON (see validate()'s `...b` spread below it), so a
    // non-boolean value (e.g. a stray "false" string, which is truthy in JS)
    // must still coerce predictably instead of silently flipping the
    // anonymity default via loose truthy/falsy rules.
    const hideIdentity = Boolean(payload.hideIdentity ?? true);

    // Only look up (and store) the reporter's email when they explicitly
    // consented — ReportAdJourney's identity toggle reuses hideIdentity as
    // that consent signal (hideIdentity: false = "not anonymous", only
    // reachable for signed-in reporters). Fetched fresh from the User doc
    // rather than trusted from the JWT/session claims.
    let reporterEmail: string | null = null;
    if (!hideIdentity && reporterId) {
      const reporterUser = await User.findById(reporterId).select("email").lean();
      reporterEmail = reporterUser?.email ?? null;
    }

    const report = await AdReport.create({
      ticketId,
      adId:         payload.adId,
      adTitle:      payload.adTitle,
      adThumbnail:  payload.adThumbnail ?? "",
      sellerName:   payload.sellerName,
      sellerId:     payload.sellerId ?? "",
      location:     payload.location ?? "",
      reporterId,
      reporterEmail,
      hideIdentity,
      issues:        payload.issues,
      details:       payload.details ?? "",
    });

    // Guests report anonymously (reporterId: null) by design — nothing to
    // log against for them, only signed-in reporters get an audit entry.
    if (reporterId) {
      await logActivity(reporterId, "AD_REPORTED", { title: payload.adTitle });
    }

    return NextResponse.json(
      { ticketId: report.ticketId },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/reports]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
