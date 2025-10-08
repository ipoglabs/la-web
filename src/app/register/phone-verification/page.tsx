'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useRegisterStore } from '@/store/registerStore';
import { phoneSchema } from '@/lib/validators';

export default function PhoneVerificationPage() {
  const router = useRouter();
  const { phones, updatePhones, phoneVerified, setPhoneVerified } = useRegisterStore();

  const [otp, setOtp] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // countdown for resend
  useEffect(() => {
    if (resendTimeout <= 0) return;
    const t = setInterval(() => setResendTimeout((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimeout]);

  const sendOtp = async () => {
    // validate numbers (at least primary)
    const parsed = phoneSchema.safeParse(phones);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path.join('.')] = i.message));
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
        setResendTimeout(60);
      } else {
        toast.error(data.error || 'Failed to send SMS OTP');
      }
    } catch {
      toast.error('Something went wrong sending SMS');
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter the SMS OTP');
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
        toast.success('Phone verified');
        router.push('/register/profile-setup');
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
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 3: Mobile Verification</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Primary / secondary numbers */}
          <div>
            <Label>Primary Number *</Label>
            <Input
              placeholder="+65 9xxxxxxx"
              value={phones.primaryNumber}
              onChange={(e) => updatePhones({ primaryNumber: e.target.value })}
              aria-invalid={!!errors.primaryNumber}
            />
            {errors.primaryNumber && (
              <p className="text-sm text-red-600">{errors.primaryNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Secondary Number 1</Label>
              <Input
                placeholder="+65 …"
                value={phones.secondaryNumber1}
                onChange={(e) => updatePhones({ secondaryNumber1: e.target.value })}
              />
            </div>
            <div>
              <Label>Secondary Number 2</Label>
              <Input
                placeholder="+65 …"
                value={phones.secondaryNumber2}
                onChange={(e) => updatePhones({ secondaryNumber2: e.target.value })}
              />
            </div>
          </div>

          {/* Actions: send + verify */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={sendOtp}
              disabled={resendTimeout > 0 || loadingSend}
            >
              {resendTimeout > 0 ? `Resend (${resendTimeout})` : 'Send OTP'}
            </Button>

            <Input
              placeholder="Enter SMS OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={verifyOtp} disabled={loadingVerify}>
              {loadingVerify ? 'Verifying…' : 'Verify'}
            </Button>

            <Button variant="outline" onClick={() => router.push('/register/email-verification')}>
              Back
            </Button>
          </div>

          {phoneVerified && (
            <p className="text-green-600 text-sm">✅ Phone already verified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
