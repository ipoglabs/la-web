"use client";

/**
 * Login snippet — two-step identifier (email/phone) then password.
 * Replace the mock auth/google handlers with real integrations in production.
 */

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LaButton, LaInput, LaRadio } from "@/components/la";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { COUNTRIES, type Country } from "@/lib/data/countries";
import PhoneNumberInput from "@/components/phone-number-input";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { IconGoogle } from "@/components/icons/inline";
import { toast } from "@/components/ui/sonner";

// ─── INTEGRATION ① — Email / Phone + Password Auth ──────────────────────────
// Replace with your real auth call:
//   Next-Auth  → signIn("credentials", { identifier, password, redirect: false })
//   Custom API → POST /api/auth/login  { identifier, password }
//
// Expected return shape: { ok: true } | { ok: false; error: string }
async function mockAuthenticate(
  identifier: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  if (password === "123456") return { ok: true };
  return { ok: false, error: "Incorrect password. Try 123456 for the demo." };
}

// ─── INTEGRATION ② — Google / Social OAuth ────────────────────────────────
// Replace with: signIn("google", { callbackUrl: POST_LOGIN_ROUTE })
async function mockGoogleLogin(): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
}

function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  // ── Identifier step ──────────────────────────────────────────────────────
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(
    // Must match the defaultCountry passed to PhoneNumberInput below
    COUNTRIES.find((c) => c.code === "GB") ?? COUNTRIES[0]
  );
  const [identifierTouched, setIdentifierTouched] = useState(false);

  // ── Password step ────────────────────────────────────────────────────────
  const [step, setStep] = useState<"identifier" | "password">("identifier");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  // ── Loading / error ──────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [shake, setShake] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const phoneValid = useMemo(
    () => isValidPhone(phone, country?.minLen ?? 6),
    [phone, country]
  );
  const identifierValid = method === "email" ? emailValid : phoneValid;
  const identifier = method === "email" ? email : phone;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleMethodChange(next: "email" | "phone") {
    setMethod(next);
    setEmail("");
    setPhone("");
    setIdentifierTouched(false);
    setLoginError("");
    // Stay on step 1 if switching method
    if (step === "password") {
      setStep("identifier");
      setPassword("");
      setPasswordTouched(false);
    }
  }

  function handleContinue(e?: React.FormEvent) {
    e?.preventDefault();
    setIdentifierTouched(true);
    if (!identifierValid) return;
    setLoginError("");
    setPassword("");
    setPasswordTouched(false);
    setStep("password");
  }

  async function handleSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    setPasswordTouched(true);
    if (password.length < 6) return;

    setLoading(true);
    setLoginError("");

    const result = await mockAuthenticate(identifier, password);
    setLoading(false);

    if (result.ok) {
      toast("Welcome back! Signing you in…");
      // ─── INTEGRATION ③ — Post-login redirect ────────────────────────────
      // Replace "/" with your post-login route, e.g. "/dashboard"
      router.push("/");
    } else {
      setLoginError(result.error ?? "Something went wrong. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    await mockGoogleLogin();
    setGoogleLoading(false);
    toast("Google login — wire up your OAuth provider.");
  }

  // ── Error visibility ──────────────────────────────────────────────────────
  const showIdentifierError = identifierTouched && !identifierValid;
  const showPasswordError = passwordTouched && password.length < 6;

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card
        className={cn(
          "shadow-[0_0_12px_rgba(0,0,0,0.45)] border-gray-200 rounded-2xl",
          shake && "animate-shake ring-2 ring-red-400"
        )}
      >
        <CardHeader className="pb-0 mb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight mb-1">
            Login to your account
          </CardTitle>
          {step === "identifier" ? (
            <CardDescription className="text-sm tracking-tight">
              Choose your preferred login method
            </CardDescription>
          ) : (
            <div className="mt-2">
              <p className="italic text-sm text-slate-800">Enter your password for</p>
              <p className="text-sm font-semibold text-slate-900 bg-slate-100 rounded-md px-3 h-10 flex items-center mt-1 truncate">
                {method === "email" ? email : phone}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            /* ── Loading skeleton ── */
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-slate-100 rounded w-1/3" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ) : step === "identifier" ? (
            /* ── Step 1: Identifier ── */
            <form onSubmit={handleContinue} className="space-y-3" noValidate>
              <fieldset aria-label="Sign in method" className="flex gap-5 mt-1 mb-4">
                <LaRadio
                  name="method"
                  value="email"
                  label="Email"
                  checked={method === "email"}
                  onChange={() => handleMethodChange("email")}
                />
                <LaRadio
                  name="method"
                  value="phone"
                  label="Phone"
                  checked={method === "phone"}
                  onChange={() => handleMethodChange("phone")}
                />
              </fieldset>

              {method === "email" ? (
                <Field>
                  <LaInput
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError("");
                    }}
                    onBlur={() => {
                      setIdentifierTouched(true);
                      setEmail((s) => s.trim());
                    }}
                    placeholder="you@example.com"
                    status={showIdentifierError ? "error" : "default"}
                    aria-describedby={showIdentifierError ? "email-error" : undefined}
                  />
                  {showIdentifierError && (
                    <p id="email-error" role="alert" className="text-sm italic text-red-500 mt-0">
                      {email.length === 0 ? "Please enter your email." : "That email looks off."}
                    </p>
                  )}
                </Field>
              ) : (
                <Field>
                  <PhoneNumberInput
                    id="phone"
                    value={phone}
                    onChange={(digits) => {
                      setPhone(digits);
                      setLoginError("");
                    }}
                    defaultCountry="GB"
                    onlyCountries={["GB", "IN", "SG", "NZ"]}
                    onCountryChange={(c) => {
                      const next = COUNTRIES.find((ct) => ct.code === c.code) ?? COUNTRIES[0];
                      setCountry(next as Country);
                    }}
                    inputClassName={cn(
                      identifierTouched && !phoneValid ? "ring-1 ring-red-400" : ""
                    )}
                    inputDescribedBy={showIdentifierError ? "phone-error" : undefined}
                    maxLength={country?.maxLen}
                  />
                  {showIdentifierError && (
                    <p id="phone-error" role="alert" className="text-sm italic text-red-500 mt-0">
                      {phone.trim().length === 0
                        ? "Please enter your phone number."
                        : "That number seems too short."}
                    </p>
                  )}
                </Field>
              )}

              <div className="flex flex-col gap-2">
                <LaButton type="submit" className="w-full">Continue</LaButton>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 shrink-0">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* ── Google login ── */}
                <LaButton
                  type="button"
                  intent="secondary"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                >
                  <IconGoogle className="size-4 shrink-0" />
                  {googleLoading ? "Connecting…" : "Continue with Google"}
                </LaButton>
              </div>

              <div className="text-center pb-1">
                <FieldDescription className="text-md">
                  New user?{" "}
                  {/* ─── INTEGRATION ⑤ — Sign-up route ─── replace href */}
                  <a href="/signup" className="font-semibold text-slate-800">Sign up</a>
                </FieldDescription>
              </div>
            </form>
          ) : (
            /* ── Step 2: Password ── */
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* ─── INTEGRATION ⑥ — Forgot-password route ─── replace href */}
                  <a href="/forgot-password" className="text-xs text-slate-500 hover:text-slate-800">
                    Forgot password?
                  </a>
                </div>

                <LaInput
                  id="password"
                  type="password"
                  showPasswordToggle
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Enter your password"
                  status={showPasswordError || !!loginError ? "error" : "default"}
                  aria-describedby={
                    showPasswordError
                      ? "password-error"
                      : loginError
                        ? "login-error"
                        : undefined
                  }
                />

                {showPasswordError && (
                  <p id="password-error" role="alert" className="text-sm italic text-red-500 mt-0">
                    {password.length === 0
                      ? "Please enter your password."
                      : "Password must be at least 6 characters."}
                  </p>
                )}
                {loginError && !showPasswordError && (
                  <p id="login-error" role="alert" className="text-sm italic text-red-500 mt-0">
                    {loginError}
                  </p>
                )}
              </Field>

              <LaButton type="submit" className="w-full">Sign in</LaButton>

              {/* Back to identifier step */}
              <LaButton
                type="button"
                intent="ghost"
                className="w-full"
                onClick={() => {
                  setStep("identifier");
                  setPassword("");
                  setPasswordTouched(false);
                  setLoginError("");
                }}
              >
                ← Use a different {method}
              </LaButton>
            </form>
          )}
        </CardContent>
      </Card>

      {/* ── Demo hint — remove in production ── */}
      <p className="text-center text-[11px] text-slate-400">
        Demo: any valid {method} · password <span className="font-mono font-semibold">123456</span>
      </p>
    </div>
  );
}

export default function LoginSnippet() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[url('/bg-market-place-vintage.png')] bg-cover bg-center bg-no-repeat">
      <section className="w-full max-w-sm">
        <LoginForm />
      </section>
    </main>
  );
}
