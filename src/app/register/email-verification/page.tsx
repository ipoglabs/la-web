'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Access localStorage only on the client
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error('No user ID found. Please register again.');
      router.push('/register');
    }
  }, []);

  const handleVerify = async () => {
    if (!userId) {
      toast.error('User ID missing');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success('Email verified!');
      router.push('/');
    } else {
      toast.error(data.error || 'OTP verification failed');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button onClick={handleVerify} className="mt-4 w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </div>
  );
}
