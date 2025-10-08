import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/generateOtp';
import otpStore from '@/lib/otpStore';
import { sendEmailOtp } from '@/lib/sendEmailOtp'; // your existing mail helper

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[normalizedEmail] = { otp, expiresAt, verified: false };

    await sendEmailOtp(normalizedEmail, otp);

    // Helpful for dev console fallback (don’t do this in prod)
    if ((process.env.NODE_ENV || 'development') === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[DEV EMAIL OTP] ${normalizedEmail} -> ${otp}`);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Send OTP error:', e);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
