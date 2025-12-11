'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

import { useRegisterStore } from '@/store/registerStore';
import { generalInfoSchema } from '@/lib/validators';

import { Form } from '@/components/shadcn/form';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { FormField } from '@/components/FormField';
import { FormFieldWrapper } from '@/components/FormFieldWrapper';
import { FormHelperText } from '@/components/FormHelperText';
import { useMediaQuery } from '@/components/hooks/use-media-query';

/* ---------- utils ---------- */
function pad(n: number) {
  return String(n).padStart(2, '0');
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromISODate(s?: string) {
  if (!s) return undefined;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}
function calcAgeFromISO(dobISO?: string) {
  if (!dobISO) return;
  const today = new Date();
  const dob = fromISODate(dobISO);
  if (!dob) return;
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// ✅ Validate only fields present on this step
const step1Schema = generalInfoSchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  gender: true,
  email: true,
});

// tiny helper to merge classes
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function GeneralInfoPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const { general, updateGeneral } = useRegisterStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBelowLaptop = useMediaQuery('(max-width:1024px)');

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const firstName = (general.firstName || '').trim();
    const lastName = (general.lastName || '').trim();
    const dateOfBirth = general.dateOfBirth || '';
    const gender = general.gender || '';
    const email = (general.email || '').trim();

    const mappedErrors: Record<string, string> = {};

    // friendly checks before zod
    if (!firstName) mappedErrors.firstName = 'Please enter your first name so people know who you are.';
    if (!lastName) mappedErrors.lastName = 'Please enter your last name.';
    if (!dateOfBirth) {
      mappedErrors.dateOfBirth = 'Please enter your date of birth.';
    } else if ((calcAgeFromISO(dateOfBirth) ?? 0) < 18) {
      mappedErrors.dateOfBirth = 'Sorry — you need to be 18 or older to use Lokalads.';
    }
    if (!gender) mappedErrors.gender = 'Please select a gender option.';
    if (!email) mappedErrors.email = 'Please enter a valid email address.';

    // ✅ only these 5 keys are validated; locality is ignored on this page
    const parsed = step1Schema.safeParse({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
    });

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.');
        if (!mappedErrors[key]) mappedErrors[key] = issue.message;
      });
    }

    if (Object.keys(mappedErrors).length > 0) {
      setErrors(mappedErrors);

      // scroll to first error
      const firstErrorField = Object.keys(mappedErrors)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLElement | null)?.focus?.();

      toast.error('Please fix the highlighted fields.');
      return;
    }

    // save normalized values and continue
    updateGeneral({ firstName, lastName, dateOfBirth, gender, email });
    setErrors({});
    router.push('/register/email-verification');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1 — General Information</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A few details to personalise your Lokalads experience.
          </p>
        </CardHeader>

        <CardContent>
          <Form onSubmit={onSubmit} ref={formRef}>
            {/* hidden heading/intro (to match your other page) */}
            <h2 className="hidden text-3xl font-bold text-slate-800 mb-1">
              Step 1- General Information
            </h2>
            <p className="hidden text-lg font-light text-slate-700 mb-3">
              Lets get to know you, a few details to personalise your lokalads experience,
            </p>

            {/* First / Last Name with highlight behavior */}
            <FormFieldWrapper
              className="grid grid-cols-1 md:grid-cols-2 md:gap-4"
              showFocusWithin={!isBelowLaptop}
            >
              <FormField
                label="First Name"
                htmlFor="firstName"
                error={errors.firstName}
                className="mb-0"
                showFocusWithin={isBelowLaptop}
              >
                <Input
                  id="firstName"
                  name="firstName"
                  value={general.firstName}
                  onChange={(e) => updateGeneral({ firstName: e.target.value })}
                  placeholder="e.g. Johnson"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  className={cx(
                    !!errors.firstName && 'border-red-500 focus-visible:ring-red-500/20'
                  )}
                />
                {/* {errors.firstName && (
                  <p id="firstName-error" className="text-sm text-red-600 mt-1">
                    {errors.firstName}
                  </p>
                )} */}
              </FormField>

              <FormField
                label="Last Name"
                htmlFor="lastName"
                error={errors.lastName}
                className="mb-0"
                showFocusWithin={isBelowLaptop}
              >
                <Input
                  id="lastName"
                  name="lastName"
                  value={general.lastName}
                  onChange={(e) => updateGeneral({ lastName: e.target.value })}
                  placeholder="e.g. Davis"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  className={cx(
                    !!errors.lastName && 'border-red-500 focus-visible:ring-red-500/20'
                  )}
                />
                {/* {errors.lastName && (
                  <p id="lastName-error" className="text-sm text-red-600 mt-1">
                    {errors.lastName}
                  </p>
                )} */}
              </FormField>
            </FormFieldWrapper>

            <FormHelperText className="mt-1 mb-4">
              Use your real name to build trust.
            </FormHelperText>

            {/* Date of Birth */}
            <FormField
  label="Date of Birth"
  htmlFor="dateOfBirth"
  error={errors.dateOfBirth}
  helperLabel="We need this to confirm you are 18+"
  showFocusWithin={!isBelowLaptop}
