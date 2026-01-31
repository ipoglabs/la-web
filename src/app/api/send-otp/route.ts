// app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import { sendEmailOtp } from "@/lib/sendEmailOtp";
import { generateOtp } from "@/lib/generateOtp";
import otpStore from "@/lib/otpStore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[normalizedEmail] = {
      otp,
      expiresAt,
      verified: false,
      attempts: 0,
      lockedUntil: null,
    };

    // ✅ This waits until Gmail SMTP accepts it (should be quick).
    // Delivery to inbox may still take time depending on Gmail.
    await sendEmailOtp(normalizedEmail, otp);

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
