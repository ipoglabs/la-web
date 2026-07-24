/**
 * app/api/auth/sessions/route.ts
 *
 * GET /api/auth/sessions — lists the caller's active (non-revoked) device
 * sessions for the account-settings "Login and Security" Devices list.
 *
 * Responses:
 *   200 { data: { sessions: DeviceSession[] } }
 *   401 { error }        — not signed in
 *   500 { error }         — server error
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Session from "@/models/session";

type SessionDoc = {
  sessionId: string;
  deviceLabel?: string;
  ip?: string;
  createdAt?: Date;
  lastActiveAt?: Date;
};

function maskIp(ip: string): string {
  if (!ip) return "Unknown location";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.•`;
  return ip.length > 12 ? `${ip.slice(0, 12)}…` : ip;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const docs = await Session.find({ userId: session.userId, revokedAt: null })
      .sort({ lastActiveAt: -1 })
      .select("sessionId deviceLabel ip createdAt lastActiveAt")
      .lean<SessionDoc[]>();

    const sessions = docs.map((doc) => ({
      sessionId: doc.sessionId,
      deviceLabel: doc.deviceLabel || "Unknown device",
      location: maskIp(doc.ip || ""),
      createdAtIso: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
      lastActiveAtIso: doc.lastActiveAt ? new Date(doc.lastActiveAt).toISOString() : null,
      isCurrent: doc.sessionId === session.sid,
    }));

    return NextResponse.json({ data: { sessions } });
  } catch (err) {
    console.error("sessions list error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
