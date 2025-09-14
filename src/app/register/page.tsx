'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendEmailTimeout, setResendEmailTimeout] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // ⏱ Resend OTP countdown
  useEffect(() => {
    if (resendEmailTimeout <= 0) return;
    const interval = setInterval(() => {
      setResendEmailTimeout(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendEmailTimeout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendEmailOtp = async () => {
    if (!form.email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('OTP sent to email');
        setOtpSent(true);
        setResendEmailTimeout(60);
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const verifyEmailOtp = async () => {
    if (!form.otp) return toast.error('Enter the OTP sent to your email');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailVerified(true);
        toast.success('Email verified');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch {
      toast.error('OTP verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) return toast.error('Please verify your email OTP first');

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registered successfully! Logging you in...');

        // ✅ Save token + user to localStorage
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        router.push('/');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Username</Label>
              <Input name="username" value={form.username} onChange={handleChange} required />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <Label>First Name</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="w-1/2">
                <Label>Last Name</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={sendEmailOtp}
                  disabled={resendEmailTimeout > 0 || loading}
                >
                  {resendEmailTimeout > 0 ? `Resend (${resendEmailTimeout})` : 'Send OTP'}
                </Button>
              </div>

              {otpSent && !emailVerified && (
                <div className="mt-2 flex gap-2">
                  <Input
                    name="otp"
                    placeholder="Enter Email OTP"
                    value={form.otp}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <Button type="button" onClick={verifyEmailOtp}>
                    Verify
                  </Button>
                </div>
              )}
              {emailVerified && <p className="text-green-600 text-sm mt-1">✅ Email verified</p>}
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading || !emailVerified} className="w-full">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
