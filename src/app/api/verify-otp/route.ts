import { NextResponse } from 'next/server';
import otpStore from '@/lib/otpStore';

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const record = otpStore[normalizedEmail];

  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  otpStore[normalizedEmail].verified = true;

  return NextResponse.json({ success: true, message: 'OTP verified' });
}
