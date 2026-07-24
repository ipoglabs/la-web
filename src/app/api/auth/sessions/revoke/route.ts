/**
 * app/api/auth/sessions/revoke/route.ts
 *
 * POST /api/auth/sessions/revoke { sessionId } — signs out one device from
 * the account-settings Devices list. Revoking the caller's OWN current
 * device also clears its cookies (full local sign-out); revoking another
 * device just marks its Session record revoked — that device's next
 * request re-validates against the DB (see lib/userSession.ts) and drops
 * to logged-out.
 *
 * Responses:
 *   200 { data: { revoked: true, signedOutCurrentDevice: boolean } }
 *   400 { error }         — missing sessionId
 *   401 { error }         — not signed in
 *   404 { error }         — session not found / not yours
 *   500 { error }         — server error
 */
import { NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const sessionId = String(body?.sessionId || "");
    if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });

    await dbConnect();

    const target = await Session.findOne({ sessionId, userId: session.userId, revokedAt: null });
    if (!target) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const isCurrentDevice = sessionId === session.sid;

    if (isCurrentDevice) {
      // Also clears the browser's cookies, not just the DB record.
      await clearSession();
    } else {
      target.revokedAt = new Date();
      await target.save();
    }

    return NextResponse.json({ data: { revoked: true, signedOutCurrentDevice: isCurrentDevice } });
  } catch (err) {
    console.error("session revoke error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
