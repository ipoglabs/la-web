"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import AppHeader from "../components/AppHeader/appHeader";
import AppFooter from "../components/AppFooter/appFooter";
import { useAuthStore } from "@/store/authStore";

type LoginForm = {
  identifier: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof LoginForm, string>>;

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikePhone(value: string) {
  // very loose: allows +65..., 91234567, 09123..., etc.
  return /^[+]?[\d\s()-]{7,}$/.test(value.trim());
}

function mapLoginError(opts: {
  status: number;
  apiError?: string;
  identifierValue: string;
}) {
  const { status, apiError, identifierValue } = opts;

  const msg = (apiError || "").toLowerCase();

  // defaults
  const out: { general?: string; fields?: FieldErrors } = {
    general: "Login failed. Please try again.",
    fields: {},
  };

  // --- map by status (best) ---
  if (status === 400) {
    out.general = "Please check your input and try again.";
    // if your API says missing fields, show on respective inputs
    if (msg.includes("identifier") || msg.includes("email") || msg.includes("phone")) {
      out.fields!.identifier = apiError || "Please enter your email or phone number.";
      out.general = undefined;
    }
    if (msg.includes("password")) {
      out.fields!.password = apiError || "Please enter your password.";
      out.general = undefined;
    }
    return out;
  }

  if (status === 401) {
    // usually wrong password or invalid credentials
    if (msg.includes("password") || msg.includes("invalid") || msg.includes("credentials")) {
      out.fields!.password = "Incorrect password. Please try again.";
      out.general = undefined;
      return out;
    }
    out.general = apiError || "Invalid credentials. Please try again.";
    return out;
  }

  if (status === 404) {
    // account not found
    out.fields!.identifier =
      apiError || "Account not found with that email / phone.";
    out.general = undefined;
    return out;
  }

  if (status === 429) {
    out.general = "Too many attempts. Please wait a bit and try again.";
    return out;
  }

  // --- map by message text (fallback) ---
  if (msg.includes("account not found") || msg.includes("user not found")) {
    out.fields!.identifier = apiError || "Account not found with that email / phone.";
    out.general = undefined;
    return out;
  }

  if (msg.includes("incorrect password") || msg.includes("wrong password")) {
    out.fields!.password = "Incorrect password. Please try again.";
    out.general = undefined;
    return out;
  }

  if (msg.includes("verify") && msg.includes("email")) {
    out.general = apiError || "Please verify your email before logging in.";
    return out;
  }

  // if identifier format looks bad, show helpful message
  const trimmed = identifierValue.trim();
  if (trimmed && !isEmail(trimmed) && !looksLikePhone(trimmed)) {
    out.fields!.identifier = "Enter a valid email or phone number.";
    out.general = undefined;
    return out;
  }

  out.general = apiError || out.general;
  return out;
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // banner error + field errors
  const [generalError, setGeneralError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear that field error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setGeneralError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Read text first (so we can parse safely even if empty / non-json)
      const text = await res.text();
      const json = safeJsonParse<any>(text);

      if (!res.ok) {
        const apiError =
          json?.error || json?.message || (text && text !== "undefined" ? text : "");

        const mapped = mapLoginError({
          status: res.status,
          apiError,
          identifierValue: formData.identifier,
        });

        if (mapped.fields && Object.keys(mapped.fields).length > 0) {
          setFieldErrors(mapped.fields);
        }
        if (mapped.general) {
          setGeneralError(mapped.general);
        }

        setLoading(false);
        return;
      }

      // success
      const data = json ?? {};

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAuth(data.token, data.user);
      }

      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setGeneralError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Access your account securely with your email or phone number.
          </p>

          {generalError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email OR Phone */}
            <div>
              <Label htmlFor="identifier" className="text-sm mb-1 text-gray-700 block">
                Email or phone number
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="e.g. you@example.com or +65 9123 4567"
                required
                value={formData.identifier}
                onChange={handleChange}
                className={fieldErrors.identifier ? "border-red-400 focus-visible:ring-red-300" : ""}
              />
              {fieldErrors.identifier && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Label htmlFor="password" className="text-sm mb-1 text-gray-700 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`pr-10 ${
                  fieldErrors.password ? "border-red-400 focus-visible:ring-red-300" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-9 right-3 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full text-lg font-medium" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("google")}
              type="button"
            >
              <FaGoogle /> Login with Google
            </Button>
          </div>
        </div>
      </div>

      <AppFooter />
    </>
  );
}
