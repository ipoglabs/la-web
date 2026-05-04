// app/api/sms/send-otp/route.ts
import { NextResponse } from 'next/server';
import phoneAttemptStore from '@/lib/phoneAttemptStore';

export const runtime = 'nodejs';

/* ---------------- NORMALIZE ---------------- */
function normalizePhone(phone: string) {
  if (!phone) throw new Error('Phone is required');

  // mock support
  if (phone.startsWith('mock')) return phone;

  const cleaned = phone.replace(/\s+/g, '');

  if (!/^\+\d{10,15}$/.test(cleaned)) {
    throw new Error('Invalid phone format. Use +<countrycode><number>');
  }

  return cleaned;
}

/* ---------------- API ---------------- */
export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({} as any));

  if (!phone) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  let normalized: string;

  try {
    normalized = normalizePhone(String(phone));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  console.log('FINAL PHONE SENT:', normalized);

  // Mock mode
  if (normalized.startsWith('mock')) {
    phoneAttemptStore[normalized] = { attempts: 0, lockedUntil: null };
    return NextResponse.json({ success: true, mock: true });
  }

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SID!;
  const twilio = (await import('twilio')).default(sid, token);

  try {
    await twilio.verify.v2.services(verifySid).verifications.create({
      to: normalized,
      channel: 'sms',
    });

    phoneAttemptStore[normalized] = { attempts: 0, lockedUntil: null };

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Verify send error:', err);

    return NextResponse.json(
      {
        error:
          err?.code === 20003
            ? 'Authentication error with SMS provider'
            : err?.message || 'Failed to send OTP',
      },
      { status: 500 }
    );
  }
}