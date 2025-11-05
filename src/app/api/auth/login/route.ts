// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/user';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  if (!user.isEmailVerified) {
    return NextResponse.json({ error: 'Please verify your email before logging in.' }, { status: 403 });
  }

  const token = jwt.sign(
    { id: String(user._id), email: user.email, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  // Build response and set the HTTP-only cookie
  const res = NextResponse.json({
    message: 'Login successful',
    // You can omit returning the token to clients if you only use cookies:
    user: {
      id: String(user._id),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',                 // cookie available to the whole app
    maxAge: 60 * 60 * 24 * 7,  // 7 days
  });

  return res;
}
