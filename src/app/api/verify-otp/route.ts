import { NextResponse } from "next/server";
import { verifyOtpService } from "@/lib/otpService";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const trimmed = String(email || "").trim().toLowerCase();
    const code = String(otp || "").trim();

    if (!trimmed || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    await verifyOtpService({ channel: "email", value: trimmed, otp: code });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: err?.message || "Invalid code" },
      { status: 400 }
    );
  }
}