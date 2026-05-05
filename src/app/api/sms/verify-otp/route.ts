// app/api/sms/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import phoneAttemptStore from '@/lib/phoneAttemptStore';

export const runtime = 'nodejs';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

/* ---------------- NORMALIZE ---------------- */
function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, '');
}

/* ---------------- VALIDATE ---------------- */
function isValidPhone(phone: string) {
  return /^\+\d{10,15}$/.test(phone);
}

/* ---------------- MOCK CHECK ---------------- */
/**
 * Only allow mock in NON-PROD
 * Only allow valid Indian numbers
 */
function isIndiaMock(phone: string) {
  return (
    process.env.NODE_ENV !== 'production' &&
    /^\+91\d{10}$/.test(phone)
  );
}

export async function POST(req: Request) {
  const { phone, otp } = await req.json().catch(() => ({} as any));

  if (!phone || !otp) {
    return NextResponse.json(
      { error: 'Phone and OTP required', code: 'MISSING' },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(String(phone));

  /* ❌ BLOCK INVALID PHONE */
  if (!isValidPhone(normalized)) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 }
    );
  }

  /* ---------------- GUARD ---------------- */
  const guard = (phoneAttemptStore[normalized] ||= {
    attempts: 0,
    lockedUntil: null,
  });

  /* ---------------- LOCK CHECK ---------------- */
  if (guard.lockedUntil && Date.now() < guard.lockedUntil) {
    const retryAfterSeconds = Math.ceil(
      (guard.lockedUntil - Date.now()) / 1000
    );

    return NextResponse.json(
      {
        error:
          'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.',
        code: 'LOCKED',
        retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  /* =========================================================
     ✅ INDIA MOCK FLOW
     ========================================================= */
  if (isIndiaMock(normalized)) {
    console.log('[MOCK VERIFY] India test mode:', normalized);

    if (String(otp).trim() === '111111') {
      // ✅ SUCCESS
      cookies().set('reg_phone_v', normalized, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60,
        path: '/',
      });

      guard.attempts = 0;
      guard.lockedUntil = null;

      return NextResponse.json({ success: true });
    }

    // ❌ WRONG OTP
    guard.attempts++;

    if (guard.attempts >= MAX_ATTEMPTS) {
      guard.lockedUntil = Date.now() + LOCK_MINUTES * 60 * 1000;

      const retryAfterSeconds = Math.ceil(
        (guard.lockedUntil - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          error:
            'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.',
          code: 'LOCKED',
          retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Wrong code — expected 111111',
        code: 'INVALID',
        remain: Math.max(0, MAX_ATTEMPTS - guard.attempts),
      },
      { status: 400 }
    );
  }

  /* =========================================================
     ✅ REAL FLOW (TWILIO)
     ========================================================= */
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SID!;
  const twilio = (await import('twilio')).default(sid, token);

  try {
    const result = await twilio.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: normalized,
        code: String(otp).trim(),
      });

    if (result.status === 'approved') {
      cookies().set('reg_phone_v', normalized, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60,
        path: '/',
      });

      guard.attempts = 0;
      guard.lockedUntil = null;

      return NextResponse.json({ success: true });
    }

    // ❌ WRONG OTP
    guard.attempts++;

    if (guard.attempts >= MAX_ATTEMPTS) {
      guard.lockedUntil = Date.now() + LOCK_MINUTES * 60 * 1000;

      const retryAfterSeconds = Math.ceil(
        (guard.lockedUntil - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          error:
            'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.',
          code: 'LOCKED',
          retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Wrong code — try again.',
        code: 'INVALID',
        remain: Math.max(0, MAX_ATTEMPTS - guard.attempts),
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Verify check error:', err);

    const raw = String(err?.message || '').toLowerCase();

    if (raw.includes('max check attempts reached')) {
      const until = Date.now() + LOCK_MINUTES * 60 * 1000;

      phoneAttemptStore[normalized] = {
        attempts: MAX_ATTEMPTS,
        lockedUntil: until,
      };

      const retryAfterSeconds = Math.ceil(
        (until - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          error:
            'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.',
          code: 'LOCKED',
          retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    if (raw.includes('expired')) {
      return NextResponse.json(
        { error: 'Code expired — request a new one.', code: 'EXPIRED' },
        { status: 400 }
      );
    }

    if (raw.includes('no pending verifications') || raw.includes('not found')) {
      return NextResponse.json(
        {
          error: 'No OTP found for this number — please resend the code.',
          code: 'NOT_FOUND',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? 'Verification failed' },
      { status: 500 }
    );
  }
}