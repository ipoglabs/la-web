import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import { getSession } from "@/lib/auth";
import { verifyOtpService } from "@/lib/otpService";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const session = await getSession();

    const userId = session?.userId;

    await verifyOtpService({
      userId,
      channel: body.channel || "email",
      value: body.value || body.email,
      otp: body.otp,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Verification failed" },
      { status: 400 }
    );
  }
}