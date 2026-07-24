"use client";

/**
 * MethodStep — Login Step 1 · Passwordless sign-in entry
 *
 * Ported from la-design-july16 (`md/feature-spec-doc/login-journey.md`),
 * adapted here to la-staging's REAL backend:
 *
 *   - Google → staging already has a real, working OAuth integration
 *     (NextAuth + `/api/auth/google-callback`, which itself does the
 *     matched/no-match lookup against the real `User` collection and
 *     redirects to `/register/google-complete` for new users). So this
 *     just calls NextAuth's `signIn("google")` directly instead of july16's
 *     mock `POST /api/auth/callback/google` + client-side `resolveIdentity()`
 *     — no need to reinvent what already works.
 *   - Apple → same real pattern as Google now: `signIn("apple")` +
 *     `/api/auth/apple-callback` (matched/no-match against `User`, new
 *     users go to `/register/apple-complete`) — see authOptions.ts and
 *     lib/appleClientSecret.ts. Gated behind
 *     `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED` because none of the 4 Apple
 *     Developer credentials (`APPLE_ID`/`APPLE_TEAM_ID`/`APPLE_KEY_ID`/
 *     `APPLE_PRIVATE_KEY`) are configured in this environment yet, and
 *     Apple doesn't allow localhost redirect URIs at all — flip the flag
 *     once those exist AND this is deployed to a real HTTPS domain
 *     registered with Apple.
 *   - Email / Phone → real send routes (`/api/auth/magic-link`,
 *     `/api/auth/phone/send-otp`), backed by the existing `otpService`
 *     (same Mongo-backed OTP records email verification already uses).
 */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { LaButton, LaCard, LaInput, LaRadio, LaSeparator } from "@/components/la";
import PhoneNumberInput from "@/components/phone-number-input";
import { COUNTRIES, type Country } from "@/lib/data/countries";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { useLoginStore } from "@/lib/stores/loginStore";
import Link from "next/link";

