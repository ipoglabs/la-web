// app/api/verify-otp/route.ts
import { NextResponse } from 'next/server';
import otpStore from '@/lib/otpStore';

export const runtime = 'nodejs';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;
    const otp = body?.otp;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required', code: 'MISSING' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const rec = otpStore[normalizedEmail];

    if (!rec) {
      return NextResponse.json(
        { error: 'No OTP found for this email. Please resend OTP.', code: 'NOT_FOUND' },
        { status: 400 }
      );
    }

    // 🔒 lock enforcement
    if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
      const retryAfterSeconds = Math.ceil((rec.lockedUntil - Date.now()) / 1000);
      return NextResponse.json(
        {
          error:
            'Too many wrong attempts. Please try again later.',
          code: 'LOCKED',
          retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // ⏰ expiry
    if (Date.now() > rec.expiresAt) {
      return NextResponse.json(
        { error: 'OTP expired. Please resend.', code: 'EXPIRED' },
        { status: 400 }
      );
    }

    // ✅ match?
    const ok = String(otp).trim() === rec.otp;

    if (!ok) {
      // increment attempts, and maybe lock
      const nextAttempts = (rec.attempts || 0) + 1;
      rec.attempts = nextAttempts;

      if (nextAttempts >= MAX_ATTEMPTS) {
        rec.lockedUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
        const retryAfterSeconds = Math.ceil((rec.lockedUntil - Date.now()) / 1000);
        return NextResponse.json(
          {
            error:
              'Too many wrong attempts. Please try again later.',
            code: 'LOCKED',
            retryAfterSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'That code doesn’t match — try again or request a new code.', code: 'INVALID', remain: MAX_ATTEMPTS - nextAttempts },
        { status: 400 }
      );
    }

    // ✅ success: mark verified & clear attempts/lock
    rec.verified = true;
    rec.attempts = 0;
    rec.lockedUntil = null;

    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (e) {
    console.error('Verify OTP error:', e);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
