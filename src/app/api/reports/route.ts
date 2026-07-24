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
 * TODO [INTEGRATION]: Extract reporterId + reporterEmail from your auth
 *   session (e.g. next-auth getServerSession) and pass into the document.
 */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdReport, { generateTicketId } from "@/components/report-ad/model";
import { REPORT_ISSUE_OPTIONS, type ReportAdPayload } from "@/components/report-ad/types";

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

    // TODO [INTEGRATION]: Get reporterId from session, e.g.:
    //   const session = await getServerSession(authOptions);
    //   const reporterId = session?.user?.id ?? null;
    const reporterId: string | null = null;

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

    const report = await AdReport.create({
      ticketId,
      adId:         payload.adId,
      adTitle:      payload.adTitle,
      adThumbnail:  payload.adThumbnail ?? "",
      sellerName:   payload.sellerName,
      sellerId:     "",              // TODO [INTEGRATION]: pass from listing context
      location:     payload.location ?? "",
      reporterId,
      reporterEmail: null,           // TODO [INTEGRATION]: from session if user consented
      hideIdentity:  payload.hideIdentity ?? true,
      issues:        payload.issues,
      details:       payload.details ?? "",
    });

    return NextResponse.json(
      { ticketId: report.ticketId },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/reports]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
