import { NextResponse } from "next/server";
import { sendOtpService } from "@/lib/otpService";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const trimmed = String(email || "").trim().toLowerCase();
    if (!trimmed) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await sendOtpService({ channel: "email", value: trimmed });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}