import { NextResponse } from 'next/server';
import otpStore from '@/lib/otpStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;
    const otp = body?.otp;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const record = otpStore[normalizedEmail];

    if (!record) {
      return NextResponse.json(
        { error: 'No OTP found for this email. Please resend OTP.' },
        { status: 400 }
      );
    }
    if (Date.now() > record.expiresAt) {
      return NextResponse.json({ error: 'OTP expired. Please resend.' }, { status: 400 });
    }
    if (String(otp).trim() !== record.otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    otpStore[normalizedEmail].verified = true;

    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (e) {
    console.error('Verify OTP error:', e);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
