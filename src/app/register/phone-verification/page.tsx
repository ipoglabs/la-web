'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useRegisterStore } from '@/store/registerStore';
import { phoneSchema } from '@/lib/validators';

const RESEND_COOLDOWN = 30;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

/** Country code options */
const CODE_OPTIONS = [
  { value: '+65', view: '+65 [SG]' },
  { value: '+95', view: '+95 [IND]' }, // per your ask
  { value: '+44', view: '+44 [UK]' },
  { value: 'mock', view: 'Mock [TEST]' },
] as const;
type CodeValue = (typeof CODE_OPTIONS)[number]['value'];

/** Generic split helper for any stored number */
const splitNumber = (value?: string | null): { code: CodeValue; number: string } => {
  if (!value) return { code: '+65', number: '' }; // default

  if (value.startsWith('mock ')) {
    return { code: 'mock', number: value.slice(5) };
  }

  const m = value.match(/^(\+\d{1,3})\s*(.*)$/);
  if (m) {
    const code = (m[1] as CodeValue) ?? '+65';
    const number = m[2] ?? '';
    return { code, number };
  }

  return { code: '+65', number: value };
};

export default function PhoneVerificationPage() {
  const router = useRouter();
  const { phones, updatePhones, phoneVerified, setPhoneVerified } = useRegisterStore();

  // show/hide secondaries
  const [showSec1, setShowSec1] = useState<boolean>(!!phones.secondaryNumber1);
  const [showSec2, setShowSec2] = useState<boolean>(!!phones.secondaryNumber2);

  // OTP UX
  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // friendly validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // attempts/lock
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const lockActive = lockUntil ? Date.now() < lockUntil : false;
  const lockSecondsLeft = lockUntil
    ? Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))
    : 0;

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- Primary number (code + body) ----------
  const { code: initPrimaryCode, number: initPrimaryBody } = splitNumber(
    phones.primaryNumber
  );
  const [primaryCode, setPrimaryCode] = useState<CodeValue>(initPrimaryCode);
  const [primaryBody, setPrimaryBody] = useState<string>(initPrimaryBody);

  useEffect(() => {
    const composed =
      primaryCode === 'mock'
        ? `mock ${primaryBody.trim()}`
        : `${primaryCode} ${primaryBody.trim()}`.trim();

    updatePhones({ primaryNumber: composed });
  }, [primaryCode, primaryBody, updatePhones]);

  // ---------- Secondary 1 (code + body) ----------
  const { code: initSec1Code, number: initSec1Body } = splitNumber(
    phones.secondaryNumber1
  );
  const [sec1Code, setSec1Code] = useState<CodeValue>(initSec1Code);
  const [sec1Body, setSec1Body] = useState<string>(initSec1Body);

  useEffect(() => {
    if (!showSec1) return;
    const composed =
      sec1Code === 'mock'
        ? `mock ${sec1Body.trim()}`
        : `${sec1Code} ${sec1Body.trim()}`.trim();

    updatePhones({ secondaryNumber1: sec1Body.trim() ? composed : '' });
  }, [sec1Code, sec1Body, showSec1, updatePhones]);

  // ---------- Secondary 2 (code + body) ----------
  const { code: initSec2Code, number: initSec2Body } = splitNumber(
    phones.secondaryNumber2
  );
  const [sec2Code, setSec2Code] = useState<CodeValue>(initSec2Code);
  const [sec2Body, setSec2Body] = useState<string>(initSec2Body);

  useEffect(() => {
    if (!showSec2) return;
    const composed =
      sec2Code === 'mock'
        ? `mock ${sec2Body.trim()}`
        : `${sec2Code} ${sec2Body.trim()}`.trim();

    updatePhones({ secondaryNumber2: sec2Body.trim() ? composed : '' });
  }, [sec2Code, sec2Body, showSec2, updatePhones]);

  // resend countdown
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  // ---------- Guard (persist attempts/lock for this primary) ----------
  const saveGuard = (a: number, l: number | null) => {
    const key = `phone-otp-guard:${phones.primaryNumber || ''}`;
    try {
      localStorage.setItem(key, JSON.stringify({ attempts: a, lockUntil: l }));
    } catch {}
  };

  const loadGuard = () => {
    const key = `phone-otp-guard:${phones.primaryNumber || ''}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const { attempts: a, lockUntil: l } = JSON.parse(raw);
        setAttempts(a || 0);
        setLockUntil(l || null);
      }
    } catch {}
  };

  useEffect(() => {
    loadGuard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phones.primaryNumber]);

  // ---------- Secondary controls ----------
  const addSecondary = () => {
    if (!showSec1) {
      setShowSec1(true);
      return;
    }
    if (!showSec2) {
      setShowSec2(true);
      return;
    }
  };

  const removeSecondary = (which: 1 | 2) => {
    if (which === 1) {
      setShowSec1(false);
      setSec1Body('');
      updatePhones({ secondaryNumber1: '' });
    } else {
      setShowSec2(false);
      setSec2Body('');
      updatePhones({ secondaryNumber2: '' });
    }
  };

  // ---------- Actions ----------
  const sendOtp = async () => {
    const composed =
      primaryCode === 'mock'
        ? `mock ${primaryBody.trim()}`
        : `${primaryCode} ${primaryBody.trim()}`.trim();

    if (!primaryBody.trim()) {
      setErrors({ primaryNumber: 'Enter your phone number.' });
      toast.error('Please fix the phone number');
      return;
    }

    // Mock mode
    if (primaryCode === 'mock') {
      setErrors({});
      toast.success('Mock mode enabled. Use OTP: 111111');
      setResendTimeout(RESEND_COOLDOWN);
      setAttempts(0);
      setLockUntil(null);
      saveGuard(0, null);
      setTimeout(() => otpInputRef.current?.focus(), 50);
      return;
    }

    // Real validation
    const parsed = phoneSchema.safeParse({ ...phones, primaryNumber: composed });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path.join('.')] = i.message));
      if (map.primaryNumber) {
        map.primaryNumber =
          'That phone number looks invalid — check the digits and try again.';
      }
      setErrors(map);
      toast.error('Please fix the phone number');
      return;
    }

    setErrors({});
    setLoadingSend(true);
    try {
      const res = await fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: composed }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('SMS OTP sent to primary number');
        setResendTimeout(RESEND_COOLDOWN);
        setAttempts(0);
        setLockUntil(null);
        saveGuard(0, null);
        setTimeout(() => otpInputRef.current?.focus(), 50);
      } else {
        const msg = String(data?.error || '');
        if (/already.*(used|linked)/i.test(msg)) {
          toast.error(
            'This number is linked to another account. Use a different number or contact support.'
          );
        } else {
          toast.error(msg || 'Failed to send SMS OTP');
        }
      }
    } catch {
      toast.error('Something went wrong sending SMS');
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter the SMS OTP');

    // Mock client-side
    if (primaryCode === 'mock') {
      if (otp === '111111') {
        setPhoneVerified(true);
        toast.success('Phone verified (mock)');
      } else {
        toast.error('Wrong mock code — expected 111111');
      }
      return;
    }

    if (lockActive) {
      return toast.error(
        `For security we’ve locked OTP attempts for 15 minutes. You can try again in ${Math.ceil(
          lockSecondsLeft / 60
        )} minutes.`
      );
    }

    const composed =
      primaryCode === 'mock'
        ? `mock ${primaryBody.trim()}`
        : `${primaryCode} ${primaryBody.trim()}`.trim();

    setLoadingVerify(true);
    try {
      const res = await fetch('/api/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: composed, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setPhoneVerified(true);
        toast.success('Phone verified');
      } else {
        const code = data?.code as string | undefined;

        if (code === 'LOCKED') {
          const secs = Number(data?.retryAfterSeconds || LOCK_MINUTES * 60);
          const until = Date.now() + secs * 1000;
          setLockUntil(until);
          saveGuard(attempts, until);
          toast.error(
            'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.'
          );
        } else if (code === 'INVALID') {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCK_MINUTES * 60 * 1000;
            setLockUntil(until);
            saveGuard(next, until);
            toast.error(
              'For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.'
            );
          } else {
            saveGuard(next, lockUntil);
            toast.error('Wrong code — try again.');
          }
        } else if (code === 'EXPIRED') {
          toast.error('Code expired — request a new one.');
        } else if (code === 'NOT_FOUND') {
          toast.error('No OTP found for this number — please resend the code.');
        } else {
          toast.error(data?.error || 'Invalid OTP');
        }
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setLoadingVerify(false);
    }
  };

  const otpDigitsOnly = (s: string) => s.replace(/\D/g, '').slice(0, 6);
  const canVerify = otp.length === 6 && !loadingVerify && !lockActive;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 3 — Mobile OTP Verification</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Verified phone numbers help buyers trust you.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary with country code dropdown */}
          <div>
            <Label>Primary phone number *</Label>

            <div className="mt-1 flex gap-2">
              <select
                aria-label="Country code"
                value={primaryCode}
                onChange={(e) => setPrimaryCode(e.target.value as CodeValue)}
                className="w-[160px] h-10 rounded-sm border border-gray-700/50 bg-gray-50 px-2 text-sm"
              >
                {CODE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.view}
                  </option>
                ))}
              </select>

              <Input
                placeholder={primaryCode === 'mock' ? 'enter any test number' : 'phone number'}
                value={primaryBody}
                onChange={(e) => setPrimaryBody(e.target.value)}
                aria-invalid={!!errors.primaryNumber}
                className="flex-1"
              />
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Used to receive OTP and for important notifications — you can hide this on your
              profile.
            </p>
            {errors.primaryNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.primaryNumber}</p>
            )}
          </div>

          {/* Secondary controls + fields with same template */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={addSecondary}
                disabled={showSec1 && showSec2}
              >
                {showSec1 && showSec2 ? 'Maximum added' : 'Add secondary number'}
              </Button>
              {showSec1 && (
                <Button type="button" variant="outline" onClick={() => removeSecondary(1)}>
                  Remove #1
                </Button>
              )}
              {showSec2 && (
                <Button type="button" variant="outline" onClick={() => removeSecondary(2)}>
                  Remove #2
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showSec1 && (
                <div>
                  <Label>Secondary number 1 (optional)</Label>
                  <div className="mt-1 flex gap-2">
                    <select
                      aria-label="Country code secondary 1"
                      value={sec1Code}
                      onChange={(e) => setSec1Code(e.target.value as CodeValue)}
                      className="w-[130px] h-10 rounded-sm border border-gray-700/50 bg-gray-50 px-2 text-sm"
                    >
                      {CODE_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.view}
                        </option>
                      ))}
                    </select>

                    <Input
                      placeholder="phone number"
                      value={sec1Body}
                      onChange={(e) => setSec1Body(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional — extra number for business or office.
                  </p>
                </div>
              )}

              {showSec2 && (
                <div>
                  <Label>Secondary number 2 (optional)</Label>
                  <div className="mt-1 flex gap-2">
                    <select
                      aria-label="Country code secondary 2"
                      value={sec2Code}
                      onChange={(e) => setSec2Code(e.target.value as CodeValue)}
                      className="w-[130px] h-10 rounded-sm border border-gray-700/50 bg-gray-50 px-2 text-sm"
                    >
                      {CODE_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.view}
                        </option>
                      ))}
                    </select>

                    <Input
                      placeholder="phone number"
                      value={sec2Body}
                      onChange={(e) => setSec2Body(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OTP + Verify */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={sendOtp}
              disabled={resendTimeout > 0 || loadingSend}
            >
              {resendTimeout > 0 ? `Resend code (${resendTimeout}s)` : 'Send OTP'}
            </Button>

            <Input
              ref={otpInputRef}
              placeholder={primaryCode === 'mock' ? 'Enter 111111 (mock)' : 'Enter 6-digit code'}
              value={otp}
              onChange={(e) => setOtp(otpDigitsOnly(e.target.value))}
              className="max-w-xs"
              inputMode="numeric"
              maxLength={6}
              aria-label="SMS OTP"
              disabled={lockActive}
              onKeyDown={(e) => e.key === 'Enter' && canVerify && verifyOtp()}
            />

            <Button onClick={verifyOtp} disabled={!canVerify}>
              {loadingVerify ? 'Verifying…' : 'Verify'}
            </Button>
          </div>

          {phoneVerified && (
            <p className="text-green-600 text-sm -mt-2">✅ Phone verified successfully</p>
          )}

          {lockActive && (
            <p className="text-sm text-red-600">
              For security we’ve locked OTP attempts for 15 minutes. You can try again in{' '}
              <b>{lockSecondsLeft}</b> seconds.
            </p>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/register/email-verification')}
            >
              Back
            </Button>

            <Button
              onClick={() => router.push('/register/profile-setup')}
              disabled={!phoneVerified}
            >
              Next: Profile Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 
// Template SMS content:
// Lokalads verification code: 123456 — valid for 10 minutes. Do not share this code with anyone.