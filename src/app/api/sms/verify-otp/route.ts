import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { phone, otp } = await req.json();
  if (!phone || !otp)
    return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SID!;
  const twilio = (await import("twilio")).default(sid, token);

  try {
    const result = await twilio.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code: otp,
    });

    if (result.status === "approved") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Verify check error:", err);
    return NextResponse.json({ error: err.message ?? "Verification failed" }, { status: 500 });
  }
}
