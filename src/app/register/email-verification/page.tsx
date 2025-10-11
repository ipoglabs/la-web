'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegisterStore } from '@/store/registerStore';

const RESEND_COOLDOWN = 30; // seconds
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export default function EmailVerificationPage() {
  const router = useRouter();
  const { general, emailVerified, setEmailVerified } = useRegisterStore();

  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // attempt / lockout state (persist per-email in localStorage)
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const autoSentRef = useRef(false);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  const email = (general.email || '').toLowerCase().trim();
  const lockActive = lockUntil ? Date.now() < lockUntil : false;
  const lockSecondsLeft = lockUntil ? Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000)) : 0;

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      toast.error('Please fill General Information first');
      router.replace('/register');
    }
  }, [email, router]);

  // Load attempt/lock from localStorage (per email)
  useEffect(() => {
    if (!email) return;
    const key = `email-otp-guard:${email}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const { attempts: a, lockUntil: l } = JSON.parse(raw);
        setAttempts(a || 0);
        setLockUntil(l || null);
      } catch {}
    }
  }, [email]);

  // Save attempt/lock
  const persistGuard = (nextAttempts: number, nextLockUntil: number | null) => {
    if (!email) return;
    const key = `email-otp-guard:${email}`;
    localStorage.setItem(
      key,
      JSON.stringify({ attempts: nextAttempts, lockUntil: nextLockUntil })
    );
  };

  // countdown for resend
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  // auto-send OTP once
  useEffect(() => {
    if (!email || emailVerified) return;
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [email, emailVerified]);

  useEffect(() => {
    if (otpSent && otpInputRef.current) otpInputRef.current.focus();
  }, [otpSent]);

  const sendOtp = async () => {
    if (!email) return;
    setLoadingSend(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setResendTimeout(RESEND_COOLDOWN);
        toast.success('We sent a 6-digit code to your email.');
      } else {
        // Map some friendly server messages if provided
        const msg = String(data?.error || '');
        if (/already registered/i.test(msg)) {
          toast.error('This email is already registered. Sign in or choose “Forgot password”.');
        } else {
          toast.error(msg || 'Failed to send code.');
        }
        autoSentRef.current = false;
      }
    } catch {
      toast.error('Something went wrong sending the code.');
      autoSentRef.current = false;
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter the 6-digit code.');
    if (lockActive) {
      return toast.error(
        `We’ve temporarily blocked code attempts for ${Math.ceil(lockSecondsLeft / 60)} minutes for your security.`
      );
    }

    setLoadingVerify(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setEmailVerified(true);
        setAttempts(0);
        setLockUntil(null);
        persistGuard(0, null);
        toast.success('Email verified');

        // Auto redirect to Phone step after a short delay
        setTimeout(() => {
          router.push('/register/phone-verification');
        }, 800);
      } else {
        // Wrong code path – increment attempts and maybe lock
        const nextAttempts = attempts + 1;
        let nextLockUntil: number | null = null;

        if (nextAttempts >= MAX_ATTEMPTS) {
          nextLockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
          toast.error(
            'We’ve temporarily blocked code attempts for 15 minutes for your security. You can try again later or contact support.'
          );
        } else {
          toast.error('That code doesn’t match — try again or request a new code.');
        }

        setAttempts(nextAttempts);
        setLockUntil(nextLockUntil);
        persistGuard(nextAttempts, nextLockUntil);
      }
    } catch {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Step 2 — Email OTP Verification</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            We’ll send a one-time code to confirm it’s you.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm">
            We’ve sent a 6-digit code to <b>{email || '—'}</b>. Enter it below — the code expires in 10 minutes.
          </p>

          {/* Change email link */}
          <div className="text-sm">
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => router.push('/register')}
            >
              Change email
            </button>
          </div>

          <div className="flex gap-2">
            <Input
              ref={otpInputRef}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              aria-label="Email OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={lockActive}
            />
            <Button onClick={verifyOtp} disabled={loadingVerify || lockActive}>
              {loadingVerify ? 'Verifying…' : 'Verify'}
            </Button>
          </div>

          {/* Resend */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={sendOtp}
              disabled={resendTimeout > 0 || loadingSend}
            >
              {resendTimeout > 0 ? `Resend code (${resendTimeout}s)` : 'Resend code'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              Back
            </Button>
          </div>

          {/* Lockout info */}
          {lockActive && (
            <p className="text-sm text-red-600">
              We’ve temporarily blocked code attempts for 15 minutes for your security. You can try again in{' '}
              <b>{lockSecondsLeft}</b> seconds.
            </p>
          )}

          {/* Already verified */}
          {emailVerified && (
            <p className="text-green-600 text-sm">✅ Email verified</p>
          )}

          {/* Manual next, stays disabled until verified */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => router.push('/register/phone-verification')}
              disabled={!emailVerified}
            >
              Next: Verify Phone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
