import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // your mongo connect helper
import User from '@/models/user';
import { hash } from 'bcryptjs';

function stripEmpty(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // sanitize / trim
    const payload = stripEmpty({
      firstName: String(body.firstName || '').trim(),
      lastName: String(body.lastName || '').trim(),
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: String(body.gender || '').trim() || 'other',

      // optional fields: keep only if provided
      nationality: body.nationality ? String(body.nationality).trim() : undefined,
      country: body.country ? String(body.country).trim() : undefined,
      state: body.state ? String(body.state).trim() : undefined,
      residency: body.residency ? String(body.residency).trim() : undefined,

      email: String(body.email || '').toLowerCase().trim(),

      primaryNumber: String(body.primaryNumber || '').trim(),
      secondaryNumber1: body.secondaryNumber1 ? String(body.secondaryNumber1).trim() : undefined,
      secondaryNumber2: body.secondaryNumber2 ? String(body.secondaryNumber2).trim() : undefined,

      username: String(body.username || '').trim(),
      password: String(body.password || ''),
      role: String(body.role || 'user'),

      marketingOptIn: !!body.subscribe,
    });

    // required server-side (these are essential)
    const missing: string[] = [];
    if (!payload.firstName) missing.push('firstName');
    if (!payload.lastName) missing.push('lastName');
    if (!payload.dateOfBirth) missing.push('dateOfBirth');
    if (!payload.email) missing.push('email');
    if (!payload.primaryNumber) missing.push('primaryNumber');
    if (!payload.username) missing.push('username');
    if (!payload.password) missing.push('password');

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // hash password
    const passwordHash = await hash(payload.password, 10);

    const created = await User.create({
      ...payload,
      password: passwordHash,
      isEmailVerified: true,  // set as needed
      isPhoneVerified: true,  // set as needed
    });

    return NextResponse.json(
      {
        user: {
          id: created._id,
          username: created.username,
          email: created.email,
        },
        token: 'mock-jwt', // generate your real token here
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return NextResponse.json(
        { error: `That ${field} is already in use.` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
