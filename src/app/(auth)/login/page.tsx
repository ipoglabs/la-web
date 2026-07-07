"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { COUNTRIES, type Country } from "@/lib/data/countries";
import PhoneNumberInput from "@/components/phone-number-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { isValidEmail, isValidPhone } from "@/lib/validators";
import { IconEye, IconEyeOff } from "@/components/icons/inline";
// import { useToast } from "@/components/ui/toast";
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

/* ================= ERROR MAPPING (FROM OLD LOGIN) ================= */
function mapLoginError(opts: {
  status: number;
  apiError?: string;
  identifierValue: string;
}) {
  const { status, apiError, identifierValue } = opts;
  const msg = (apiError || "").toLowerCase();

  const out: { general?: string; fields?: any } = {
    general: "Login failed. Please try again.",
    fields: {},
  };

  if (status === 400) {
    out.general = "Please check your input and try again.";
    return out;
  }

  if (status === 401) {
    return {
      fields: { password: "Incorrect password. Please try again." },
    };
  }

  if (status === 404) {
    return {
      fields: { identifier: "Account not found." },
    };
  }

  if (status === 403) {
    return {
      general: "Please verify your email before logging in.",
    };
  }

  if (status === 429) {
    return {
      general: "Too many attempts. Please try later.",
    };
  }

  return {
    general: apiError || out.general,
  };
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
  // const toast = useToast();
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  /* ── State ── */
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [shake, setShake] = useState(false);

  const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const isValidPhone = (v: string, minLen = 6) =>
  v.replace(/\D/g, "").length >= minLen;

  /* ── Derived ── */
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const phoneValid = useMemo(
    () => isValidPhone(phone, country?.minLen ?? 6),
    [phone, country]
  );

  const identifierValid = method === "email" ? emailValid : phoneValid;
  const identifier = method === "email" ? email : `+${dialCode}${phone}`;

  /* ================= HANDLERS ================= */

  function handleContinue(e?: React.FormEvent) {
    e?.preventDefault();
    setIdentifierTouched(true);

    if (!identifierValid) return;

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

      // 🔥 toast error
      toast.error(message);

      // 🔥 shake animation
      setShake(true);
      setTimeout(() => setShake(false), 400);

      return;
    }

    // ✅ SUCCESS
    const data = result.data;

    if (data?.user) {
      setAuth(null, data.user);
    }

    // 🔥 success toast
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
              <fieldset>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as "email" | "phone")}
                  className="flex gap-3 mt-1"
                >
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <RadioGroupItem value="email" />
                    <span className="text-sm text-slate-800">Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <RadioGroupItem value="phone" />
                    <span className="text-sm text-slate-800">Phone</span>
                  </label>
                </RadioGroup>
              </fieldset>

              {method === "email" ? (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
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
                  />
                  {showIdentifierError && (
                    <p className="text-sm italic text-red-500">
                      {email.length === 0
                        ? "Please enter your email."
                        : "That email looks off."}
                    </p>
                  )}
                </Field>
              ) : (
                <Field>
                  <PhoneNumberInput
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
                  />
                  {showIdentifierError && (
                    <p className="text-sm italic text-red-500">
                      Please enter valid phone number
                    </p>
                  )}
                </Field>
              )}

              <Button type="submit" className="w-full">
                Continue
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Google login */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-slate-200 hover:bg-slate-300"
                onClick={() =>
                  signIn("google", { callbackUrl: "/api/auth/google-callback" })
                }
              >
                Continue with Google
              </Button>

              <div className="text-center pb-1 text-sm">
                New user?{" "}
                <a href="/register" className="font-semibold text-slate-800">
                  Sign up
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <a href="/forgot-password" className="text-xs text-slate-500">
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {passwordVisible ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>

                {showPasswordError && (
                  <p className="text-sm italic text-red-500">
                    Password must be at least 6 characters.
                  </p>
                )}

                {loginError && (
                  <p className="text-sm italic text-red-500">
                    {loginError}
                  </p>
                )}
              </Field>

              <Button type="submit" className="w-full">
                Sign in
              </Button>

              <button
                type="button"
                onClick={() => setStep("identifier")}
                className="w-full text-sm text-slate-500"
              >
                ← Use a different {method}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  </main>
);
}
export default function LoginPage() {
  return (
    <main className="...">
      <section>
        <LoginForm />
      </section>
    </main>
  );
}
