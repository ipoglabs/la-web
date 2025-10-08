import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone is required" }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SID!;
  const twilio = (await import("twilio")).default(sid, token);

  try {
    const verification = await twilio.verify.v2.services(verifySid).verifications.create({
      to: phone, // e.g. +447911123456
      channel: "sms",
    });
    console.log(`[Twilio Verify] Sent to ${phone}:`, verification.status);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verify send error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to send OTP" }, { status: 500 });
  }
}
