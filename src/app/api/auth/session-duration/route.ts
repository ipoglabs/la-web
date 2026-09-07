/**
 * app/api/auth/session-duration/route.ts
 *
 * Backs the "Stay signed in up to" switcher in the avatar menu. Lets a
 * signed-in user re-issue their OWN session for a different lifetime
 * (Off / 24h / 7d / 14d / 1mo) without logging out — same device, same
 * `sid`, only the JWT `exp` and the `session` cookie `maxAge` change.
 *
 * "Off" (`seconds: 0`) means "don't keep me signed in": the cookies are
 * rewritten with no `maxAge` (session-only, cleared when the browser
 * closes) and the JWT is capped at `SESSION_OFF_JWT_SECONDS`.
 *
 *   GET  → { data: { seconds, options: [{ seconds, label }] } }
 *          `seconds` is the current token's lifetime snapped to the closest
 *          preset (a fresh login reads as 7 days; anything under a day
 *          reads as "Off").
 *
 *   POST { seconds } → re-signs the session JWT and rewrites the `session`
 *          (+ `uinfo`) cookies with the matching `maxAge` (omitted for Off).
 *          200 { data: { seconds } }
 *          400 { error }  — value not one of the presets
 *          401 { error }  — not signed in
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getSession } from "@/lib/auth";
import {
  SESSION_DURATIONS,
  SESSION_DURATION_SECONDS,
  DEFAULT_SESSION_DURATION,
  SESSION_OFF,
  SESSION_OFF_JWT_SECONDS,
  nearestSessionDuration,
} from "@/lib/sessionDurations";

const ONE_DAY = 60 * 60 * 24;

const COOKIE_NAME = "session";
const UINFO_COOKIE_NAME = "uinfo";

function requireSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    let seconds = DEFAULT_SESSION_DURATION;
    if (token) {
      const decoded = jwt.decode(token) as
        | { exp?: number; iat?: number }
        | null;
      if (decoded?.exp && decoded?.iat) {
        const lifetime = decoded.exp - decoded.iat;
        // A sub-day lifetime is only ever issued by the "Off" branch below.
        seconds = lifetime < ONE_DAY ? SESSION_OFF : nearestSessionDuration(lifetime);
      }
    }

    return NextResponse.json({ data: { seconds, options: SESSION_DURATIONS } });
  } catch (err) {
    console.error("session-duration GET error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req
      .json()
      .catch(() => ({}) as Record<string, unknown>);
    const seconds = Number((body as { seconds?: unknown }).seconds);

    if (!SESSION_DURATION_SECONDS.includes(seconds)) {
      return NextResponse.json(
        { error: "Unsupported session length" },
        { status: 400 }
      );
    }

    // "Off" → don't keep the user signed in: cap the JWT at a short ceiling
    // and issue session-only cookies (no maxAge → cleared on browser close).
    const isOff = seconds === SESSION_OFF;
    const jwtSeconds = isOff ? SESSION_OFF_JWT_SECONDS : seconds;

    // Re-sign with the same identity claims and a fresh iat/exp. We rebuild
    // the payload explicitly rather than re-signing `session` as-is because
    // it still carries the verified token's own `iat`/`exp`, which
    // jsonwebtoken refuses to combine with `expiresIn`.
    const token = jwt.sign(
      {
        userId: session.userId,
        email: session.email,
        primaryNumber: session.primaryNumber,
        publicRole: session.publicRole ?? "user",
        username: session.username,
        sid: session.sid,
      },
      requireSecret(),
      { expiresIn: jwtSeconds }
    );

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      ...(isOff ? {} : { maxAge: seconds }),
    };

    const res = NextResponse.json({ data: { seconds } });
    res.cookies.set(COOKIE_NAME, token, cookieOpts);

    // Keep the companion `uinfo` cookie alive for the same window so the two
    // don't expire out of step.
    const cookieStore = await cookies();
    const uinfo = cookieStore.get(UINFO_COOKIE_NAME)?.value;
    if (uinfo) res.cookies.set(UINFO_COOKIE_NAME, uinfo, cookieOpts);

    return res;
  } catch (err) {
    console.error("session-duration POST error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
