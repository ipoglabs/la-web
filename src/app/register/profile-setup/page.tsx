'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { useRegisterStore } from '@/store/registerStore';
import { profileSchema } from '@/lib/validators';

export default function ProfileSetupPage() {
  const router = useRouter();
  const {
    general,
    emailVerified,
    phones,
    phoneVerified,
    profile,
    updateProfile,
    reset,
  } = useRegisterStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // client-side validation
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[i.path.join('.')] = i.message));
      setErrors(map);
      toast.error('Please fix the highlighted fields');
      return;
    }
    if (!emailVerified) return toast.error('Please verify your email first');
    if (!phoneVerified) return toast.error('Please verify your phone first');

    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // general
          firstName: general.firstName,
          lastName: general.lastName,
          dateOfBirth: general.dateOfBirth,
          gender: general.gender,
          nationality: general.nationality,
          residency: general.residency,
          email: general.email,
          // phones
          primaryNumber: phones.primaryNumber,
          secondaryNumber1: phones.secondaryNumber1,
          secondaryNumber2: phones.secondaryNumber2,
          // profile
          username: profile.username,
          password: profile.password,
          role: profile.role,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Registered successfully');
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        reset();
        router.push('/');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 4: Profile Setup</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Username / Password / Role */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Username</Label>
              <Input
                value={profile.username}
                onChange={(e) => updateProfile({ username: e.target.value })}
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={profile.password}
                  onChange={(e) => updateProfile({ password: e.target.value })}
                  className="pr-10"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Role</Label>
            {/* native select keeps deps light; swap to shadcn Select if you prefer */}
            <select
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={profile.role}
              onChange={(e) => updateProfile({ role: e.target.value })}
              aria-invalid={!!errors.role}
            >
              <option value="">Select…</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/register/phone-verification')}
            >
              Back
            </Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? 'Submitting…' : 'Create Account'}
            </Button>
          </div>

          {/* status hints */}
          <div className="text-xs text-muted-foreground">
            {emailVerified ? '✅ Email verified' : '❌ Email not verified'}
            {' · '}
            {phoneVerified ? '✅ Phone verified' : '❌ Phone not verified'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
