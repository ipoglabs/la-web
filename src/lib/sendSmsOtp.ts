// lib/sendSmsOtp.ts
export async function sendSmsOtp(phone: string, otp: string): Promise<void> {
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  const msg = `Your verification code is ${otp}`;

  if (provider === 'twilio') {
    await sendWithTwilio(phone, msg);
    return;
  }

  // fallback for dev
  console.log(`[DEV SMS] to ${phone}: ${msg}`);
}

async function sendWithTwilio(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    throw new Error('Twilio env missing: TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM');
  }

  const twilio = (await import('twilio')).default(sid, token);

  // sanitize phone → ensure +countrycodeXXXXXXXX format
  const toE164 = normalizeToE164Loose(to);

  await twilio.messages.create({ from, to: toE164, body });
  console.log(`[Twilio SMS] OTP sent → ${toE164}`);
}

export function normalizeToE164Loose(input: string): string {
  return input.replace(/[^\d+]/g, '');
}
