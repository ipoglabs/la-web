// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import otpStore from '@/lib/otpStore';
import otpPhoneStore from '@/lib/otpPhoneStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => ({} as any));
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      residency,
      email,
      primaryNumber,
      secondaryNumber1,
      secondaryNumber2,
      username,
      password,
      role,
      subscribe,
    } = body ?? {};

    // Required checks
    if (
      !firstName || !lastName || !dateOfBirth || !gender || !nationality ||
      !residency || !email || !username || !password || !role || !primaryNumber
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Normalize
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = String(primaryNumber).trim();
    const normalizedUsername = String(username).trim();

    // Read cookies
    const cookieStore = cookies();
    const regEmailCookie = cookieStore.get('reg_email_v')?.value ?? null;
    const regPhoneCookie = cookieStore.get('reg_phone_v')?.value ?? null;

    // Clear cookies from request context (preemptively)
    cookieStore.delete('reg_email_v');
    cookieStore.delete('reg_phone_v');

    // Email verified?
    const emailRec = otpStore[normalizedEmail];
    const emailIsVerified =
      (emailRec?.verified === true) || regEmailCookie === normalizedEmail;

    if (!emailIsVerified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 400 });
    }

    // Phone verified?
    const phoneRec = otpPhoneStore?.[normalizedPhone];
    const phoneIsVerified =
      (phoneRec?.verified === true) || regPhoneCookie === normalizedPhone;

    if (!phoneIsVerified) {
      return NextResponse.json({ error: 'Phone not verified' }, { status: 400 });
    }

    // Uniqueness checks
    const usernameExists = await User.findOne({ username: normalizedUsername }).select('_id').lean();
    if (usernameExists) {
      return NextResponse.json(
        { error: 'Sorry, that username is already taken. Please try another.', code: 'USERNAME_TAKEN' },
        { status: 400 }
      );
    }

    const emailExists = await User.findOne({ email: normalizedEmail }).select('_id').lean();
    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already registered. Sign in or use “Forgot password”.', code: 'EMAIL_TAKEN' },
        { status: 400 }
      );
    }

    const phoneExists = await User.findOne({ primaryNumber: normalizedPhone }).select('_id').lean();
    if (phoneExists) {
      return NextResponse.json(
        { error: 'This number is linked to another account. Use a different number or contact support.', code: 'PHONE_TAKEN' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(String(password), 12);

    // Create user
    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      residency,
      email: normalizedEmail,
      isEmailVerified: true,
      isPhoneVerified: true,
      primaryNumber: normalizedPhone,
      secondaryNumber1: secondaryNumber1 || null,
      secondaryNumber2: secondaryNumber2 || null,
      provider: 'credentials',
      ...(typeof subscribe === 'boolean' ? { marketingOptIn: subscribe } : {}),
    });

    await newUser.save();

    // Create JWT
    const token = jwt.sign(
      {
        userId: String(newUser._id),
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Prepare response
    const res = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
    );

    // Clear cookies in response
    res.cookies.delete('reg_email_v');
    res.cookies.delete('reg_phone_v');

    // Clear in-memory OTP stores
    delete otpStore[normalizedEmail];
    delete otpPhoneStore?.[normalizedPhone];

    return res;
  } catch (e) {
    console.error('Register Error:', e);
    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
}
