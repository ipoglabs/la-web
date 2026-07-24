/**
 * app/api/auth/sessions/revoke-others/route.ts
 *
 * POST /api/auth/sessions/revoke-others — "Sign out of all other devices"
 * in account-settings. Revokes every active Session for the caller except
 * the one making this request; leaves the current device's cookie intact.
 *
 * Responses:
 *   200 { data: { revokedCount: number } }
 *   401 { error }         — not signed in
 *   500 { error }         — server error
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/session";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const result = await Session.updateMany(
      { userId: session.userId, revokedAt: null, sessionId: { $ne: session.sid ?? "__none__" } },
      { $set: { revokedAt: new Date() } }
    );

    return NextResponse.json({ data: { revokedCount: result.modifiedCount ?? 0 } });
  } catch (err) {
    console.error("session revoke-others error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
