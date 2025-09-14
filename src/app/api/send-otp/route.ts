import { NextResponse } from 'next/server';
import { sendEmailOtp } from '@/lib/sendEmailOtp';
import { generateOtp } from '@/lib/generateOtp';
import otpStore from '@/lib/otpStore'; // ✅ Use shared store

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[normalizedEmail] = { otp, expiresAt };

    await sendEmailOtp(normalizedEmail, otp);

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
