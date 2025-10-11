'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

const DIAL_BY_COUNTRY: Record<string, string> = {
  'United Kingdom': '+44',
  Singapore: '+65',
  India: '+91',
};

export default function PhoneVerificationPage() {
  const router = useRouter();
  const { general, phones, updatePhones, phoneVerified, setPhoneVerified } = useRegisterStore();

  // NEW: controls for revealing secondary fields
  const [showSec1, setShowSec1] = useState<boolean>(!!phones.secondaryNumber1);
  const [showSec2, setShowSec2] = useState<boolean>(!!phones.secondaryNumber2);

  // OTP UX
  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // friendly validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // verified badge for primary
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null);

  // attempts/lock (client-side UX; server should enforce, too)
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const lockActive = lockUntil ? Date.now() < lockUntil : false;
  const lockSecondsLeft = lockUntil ? Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000)) : 0;

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  const countryDial = useMemo(() => {
    const c = (general.country || '').trim();
    return DIAL_BY_COUNTRY[c] || '';
  }, [general.country]);

  // Prefill primary dial code once when empty, based on Step 1 country
  useEffect(() => {
    if (!phones.primaryNumber && countryDial) {
      updatePhones({ primaryNumber: countryDial + ' ' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryDial]);

  // resend countdown
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  // ---------- Guard (persist attempts/lock for this number) ----------
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

  // ---------- Secondary fields controls ----------
  const addSecondary = () => {
    if (!showSec1) {
      setShowSec1(true);
      if (!phones.secondaryNumber1 && countryDial) {
        updatePhones({ secondaryNumber1: `${countryDial} ` });
      }
      return;
    }
    if (!showSec2) {
      setShowSec2(true);
      if (!phones.secondaryNumber2 && countryDial) {
        updatePhones({ secondaryNumber2: `${countryDial} ` });
      }
      return;
    }
  };

  const removeSecondary = (which: 1 | 2) => {
    if (which === 1) {
      setShowSec1(false);
      // keep the value unless you want to clear it:
      // updatePhones({ secondaryNumber1: '' });
    } else {
      setShowSec2(false);
      // updatePhones({ secondaryNumber2: '' });
    }
  };

  // ---------- Actions ----------
  const sendOtp = async () => {
    // Validate at least primary number
    const parsed = phoneSchema.safeParse(phones);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path.join('.')] = i.message));
      if (map.primaryNumber) {
        map.primaryNumber = 'That phone number looks invalid — check the digits and try again.';
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
        body: JSON.stringify({ phone: phones.primaryNumber }),
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
          toast.error('This number is linked to another account. Use a different number or contact support.');
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
    if (lockActive) {
      return toast.error(
        `For security we’ve locked OTP attempts for 15 minutes. You can try again in ${Math.ceil(
          lockSecondsLeft / 60
        )} minutes.`
      );
    }

    setLoadingVerify(true);
    try {
      const res = await fetch('/api/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phones.primaryNumber, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setPhoneVerified(true);
        const when = new Date().toLocaleString();
        setVerifiedAt(when);
        toast.success('Phone verified');
        setTimeout(() => router.push('/register/profile-setup'), 800);
      } else {
        const code = data?.code as string | undefined;

        if (code === 'LOCKED') {
          const secs = Number(data?.retryAfterSeconds || LOCK_MINUTES * 60);
          const until = Date.now() + secs * 1000;
          setLockUntil(until);
          saveGuard(attempts, until);
          toast.error('For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.');
        } else if (code === 'INVALID') {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCK_MINUTES * 60 * 1000;
            setLockUntil(until);
            saveGuard(next, until);
            toast.error('For security we’ve locked OTP attempts for 15 minutes. Need help? Contact support.');
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
          {/* Primary */}
          <div>
            <Label>Primary phone number *</Label>
            <Input
              placeholder="+44 7123 456789"
              value={phones.primaryNumber}
              onChange={(e) => updatePhones({ primaryNumber: e.target.value })}
              aria-invalid={!!errors.primaryNumber}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used to receive OTP and for important notifications — you can hide this on your profile.
            </p>
            {errors.primaryNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.primaryNumber}</p>
            )}
            {phoneVerified && (
              <p className="text-sm text-green-600 mt-1">
                ✅ Verified{verifiedAt ? ` • ${verifiedAt}` : ''}
              </p>
            )}
          </div>

          {/* Secondary controls + fields */}
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
                  <Input
                    placeholder={countryDial ? `${countryDial} …` : '+…'}
                    value={phones.secondaryNumber1}
                    onChange={(e) => updatePhones({ secondaryNumber1: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional — extra number for business or office.
                  </p>
                </div>
              )}

              {showSec2 && (
                <div>
                  <Label>Secondary number 2 (optional)</Label>
                  <Input
                    placeholder={countryDial ? `${countryDial} …` : '+…'}
                    value={phones.secondaryNumber2}
                    onChange={(e) => updatePhones({ secondaryNumber2: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
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
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="max-w-xs"
              inputMode="numeric"
              aria-label="SMS OTP"
              disabled={lockActive}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
            />
            <Button onClick={verifyOtp} disabled={loadingVerify || lockActive}>
              {loadingVerify ? 'Verifying…' : 'Verify'}
            </Button>

            <Button variant="outline" onClick={() => router.push('/register/email-verification')}>
              Back
            </Button>
          </div>

          {/* Lock notice */}
          {lockActive && (
            <p className="text-sm text-red-600">
              For security we’ve locked OTP attempts for 15 minutes. You can try again in <b>{lockSecondsLeft}</b> seconds.
            </p>
          )}

          {/* Optional: “Verify later” for secondaries */}
          <div className="flex justify-end pt-2">
            <Button onClick={() => router.push('/register/profile-setup')} variant="ghost">
              I’ll verify secondary numbers later →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
