// app/api/sms/send-otp/route.ts
import { NextResponse } from 'next/server';
import phoneAttemptStore from '@/lib/phoneAttemptStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({} as any));
  if (!phone) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  const normalized = String(phone).trim();

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SID!;
  const twilio = (await import('twilio')).default(sid, token);

  try {
    const verification = await twilio.verify.v2
      .services(verifySid)
      .verifications.create({
        to: normalized, // e.g. +447911123456
        channel: 'sms',
      });

    // ✅ Reset attempts & lock on (re)send so user gets a clean slate for this code
    phoneAttemptStore[normalized] = { attempts: 0, lockedUntil: null };

    // Optional: you can surface verification.status if needed
    // console.log(`[Twilio Verify] Sent to ${normalized}:`, verification.status);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Verify send error:', err);
    // Provide cleaner messages for common Twilio errors
    const msg =
      err?.message ||
      (err?.code === 20003
        ? 'Authentication error with SMS provider'
        : 'Failed to send OTP');
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
