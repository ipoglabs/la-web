'use client';

import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  // If user reloads and email is missing, send them back to Step 1
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

  const sendOtp = async () => {
    if (!general.email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: general.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('OTP sent to your email');
        setResendTimeout(60);
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch {
      toast.error('Something went wrong sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter the OTP');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: general.email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailVerified(true);
        toast.success('Email verified');
        router.push('/register/phone-verification');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch {
      toast.error('Verification failed');
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
            We sent a one-time password (OTP) to <b>{general.email || '—'}</b>
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              aria-label="Email OTP"
            />
            <Button onClick={verifyOtp}>Verify</Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={sendOtp}
              disabled={resendTimeout > 0 || loading}
            >
              {resendTimeout > 0 ? `Resend (${resendTimeout})` : 'Resend OTP'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/register')}>
              Back
            </Button>
          </div>

          {emailVerified && (
            <p className="text-green-600 text-sm">✅ Email already verified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
