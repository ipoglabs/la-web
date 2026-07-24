/**
 * app/api/profile/check-handle/route.ts
 *
 * POST /api/profile/check-handle — check if a profile handle is available
 *
 * Request body: { handle: string }
 *
 * Responses:
 *   200 { available: boolean, handle: string }  — result (available = true/false)
 *   400 { error: string }                        — invalid format
 *
 * TODO [INTEGRATION]: Replace the hard-coded TAKEN_HANDLES set with a real DB query:
 *   const existing = await User.exists({ handle });
 *   return NextResponse.json({ available: !existing, handle });
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

// Handle must be 3–20 lowercase letters, numbers, or underscores.
const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

// Generous enough for interactive typing (debounced) but blocks scripted enumeration.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

// Reserved system names — always blocked even if not yet taken by a User doc.
const RESERVED_HANDLES = new Set([
  "admin", "lokalads", "support", "help", "info", "moderator",
  "api", "www", "mail", "root", "system", "status", "bot", "team",
]);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`check-handle:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse(60);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw =
    body !== null &&
    typeof body === "object" &&
    "handle" in body &&
    typeof (body as Record<string, unknown>).handle === "string"
      ? (body as { handle: string }).handle.trim().toLowerCase()
      : null;

  if (!raw || !HANDLE_REGEX.test(raw)) {
    return NextResponse.json(
      {
        error:
          "Invalid handle. Use 3–30 characters: lowercase letters, numbers, or underscores only.",
      },
      { status: 400 },
    );
  }

  if (RESERVED_HANDLES.has(raw)) {
    return NextResponse.json({ available: false, handle: raw });
  }

  await connectDB();

  // Let the signed-in user "re-check" their own current handle as available.
  const session = await getSession().catch(() => null);
  const existing = await User.findOne({ userId: raw }).select("_id").lean();
  const isOwnHandle =
    !!existing &&
    !!session?.userId &&
    String((existing as { _id: unknown })._id) === String(session.userId);

  const available = !existing || isOwnHandle;

  return NextResponse.json({ available, handle: raw });
}