>
  <div className="relative">
    <input
      id="dateOfBirth"
      name="dateOfBirth"
      type="date"
      value={general.dateOfBirth || ''}
      onChange={(e) => updateGeneral({ dateOfBirth: e.target.value })}
      className={cx(
        'flex h-10 w-full rounded-sm border-[1.5px] border-gray-700/50 bg-gray-50 pl-3 pr-10 py-2 text-base font-normal text-gray-900 placeholder:text-gray-400 focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        'appearance-none',                 // hide default icon
        'bg-[url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' fill=\'none\' stroke=\'%23666\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Crect width=\'18\' height=\'18\' x=\'3\' y=\'4\' rx=\'2\' ry=\'2\'/%3E%3Cline x1=\'16\' x2=\'16\' y1=\'2\' y2=\'6\'/%3E%3Cline x1=\'8\' x2=\'8\' y1=\'2\' y2=\'6\'/%3E%3Cline x1=\'3\' x2=\'21\' y1=\'10\' y2=\'10\'/%3E%3C/svg%3E")] bg-no-repeat bg-right-3 bg-center',
        !!errors.dateOfBirth && 'border-red-500 focus-visible:ring-red-500/20'
      )}
      aria-label="Date of Birth"
      aria-invalid={!!errors.dateOfBirth}
      aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
      autoComplete="bday"
      max={todayISO()}
      min="1900-01-01"
    />
  </div>
</FormField>


            {/* Gender */}
           <FormField
  label="Gender"
  htmlFor="gender"
  error={errors.gender}
  showFocusWithin={!isBelowLaptop}
>
  <div className="flex flex-col gap-3 py-1">
    {[
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ].map((opt) => (
      <label
        key={opt.value}
        className="flex items-center gap-2 cursor-pointer text-gray-800"
      >
        <input
          type="radio"
          name="gender"
          value={opt.value}
          checked={general.gender === opt.value}
          onChange={(e) => updateGeneral({ gender: e.target.value })}
          className={cx(
            "h-4 w-4 text-blue-600 border-gray-700/50 focus:ring-blue-500",
            !!errors.gender && "ring-red-500"
          )}
        />
        <span>{opt.label}</span>
      </label>
    ))}
  </div>
</FormField>


            {/* Email */}
            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email}
              showFocusWithin={!isBelowLaptop}
            >
              <Input
                id="email"
                name="email"
                type="email"
                value={general.email}
                onChange={(e) => updateGeneral({ email: e.target.value })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cx(
                  !!errors.email && 'border-red-500 focus-visible:ring-red-500/20'
                )}
              />
              {/* {errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {errors.email}
                </p>
              )} */}
            </FormField>

            <Button type="submit" className="mt-4 w-full">
              Next: Verify Email
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
