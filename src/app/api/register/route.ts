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
      // Step 1 – General
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      residency,
      email,
      // Step 3 – Phones
      primaryNumber,
      secondaryNumber1,
      secondaryNumber2,
      // Step 4 – Profile
      username,
      password,
      role,
      // optional
      subscribe,
    } = body ?? {};

    // Required checks
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !nationality ||
      !residency ||
      !email ||
      !username ||
      !password ||
      !role ||
      !primaryNumber
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Normalize
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = String(primaryNumber).trim();
    const normalizedUsername = String(username).trim();

    // ✅ Safely read cookies (cache the store; use optional chaining + nullish coalescing)
    const cookieStore = cookies();
    const regEmailCookie = cookieStore.get('reg_email_v')?.value ?? null;
    const regPhoneCookie = cookieStore.get('reg_phone_v')?.value ?? null;

    // Email verified? (cookie OR in-memory store)
    const emailRec = otpStore[normalizedEmail];
    const emailIsVerified =
      (emailRec && emailRec.verified === true) || regEmailCookie === normalizedEmail;

    if (!emailIsVerified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 400 });
    }

    // Phone verified? (cookie OR in-memory store)
    const phoneRec = otpPhoneStore?.[normalizedPhone];
    const phoneIsVerified =
      (phoneRec && phoneRec.verified === true) || regPhoneCookie === normalizedPhone;

    if (!phoneIsVerified) {
      return NextResponse.json({ error: 'Phone not verified' }, { status: 400 });
    }

    // Uniqueness checks
    const usernameExists = await User.findOne({ username: normalizedUsername }).select('_id').lean();
    if (usernameExists) {
      return NextResponse.json(
        { error: 'Sorry, that username is already taken please try some other name', code: 'USERNAME_TAKEN' },
        { status: 400 }
      );
    }

    const emailExists = await User.findOne({ email: normalizedEmail }).select('_id').lean();
    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already registered. Sign in or choose “Forgot password”.', code: 'EMAIL_TAKEN' },
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

    // Hash + create user
    const hashedPassword = await bcrypt.hash(String(password), 12);

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

    // Clear cookies safely
    res.cookies.set('reg_email_v', '', { maxAge: 0, path: '/' });
    res.cookies.set('reg_phone_v', '', { maxAge: 0, path: '/' });

    // Clear in-memory OTP stores (optional)
    if (otpStore[normalizedEmail]) delete otpStore[normalizedEmail];
    if (otpPhoneStore && otpPhoneStore[normalizedPhone]) delete otpPhoneStore[normalizedPhone];

    return res;
  } catch (e) {
    console.error('Register Error:', e);
    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
}
