"use client";

/**
 * Login page.
 * UI: ported from la-design-july10 (LaButton / LaInput / LaRadio design system).
 * Auth/API wiring: la-web's real integration (/api/auth/login, useAuthStore,
 * next-auth Google sign-in, sonner toasts, post-login redirect).
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
import { IconGoogle } from "@/components/icons/inline";
import { useAuthStore } from "@/store/authStore";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

/* ================= SAFE PARSER ================= */
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/* ================= VALIDATION ================= */
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string, minLen = 6) {
  return v.replace(/\D/g, "").length >= minLen;
}

/* ================= ERROR MAPPING (FROM OLD LOGIN) ================= */
function mapLoginError(opts: {
  status: number;
  apiError?: string;
  identifierValue: string;
}) {
  const { status, apiError } = opts;

  if (status === 400) {
    return { general: "Please check your input and try again." };
  }
  if (status === 401) {
    return { fields: { password: "Incorrect password. Please try again." } };
  }
  if (status === 404) {
    return { fields: { identifier: "Account not found." } };
  }
  if (status === 403) {
    return { general: "Please verify your email before logging in." };
  }
  if (status === 429) {
    return { general: "Too many attempts. Please try later." };
  }

  return { general: apiError || "Login failed. Please try again." };
}

/* ================= REAL AUTH ================= */
async function realAuthenticate(identifier: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const text = await res.text();
    const json = safeJsonParse<any>(text);

    if (!res.ok) {
      return {
        ok: false,
        error:
          json?.error ||
          json?.message ||
          (text !== "undefined" ? text : "Login failed"),
        status: res.status,
      };
    }

    return {
      ok: true,
      data: json,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Something went wrong",
    };
  }
}

/* ================= COMPONENT ================= */
function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  /* ── Identifier Step ── */
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [dialCode, setDialCode] = useState(() => COUNTRIES[0].dial.replace("+", ""));
  const [identifierTouched, setIdentifierTouched] = useState(false);

  /* ── Password Step ── */
  const [step, setStep] = useState<"identifier" | "password">("identifier");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  /* ── State ── */
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [shake, setShake] = useState(false);

  /* ── Derived ── */
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const phoneValid = useMemo(
    () => isValidPhone(phone, country?.minLen ?? 6),
    [phone, country]
  );

  const identifierValid = method === "email" ? emailValid : phoneValid;
  const identifier = method === "email" ? email : `+${dialCode}${phone}`;

  /* ================= HANDLERS ================= */

  function handleMethodChange(next: "email" | "phone") {
    setMethod(next);
    setEmail("");
    setPhone("");
    setIdentifierTouched(false);
    setLoginError("");
    // Stay on step 1 if switching method mid-flow
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

    try {
      const result = await realAuthenticate(identifier, password);

      // ❌ ERROR
      if (!result.ok) {
        const mapped = mapLoginError({
          status: result.status || 500,
          apiError: result.error,
          identifierValue: identifier,
        });

        const message = mapped.general || result.error || "Login failed";

        setLoginError(message);
        toast.error(message);

        setShake(true);
        setTimeout(() => setShake(false), 400);

        return;
      }

      // ✅ SUCCESS
      const data = result.data;

      if (data?.user) {
        setAuth(null, data.user);
      }

      toast.success("Welcome back!");

      // 🔁 restore redirect logic (VERY IMPORTANT)
      const redirectTo = localStorage.getItem("redirectAfterLogin");

      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const message = err?.message || "Something went wrong";

      setLoginError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/api/auth/google-callback" });
    } finally {
      setGoogleLoading(false);
    }
  }

  const showIdentifierError = identifierTouched && !identifierValid;
  const showPasswordError = passwordTouched && password.length < 6;

  /* ================= UI ================= */

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[url('/bg-market-place-vintage.png')] bg-cover bg-center bg-no-repeat">
      <section className="w-full max-w-sm">
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
                <p className="italic text-sm text-slate-800">
                  Enter your password for
                </p>
                <p className="text-sm font-semibold text-slate-900 bg-slate-100 rounded-md px-3 h-10 flex items-center mt-1 truncate">
                  {method === "email" ? email : `+${dialCode} ${phone}`}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-slate-100 rounded w-1/3" />
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ) : step === "identifier" ? (
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
                    <FieldLabel htmlFor="email">Email</FieldLabel>
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
                        {email.length === 0
                          ? "Please enter your email."
                          : "That email looks off."}
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
                      defaultCountry={country.code}
                      onCountryChange={(c) => {
                        setDialCode(c.dial);
                        const match = COUNTRIES.find((x) => x.code === c.code);
                        if (match) setCountry(match);
                      }}
                      inputClassName={cn(
                        showIdentifierError ? "ring-1 ring-red-400" : ""
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
                  <LaButton type="submit" className="w-full">
                    Continue
                  </LaButton>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 shrink-0">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Google login */}
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
                    <a href="/register" className="font-semibold text-slate-800">
                      Sign up
                    </a>
                  </FieldDescription>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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

                <LaButton type="submit" className="w-full">
                  Sign in
                </LaButton>

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
      </section>
    </main>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
