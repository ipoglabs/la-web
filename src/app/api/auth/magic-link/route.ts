import { NextResponse } from "next/server";
import { sendOtpService } from "@/lib/otpService";

/**
 * POST /api/auth/magic-link
 *
 * Despite the name (kept from the july16 design for UI-copy continuity —
 * "we'll send a magic link" reads better than "we'll send a code"), this
 * sends a real 6-digit email code via the existing Mongo-backed
 * `otpService` (same code path `/api/send-otp` already uses for email
 * verification elsewhere in the app) rather than a clickable link — the
 * corresponding verify step (`/login/verify`, `/register/verify`) always
 * asks for a 6-digit code, never follows a link.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await sendOtpService({ channel: "email", value: email });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("magic-link send error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send code" },
      { status: 500 }
    );
  }
}
