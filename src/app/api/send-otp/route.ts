// app/api/send-otp/route.ts
import { NextResponse } from 'next/server';
import { sendEmailOtp } from '@/lib/sendEmailOtp';
import { generateOtp } from '@/lib/generateOtp';
import otpStore from '@/lib/otpStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const normalizedEmail = String(email).toLowerCase().trim();
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    otpStore[normalizedEmail] = {
      otp,
      expiresAt,
      verified: false,
      attempts: 0,       // 🔄 reset attempts on resend
      lockedUntil: null, // 🔄 clear any lock on resend
    };

    await sendEmailOtp(normalizedEmail, otp);
    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
