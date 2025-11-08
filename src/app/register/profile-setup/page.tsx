'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from 'lucide-react';

import { useRegisterStore } from '@/store/registerStore';
import { profileSchema } from '@/lib/validators';
import { useAuthStore } from '@/store/authStore';


/* -------------------------- Username helpers -------------------------- */
const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
// Keep this short client-side; enforce a better filter on server if needed.
const BLOCKED_FRAGMENTS = ['admin', 'moderator', 'support', 'lokalads', 'staff'];
const hasBlockedWord = (u: string) =>
  BLOCKED_FRAGMENTS.some((w) => u.toLowerCase().includes(w));

/* -------------------------- Password helpers -------------------------- */
const COMMON_PASSWORDS = new Set([
  'password', 'password1', '12345678', 'qwerty', 'letmein', 'welcome', 'admin123',
  'iloveyou', 'abc12345', '123456789', 'lokalads', 'passw0rd'
]);

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) score = 0; // tank score for common pw
  return Math.min(score, 5);
}
function strengthLabel(score: number) {
  if (score <= 1) return 'Weak';
  if (score <= 3) return 'Good';
  return 'Strong';
}

/* -------------------------- Role options -------------------------- */
const ROLES = [
  { key: 'individual', label: 'Individual' },
  { key: 'business', label: 'Business' },
  { key: 'agency', label: 'Agency' },
  { key: 'other', label: 'Other' },
] as const;

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'blocked';

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
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // UI-only fields
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  // Username check
  const [unameStatus, setUnameStatus] = useState<UsernameStatus>('idle');
  const [unameMsg, setUnameMsg] = useState<string>('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // for scrolling/focusing first error
  const formRef = useRef<HTMLDivElement | null>(null);

  // Derived password bits
  const pwScore = useMemo(() => scorePassword(profile.password), [profile.password]);
  const pwLabel = strengthLabel(pwScore);
  const pwTooCommon = useMemo(
    () => profile.password && COMMON_PASSWORDS.has(profile.password.toLowerCase()),
    [profile.password]
  );
  const pwMismatch = useMemo(
    () => confirmPassword.length > 0 && confirmPassword !== profile.password,
    [confirmPassword, profile.password]
  );

  // Debounced live username check
  useEffect(() => {
    const uname = (profile.username || '').trim();

    // local validations first
    if (!uname) {
      setUnameStatus('idle');
      setUnameMsg('');
      return;
    }
    if (!USERNAME_RE.test(uname)) {
      setUnameStatus('invalid');
      setUnameMsg('Usernames can only use letters, numbers and underscores.');
      return;
    }
    if (hasBlockedWord(uname)) {
      setUnameStatus('blocked');
      setUnameMsg('That username includes words we can’t allow — try another.');
      return;
    }

    setUnameStatus('checking');
    setUnameMsg('Checking availability…');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    debounceRef.current = setTimeout(async () => {
      try {
        abortRef.current = new AbortController();
        const res = await fetch('/api/users/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: uname }),
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        if (!res.ok) {
          setUnameStatus('invalid');
          setUnameMsg(data?.error || 'Unable to check username right now.');
          return;
        }
        if (data?.available === false) {
          setUnameStatus('taken');
          setUnameMsg('Sorry, that username is already taken please try some other name');
        } else {
          setUnameStatus('available');
          setUnameMsg('Username is available');
        }
      } catch {
        // ignore aborted; show soft error otherwise
        setUnameStatus('invalid');
        setUnameMsg('Unable to check username right now.');
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.username]);

  const scrollToFirstError = (map: Record<string, string>) => {
    const order = [
      'username',
      'password',
      'confirmPassword',
      'role',
      'consent',
    ];
    const first = order.find((k) => map[k]);
    if (!first) return;
    const el =
      formRef.current?.querySelector(`[name="${first}"]`) ||
      formRef.current?.querySelector(`[data-field="${first}"]`);
    (el as HTMLElement | null)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (el as HTMLElement | null)?.focus?.();
  };

  const submit = async () => {
  // Block while username still checking
  if (unameStatus === 'checking') {
    toast.error('Please wait while we finish checking your username.');
    return;
  }

  // base zod (username, password complexity, role) with trimming
  const trimmed = {
    ...profile,
    username: (profile.username || '').trim(),
    password: (profile.password || '').trim(),
  };
  const parsed = profileSchema.safeParse(trimmed);

  const map: Record<string, string> = {};
  if (!parsed.success) {
    parsed.error.issues.forEach((i) => (map[i.path.join('.')] = i.message));
  }

  // extra username rules
  const uname = trimmed.username;
  if (!uname) {
    map.username = 'Please choose a username.';
  } else if (!USERNAME_RE.test(uname)) {
    map.username = 'Usernames can only use letters, numbers and underscores.';
  } else if (hasBlockedWord(uname)) {
    map.username = 'That username includes words we can’t allow — try another.';
  } else if (unameStatus === 'taken') {
    map.username = 'Sorry, that username is already taken please try some other name';
  } else if (unameStatus === 'invalid' || unameStatus === 'blocked') {
    map.username = unameMsg || 'Invalid username.';
  }

  // password checks
  if (pwTooCommon || pwScore <= 1) {
    map.password = 'Try a longer password or add a symbol for better protection.';
  }
  if (pwMismatch) {
    map.confirmPassword = 'Passwords don’t match — please check both fields.';
  }

  // role required
  if (!trimmed.role) {
    map.role = 'Tell us how you’ll use Lokalads so we can tailor your experience.';
  }

  // consent required
  if (!consent) {
    map.consent = 'We need your agreement to our Terms & Privacy Policy to create your account.';
  }

  if (Object.keys(map).length > 0) {
    setErrors(map);
    scrollToFirstError(map);
    toast.error('Please fix the highlighted fields');
    return;
  }

  if (!emailVerified) return toast.error('Please verify your email first');
  if (!phoneVerified) return toast.error('Please verify your phone first');

  setErrors({});
  setSubmitting(true);

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Step 1 — General
        firstName: general.firstName,
        lastName: general.lastName,
        dateOfBirth: general.dateOfBirth,
        gender: general.gender,
        residency: general.residency || undefined,
        nationality: general.nationality || undefined, // optional
        email: general.email,
        country: general.country || undefined,          // optional
        state: general.state || undefined,              // optional

        // Step 3 — Phones
        primaryNumber: phones.primaryNumber,
        secondaryNumber1: phones.secondaryNumber1 || undefined,
        secondaryNumber2: phones.secondaryNumber2 || undefined,

        // Step 4 — Profile
        username: trimmed.username,
        password: trimmed.password,
        role: trimmed.role,

        // Optional marketing flag
        subscribe,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error || 'Registration failed';
      toast.error(msg);
      return;
    }

    toast.success('Registered successfully');

    // ✅ AUTO-LOGIN: write to auth store (so the app treats user as logged in)
    if (data.token && data.user) {
      // keep localStorage if your backend expects it elsewhere
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // global in-memory (persisted) auth — this is what removes the login page
      useAuthStore.getState().setAuth(data.token, data.user);
    }

    // optional: clear the multi-step register store so future tabs start clean
    reset();

    // Go straight to the app
    router.push('/'); // or '/' if your home is gated by auth
  } catch {
    toast.error('Something went wrong');
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 4 — Profile Setup</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create your account credentials and pick how you want to appear on Lokalads.
          </p>
        </CardHeader>

        <CardContent className="space-y-6" ref={formRef}>
          {/* Username */}
          <div data-field="username">
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="jane_doe"
              value={profile.username}
              onChange={(e) => updateProfile({ username: e.target.value })}
              aria-invalid={!!errors.username}
            />
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span>This is public — choose something friendly and recognisable.</span>
              {unameStatus === 'available' && <CheckCircle2 className="inline h-4 w-4 text-green-600" />}
              {(unameStatus === 'taken' || unameStatus === 'invalid' || unameStatus === 'blocked') && (
                <XCircle className="inline h-4 w-4 text-red-600" />
              )}
            </div>
            {unameMsg && (
              <p className={`text-sm mt-1 ${unameStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                {unameMsg}
              </p>
            )}
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-field="password">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create a secure password"
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
              <p className="text-xs text-muted-foreground mt-1">
                At least 8 characters. Use numbers, letters and a symbol for extra strength.
              </p>

              {/* Strength meter */}
              {/* Strength meter */}
<div className="mt-2 flex items-center gap-2">
  <div className="flex gap-1">
    {[0,1,2,3,4].map((i) => (
      <div
        key={i}
        className={`h-1.5 w-8 rounded ${
          i < pwScore
            ? pwScore >= 4
              ? "bg-green-600"
              : pwScore >= 2
              ? "bg-yellow-500"
              : "bg-red-500"
            : "bg-muted"
        }`}
      />
    ))}
  </div>
  <span className="text-xs text-muted-foreground">{pwLabel}</span>
</div>

{/* ✅ Password Requirement Checklist */}
<div className="mt-3 space-y-1 text-xs">
  {[
    {
      label: "At least 8 characters long",
      valid: profile.password.length >= 8,
    },
    {
      label: "At least 1 letter",
      valid: /[a-zA-Z]/.test(profile.password),
    },
    {
      label: "At least 1 number",
      valid: /\d/.test(profile.password),
    },
    {
      label: "At least 1 special character",
      valid: /[^A-Za-z0-9]/.test(profile.password),
    },
    {
      label: "Not your email",
      valid:
        profile.password.length > 0 &&
        general.email &&
        profile.password.toLowerCase() !== general.email.toLowerCase(),
    },
    {
      label: "Not more than 24 characters long",
      valid: profile.password.length <= 24 && profile.password.length > 0,
    },
  ].map((rule, idx) => (
    <div key={idx} className="flex items-center gap-2">
      {rule.valid ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      )}
      <p className={`${rule.valid ? "text-green-600" : "text-red-600"}`}>
        {rule.label}
      </p>
    </div>
  ))}
</div>


              {(pwTooCommon || errors.password) && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password || 'That password is too common — choose something harder to guess.'}
                </p>
              )}
            </div>

            <div data-field="confirmPassword">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((p) => !p)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                  aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {pwMismatch && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords don’t match — please check both fields.
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Role (radio cards) */}
          <div data-field="role">
            <Label>Role</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Choose how you’ll use Lokalads — roles customise your dashboard and features.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((r) => {
                const active = profile.role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => updateProfile({ role: r.key })}
                    className={`rounded-xl border p-4 text-left transition ${
                      active ? 'border-primary ring-2 ring-primary/30' : 'border-input hover:bg-muted/40'
                    }`}
                    aria-pressed={active}
                    name="role"
                  >
                    <div className="font-medium">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {r.key === 'individual' && 'Personal buying/selling'}
                      {r.key === 'business' && 'Shops, SMBs and brands'}
                      {r.key === 'agency' && 'Manage listings for clients'}
                      {r.key === 'other' && 'Something else'}
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.role && <p className="text-sm text-red-600 mt-2">{errors.role}</p>}
          </div>

          {/* Consent + marketing */}
          <div data-field="consent" className="space-y-2">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                name="consent"
              />
              <span>
                I agree to the{' '}
                <a href="/legal/terms" className="underline underline-offset-2" target="_blank" rel="noreferrer">
                  Lokalads Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a href="/legal/privacy" className="underline underline-offset-2" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>.
              </span>
            </label>
            {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                name="subscribe"
              />
              <span>Subscribe to product updates &amp; occasional offers</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/register/phone-verification')}
            >
              Back
            </Button>
            <Button onClick={submit} disabled={submitting || unameStatus === 'checking'}>
              {submitting ? 'Creating…' : 'Create Account'}
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
