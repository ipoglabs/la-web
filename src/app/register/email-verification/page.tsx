'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegisterStore } from '@/store/registerStore';

const RESEND_COOLDOWN = 30;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export default function EmailVerificationPage() {
  const router = useRouter();
  const { general, emailVerified, setEmailVerified } = useRegisterStore();

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const autoSentRef = useRef(false);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  const email = (general.email || '').trim().toLowerCase();

  const lockActive = lockUntil ? Date.now() < lockUntil : false;
  const lockSecondsLeft = lockUntil ? Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000)) : 0;

  function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visible = name.slice(0, 2);

  return `${visible}****@${domain}`;
}

  /** ✅ Load attempts/lock state */
  useEffect(() => {
    if (!email) return;
    const key = `email-otp-guard:${email}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const { attempts, lockUntil } = JSON.parse(raw);
        setAttempts(attempts || 0);
        setLockUntil(lockUntil || null);
      } catch {}
    }
  }, [email]);

  /** ✅ Auto-send OTP once */
  useEffect(() => {
    if (!email || emailVerified) return;
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [email, emailVerified]);

  /** ✅ Focus OTP input after sent */
  useEffect(() => {
    if (otpSent && otpInputRef.current) otpInputRef.current.focus();
  }, [otpSent]);

  /** ✅ Resend cooldown */
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  const persistGuard = (nextAttempts: number, nextLockUntil: number | null) => {
    const key = `email-otp-guard:${email}`;
    localStorage.setItem(key, JSON.stringify({ attempts: nextAttempts, lockUntil: nextLockUntil }));
  };

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
        toast.error(data?.error || 'Failed to send code');
        autoSentRef.current = false;
      }
    } catch {
      toast.error('Failed to send code.');
      autoSentRef.current = false;
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return;

    if (lockActive) {
      toast.error(`Too many attempts. Try again in ${Math.ceil(lockSecondsLeft / 60)} minutes.`);
      return;
    }

    setLoadingVerify(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

     if (res.ok) {
        setEmailVerified(true);

        setAttempts(0);

        setLockUntil(null);

        persistGuard(0, null);

        toast.success('Email verified ✅');

        // auto navigate
        setTimeout(() => {
          router.push('/register/phone-verification');
        }, 800);
      } else {
        const nextAttempts = attempts + 1;
        let nextLockUntil: number | null = null;

        if (nextAttempts >= MAX_ATTEMPTS) {
          nextLockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
          toast.error('Too many attempts. Locked for 15 minutes.');
        } else {
          toast.error('Incorrect code. Try again.');
        }

        setAttempts(nextAttempts);
        setLockUntil(nextLockUntil);
        persistGuard(nextAttempts, nextLockUntil);
      }
    } catch {
      toast.error('Verification failed.');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
    <Card className="w-full max-w-md shadow-sm border-border/60">
      
      <CardHeader className="space-y-3 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">
            Verify your email
          </CardTitle>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Sent to{" "}
              <span className="font-medium text-foreground">
                {maskEmail(email)}
              </span>
            </p>

            <span className="text-muted-foreground">·</span>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* VERIFIED SUCCESS */}
        {emailVerified ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm text-green-700 text-center font-medium">
              ✅ Email verified successfully
            </p>
          </div>
        ) : (
          <>
            {/* OTP INPUT */}
            <div className="space-y-3">

              <Input
                ref={otpInputRef}
                placeholder="Enter 6-digit code"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  otp.length === 6 &&
                  verifyOtp()
                }
                inputMode="numeric"
                disabled={lockActive || loadingVerify}
                className="text-center text-lg tracking-[0.35em] font-medium"
              />

              {/* VERIFYING */}
              {loadingVerify && (
                <p className="text-sm text-muted-foreground text-center">
                  Verifying&hellip;
                </p>
              )}

              {/* LOCK */}
              {lockActive && (
                <p className="text-sm text-red-600 text-center">
                  Locked for security. Try again in{" "}
                  <span className="font-semibold">
                    {lockSecondsLeft}s
                  </span>
                </p>
              )}

              {/* VERIFY BUTTON */}
              <Button
                className="w-full"
                onClick={verifyOtp}
                disabled={
                  otp.length !== 6 ||
                  loadingVerify ||
                  lockActive
                }
              >
                {loadingVerify ? "Verifying…" : "Verify"}
              </Button>
            </div>

            {/* RESEND */}
            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-muted-foreground">
                Didn&apos;t receive it?
              </span>

              {resendTimeout > 0 ? (
                <span className="text-muted-foreground">
                  Resend in{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {resendTimeout}s
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loadingSend}
                  className="font-medium text-foreground hover:underline transition-colors disabled:opacity-50"
                >
                  {loadingSend ? "Sending…" : "Resend"}
                </button>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => router.push("/register")}
        >
          Back
        </Button>

        <Button
          onClick={() =>
            router.push("/register/phone-verification")
          }
          disabled={!emailVerified}
        >
          Next
        </Button>
      </CardFooter> */}
    </Card>
  </div>
);
}
