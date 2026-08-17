/**
 * app/api/search/log/route.ts
 *
 * POST /api/search/log — logs one search submission for popularity ranking.
 *
 * Fire-and-forget: callers (LaSearchBar consumers) never await this before
 * showing results, and a failure here must never surface to the user — same
 * best-effort pattern as saveSearch (use-recent-searches.ts). Guest and
 * signed-in searches both count; this is a separate, location-tagged event
 * log from the personal recentSearches list (models/user.ts), which never
 * stores location. See md/features/popular-searches.md Section 3.1/4.2.
 *
 * Request body: { keyword: string; category?: string; country: string; city?: string }
 * Responses:
 *   202 {}                      — logged (or silently skipped — caller ignores body either way)
 *   400 { error: string }       — missing required fields
 *   429 { error, message }      — rate limited
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import connectDB from "@/lib/db";
import SearchEvent from "@/models/SearchEvent";

// Generous enough for real typing/search behavior, blunts scripted abuse —
// same POC caveat as rate-limit.ts's other callers (in-memory, per-instance).
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

interface LogSearchBody {
  keyword?: string;
  category?: string;
  country?: string;
  city?: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`search-log:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse(60);
  }

  let body: LogSearchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim().toUpperCase() : "";
  const category = typeof body.category === "string" && body.category.trim() ? body.category.trim() : undefined;
  const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : undefined;

  // No keyword and no category scope isn't a meaningful "search" to rank —
  // mirrors use-recent-searches.ts's own save() guard.
  if ((!keyword && !category) || !country) {
    return NextResponse.json({ error: "keyword or category, and country, are required." }, { status: 400 });
  }

  try {
    await connectDB();
    await SearchEvent.create({ keyword, category, country, city, searchedAt: new Date() });
  } catch (err) {
    // Best-effort — never block or error out the caller's search flow.
    console.error("[api/search/log] failed to record search event:", err);
  }

  return NextResponse.json({}, { status: 202 });
}
