import connectDB from '@/lib/dbConnect';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import otpStore from '@/lib/otpStore'; // ✅ Use this

export async function POST(req: Request) {
  await connectDB();
  const { userId, otp } = await req.json();

  const storedOtp = otpStore[userId]; // ✅ use the imported otpStore
  if (!storedOtp || storedOtp.otp !== otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  await User.findByIdAndUpdate(userId, { isEmailVerified: true });
  delete otpStore[userId]; // ✅ delete from imported store

  return NextResponse.json({ success: true });
}
