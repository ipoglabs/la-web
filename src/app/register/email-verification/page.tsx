'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegisterStore } from '@/store/registerStore';

export default function EmailVerificationPage() {
  const router = useRouter();
  const { general, emailVerified, setEmailVerified } = useRegisterStore();

  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const autoSentRef = useRef(false);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // Redirect if email is missing
  useEffect(() => {
    if (!general.email) {
      toast.error('Please fill General Information first');
      router.replace('/register');
    }
  }, [general.email, router]);

  // countdown for resend
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  // auto-send OTP on first render
  useEffect(() => {
    if (!general.email || emailVerified) return;
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [general.email, emailVerified]);

  useEffect(() => {
    if (otpInputRef.current) otpInputRef.current.focus();
  }, [otpSent]);

  const sendOtp = async () => {
    if (!general.email) return;
    setLoadingSend(true);
    try {
      const email = general.email.toLowerCase().trim();
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setResendTimeout(60);
        toast.success('OTP sent to your email');
      } else {
        toast.error(data.error || 'Failed to send OTP');
        autoSentRef.current = false;
      }
    } catch {
      toast.error('Something went wrong sending OTP');
      autoSentRef.current = false;
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter the OTP');
    setLoadingVerify(true);
    try {
      const email = general.email.toLowerCase().trim();
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailVerified(true);
        toast.success('Email verified');

        // ✅ Auto redirect to next step after a short delay
        setTimeout(() => {
          router.push('/register/phone-verification');
        }, 1000);
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Step 2: Verify Email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm">
            {otpSent
              ? <>We sent a one-time password (OTP) to <b>{general.email || '—'}</b></>
              : <>Click “Send OTP” to receive a code at <b>{general.email || '—'}</b></>}
          </p>

          <div className="flex gap-2">
            <Input
              ref={otpInputRef}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              aria-label="Email OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <Button onClick={verifyOtp} disabled={loadingVerify}>
              {loadingVerify ? 'Verifying…' : 'Verify'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={sendOtp}
              disabled={resendTimeout > 0 || loadingSend}
            >
              {otpSent
                ? (resendTimeout > 0 ? `Resend (${resendTimeout})` : 'Resend OTP')
                : (loadingSend ? 'Sending…' : 'Send OTP')}
            </Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              Back
            </Button>
          </div>

          {emailVerified && (
            <p className="text-green-600 text-sm">✅ Email verified</p>
          )}

          {/* ✅ Keep manual Next button (useful if page reloads after verify) */}
          <div className="flex justify-end pt-4">
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
