import { NextResponse } from "next/server";
import { sendOtpService } from "@/lib/otpService";

/**
 * POST /api/auth/phone/send-otp { phone }
 *
 * Real, Mongo-backed OTP record via `otpService`'s existing phone channel.
 * NOTE: SMS delivery itself isn't wired to a provider yet (no Twilio/MSG91
 * etc.) — this is a pre-existing gap in `otpService.ts`, not something
 * this port introduced. In dev, the generated code is returned so the flow
 * is testable end to end; in production this currently throws until a
 * real SMS provider is added — see `otpService.ts` header.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const phone = String(body?.phone || "").trim();

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const result = await sendOtpService({ channel: "phone", value: phone });

    return NextResponse.json({ success: true, ...(result.devCode ? { devCode: result.devCode } : {}) });
  } catch (err: any) {
    console.error("phone send-otp error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send code" },
      { status: 500 }
    );
  }
}
