// app/api/register/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// OTP stores
import otpStore from '@/lib/otpStore';            // Email OTP store (you already have this)
import otpPhoneStore from '@/lib/otpPhoneStore';  // Phone OTP store (new)

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
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
    } = body ?? {};

    // Basic required fields
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

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = String(primaryNumber).trim();

    // ✅ Verify email OTP
    const emailRec = otpStore[normalizedEmail];
    if (!emailRec || emailRec.verified !== true) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 400 });
    }

    // ✅ Verify phone OTP (primary)
    const phoneRec = otpPhoneStore[normalizedPhone];
    if (!phoneRec || phoneRec.verified !== true) {
      return NextResponse.json({ error: 'Phone not verified' }, { status: 400 });
    }

    // 🚫 Uniqueness checks
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });
    if (existing) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(String(password), 12);

    // 💾 Create user
    const newUser = new User({
      username,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      residency,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      provider: 'credentials',
      isEmailVerified: true,
      isPhoneVerified: true,
      phones: {
        primary: normalizedPhone,
        secondary1: secondaryNumber1 || null,
        secondary2: secondaryNumber2 || null,
      },
    });

    await newUser.save();

    // 🧹 Cleanup OTPs after success
    delete otpStore[normalizedEmail];
    delete otpPhoneStore[normalizedPhone];

    // 🎟️ JWT
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

    return NextResponse.json(
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
  } catch (e) {
    console.error('Register Error:', e);
    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
}
