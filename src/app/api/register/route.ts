import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpStore from '@/lib/otpStore';

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      username,
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
    } = await req.json();

    // Validate required fields
    if (!username || !firstName || !lastName || !dateOfBirth || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Verify OTP
    const otpRecord = otpStore[normalizedEmail];
    if (!otpRecord || otpRecord.verified !== true) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // ✅ Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Create and save user
    const newUser = new User({
      username,
      firstName,
      lastName,
      dateOfBirth,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: true,
      provider: 'credentials',
    });

    await newUser.save();

    // ✅ Clean up OTP after success
    delete otpStore[normalizedEmail];

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      process.env.JWT_SECRET!,
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
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
}
