'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useRegisterStore } from '@/store/registerStore';
import { generalInfoSchema } from '@/lib/validators';

export default function GeneralInfoPage() {
  const router = useRouter();
  const { general, updateGeneral } = useRegisterStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const next = () => {
    const parsed = generalInfoSchema.safeParse(general);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach(i => (map[i.path.join('.')] = i.message));
      setErrors(map);
      toast.error('Please fix the highlighted fields');
      return;
    }
    setErrors({});
    router.push('/register/email-verification');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1: General Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={general.firstName}
                onChange={(e) => updateGeneral({ firstName: e.target.value })}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={general.lastName}
                onChange={(e) => updateGeneral({ lastName: e.target.value })}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* DOB / Gender / Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>DOB</Label>
              <Input
                type="date"
                value={general.dateOfBirth}
                onChange={(e) => updateGeneral({ dateOfBirth: e.target.value })}
                aria-invalid={!!errors.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <Label>Gender</Label>
              {/* native select to avoid extra deps */}
              <select
                className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={general.gender}
                onChange={(e) => updateGeneral({ gender: e.target.value as any })}
                aria-invalid={!!errors.gender}
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                value={general.nationality}
                onChange={(e) => updateGeneral({ nationality: e.target.value })}
                aria-invalid={!!errors.nationality}
              />
              {errors.nationality && (
                <p className="text-sm text-red-600">{errors.nationality}</p>
              )}
            </div>
          </div>

          {/* Residency / Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Residency</Label>
              <Input
                placeholder="Citizen / PR / EP / ..."
                value={general.residency}
                onChange={(e) => updateGeneral({ residency: e.target.value })}
                aria-invalid={!!errors.residency}
              />
              {errors.residency && (
                <p className="text-sm text-red-600">{errors.residency}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={general.email}
                onChange={(e) => updateGeneral({ email: e.target.value })}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={next}>Next: Verify Email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