function IconGoogle({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function IconApple({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M16.365 1.43c0 1.14-.468 2.11-1.171 2.83-.766.79-2.03 1.4-3.104 1.32-.125-1.1.43-2.24 1.15-2.95.78-.79 2.14-1.36 3.125-1.2zm4.09 16.6c-.32.73-.7 1.42-1.14 2.06-.6.87-1.09 1.47-1.47 1.8-.58.55-1.2.83-1.86.85-.48.02-1.05-.13-1.72-.44-.68-.32-1.3-.47-1.87-.47-.6 0-1.24.15-1.94.47-.7.32-1.26.48-1.7.5-.63.03-1.26-.26-1.9-.87-.4-.35-.92-.98-1.55-1.88-.68-.97-1.24-2.1-1.68-3.4-.47-1.39-.7-2.74-.7-4.04 0-1.5.32-2.8.97-3.88.5-.87 1.17-1.56 2-2.07.83-.5 1.73-.77 2.7-.78.5 0 1.16.16 1.98.47.81.31 1.34.47 1.57.47.17 0 .74-.18 1.7-.55.9-.34 1.66-.48 2.28-.42 1.68.14 2.94.8 3.78 1.99-1.5.91-2.25 2.18-2.24 3.82.01 1.28.48 2.34 1.4 3.19.42.4.89.7 1.42.92-.11.33-.23.66-.37 1.02z" />
    </svg>
  );
}

export function MethodStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setMethod = useLoginStore((s) => s.setMethod);

  const [identifierMethod, setIdentifierMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === "GB") ?? COUNTRIES[0]
  );
  const [touched, setTouched] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone, country?.minLen ?? 6);
  const identifierValid = identifierMethod === "email" ? emailValid : phoneValid;
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam || "/";

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/api/auth/google-callback" });
    } catch {
      toast.error("Couldn't connect to Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  async function handleApple() {
    // Flip NEXT_PUBLIC_APPLE_SIGNIN_ENABLED=true once APPLE_ID/APPLE_TEAM_ID/
    // APPLE_KEY_ID/APPLE_PRIVATE_KEY are set server-side (see
    // lib/appleClientSecret.ts) — none of the 5 are configured yet, and
    // Apple doesn't allow localhost redirect URIs at all, so this can't be
    // exercised until deployed to a real registered HTTPS domain either way.
    if (process.env.NEXT_PUBLIC_APPLE_SIGNIN_ENABLED !== "true") {
      toast.error("Apple sign-in isn't set up yet — use Google, email, or phone for now.");
      return;
    }
    setAppleLoading(true);
    try {
      await signIn("apple", { callbackUrl: "/api/auth/apple-callback" });
    } catch {
      toast.error("Couldn't connect to Apple. Please try again.");
      setAppleLoading(false);
    }
  }

  async function handleContinue() {
    setTouched(true);
    if (!identifierValid) return;
    setContinueLoading(true);
    try {
      if (identifierMethod === "email") {
        const trimmedEmail = email.trim();
        const res = await fetch("/api/auth/magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        });
        if (!res.ok) throw new Error("send failed");
        setMethod("magic_link", trimmedEmail);
      } else {
        // PhoneNumberInput's onChange only ever gives back the local digits
        // (no dial code) — prepend it here so every downstream consumer
        // (Twilio Verify, normalizeTarget, the stored identifier itself)
        // gets a real E.164-ish number, not a bare local number that
        // happens to work only because send/verify/resolve all reuse the
        // same un-prefixed string.
        const fullPhone = `+${country.dial}${phone}`;
        const res = await fetch("/api/auth/phone/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone }),
        });
        if (!res.ok) throw new Error("send failed");
        // devCode only comes back for India (mocked — no real SMS provider
        // wired up for +91 yet, see otpService.ts), so this is the only place
        // the user can see the code.
        const data = await res.json().catch(() => ({}));
        if (data?.devCode) {
          toast.info(`Demo code (no SMS sent): ${data.devCode}`);
        }
        setMethod("phone_otp", fullPhone);
      }
      router.push(`/login/verify${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`);
    } catch {
      toast.error("Couldn't send your code. Please try again.");
    } finally {
      setContinueLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/bg-market-place-vintage.png')] bg-cover bg-center bg-no-repeat px-4 py-8">
      <LaCard className="w-full max-w-xs rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_12px_rgba(0,0,0,0.45)]">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/assets/la-logo-symbol-color.svg" alt="lokalads logo" width={40} height={40} />
          <Image src="/assets/la-text-black.svg" alt="lokalads" width={96} height={24} />
        </Link>

        <LaSeparator className="opacity-100" />

        <div className="flex flex-col gap-1">
          <h1 className="text-base font-medium text-slate-700 tracking-tight">Choose a login method</h1>
        </div>

        <div className="flex flex-col gap-2.5">
          <LaButton
            intent="primary"
            size="default"
            className="w-full gap-3"
            disabled={googleLoading}
            onClick={handleGoogle}
          >
            <IconGoogle className="size-5" />
            {googleLoading ? "Connecting…" : "Sign in with Google"}
          </LaButton>

          <LaButton
            intent="primary"
            size="default"
            className="w-full gap-3"
            disabled={appleLoading}
            onClick={handleApple}
          >
            <IconApple className="size-5" />
            {appleLoading ? "Connecting…" : "Sign in with Apple"}
          </LaButton>
        </div>

        <LaSeparator label="or" />

        <fieldset aria-label="Sign-in method" className="flex gap-5">
          <LaRadio
            name="signin-identifier"
            value="email"
            label="Email"
            checked={identifierMethod === "email"}
            onChange={() => { setIdentifierMethod("email"); setTouched(false); }}
          />
          <LaRadio
            name="signin-identifier"
            value="phone"
            label="Phone"
            checked={identifierMethod === "phone"}
            onChange={() => { setIdentifierMethod("phone"); setTouched(false); }}
          />
        </fieldset>

        {identifierMethod === "email" ? (
          <div className="space-y-1.5">
            <LaInput
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmail((s) => s.trim())}
              placeholder="you@example.com"
              status={touched && !emailValid ? "error" : "default"}
            />
            {touched && !emailValid && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {email.length === 0 ? "Enter your email." : "Enter a valid email."}
              </p>
            )}
            <p className="text-sm text-slate-500">We&apos;ll send a 6-digit code — no password needed.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <PhoneNumberInput
              id="signin-phone"
              value={phone}
              onChange={setPhone}
              defaultCountry="GB"
              onlyCountries={["GB", "IN", "SG"]}
              onCountryChange={(c) => {
                const next = COUNTRIES.find((ct) => ct.code === c.code) ?? COUNTRIES[0];
                setCountry(next as Country);
              }}
              maxLength={country?.maxLen}
            />
            {touched && !phoneValid && (
              <p role="alert" className="text-sm font-medium text-red-600">
                Enter a valid phone number.
              </p>
            )}
            <p className="text-sm text-slate-500">We&apos;ll text you a 6-digit code — no password needed.</p>
          </div>
        )}

        <LaButton intent="primary" size="default" className="w-full" disabled={continueLoading} onClick={handleContinue}>
          {continueLoading ? "Sending…" : "Continue"}
        </LaButton>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
    </LaCard>
    </div>
  );
}
