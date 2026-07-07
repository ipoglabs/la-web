import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import { getSession } from "@/lib/auth";
import { sendOtpService } from "@/lib/otpService";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const session = await getSession();

    const userId = session?.userId; // optional for register

    await sendOtpService({
      userId,
      channel: body.channel || "email",
      value: body.value || body.email,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to send OTP" },
      { status: 400 }
    );
  }
}