"use client";

/**
 * VerifyStep — Login Step 2 · OTP / magic-link verification
 *
 * Mirrors Register's VerifyStep exactly in structure and OTP handling,
 * but on success calls `resolveIdentity()` instead of always creating a
 * fresh account — see `md/feature-spec-doc/login-journey.md` and
 * `resolveIdentity.ts`.
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OtpInput } from "@/components/ui/otp-input";
import { LaCard } from "@/components/la";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { maskEmail } from "@/lib/utils";
import { useLoginStore } from "@/lib/stores/loginStore";
import { resolveIdentity } from "../resolveIdentity";

function maskPhone(digits: string): string {
  if (digits.length <= 2) return digits;
  return `${"•".repeat(Math.max(digits.length - 2, 0))}${digits.slice(-2)}`;
}

export function VerifyStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = useLoginStore((s) => s.method);
  const identifier = useLoginStore((s) => s.identifier);
  const setVerified = useLoginStore((s) => s.setVerified);
  const reset = useLoginStore((s) => s.reset);

  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { seconds, enabled, reset: resetTimer } = useResendTimer(60);

  const redirectTarget = searchParams.get("redirect") || "/";

  const handleOtpErrorCleared = useCallback(() => {
    setOtpError(false);
    setOtpErrorMsg("");
  }, []);

  // Guard: only phone_otp / magic_link land here, and only with an identifier set.
  useEffect(() => {
    if (method !== "phone_otp" && method !== "magic_link") {
      router.replace("/login");
      return;
    }
    if (!identifier) {
      router.replace("/login");
    }
  }, [method, identifier, router]);

  if (method !== "phone_otp" && method !== "magic_link") return null;
  if (!identifier) return null;

  const maskedIdentifier = method === "magic_link" ? maskEmail(identifier, "partial") : maskPhone(identifier);

  function handleOtpComplete(otp: string) {
    setVerifying(true);
    const endpoint = method === "phone_otp" ? "/api/auth/phone/verify-otp" : "/api/auth/verify-magic";
    const body = method === "phone_otp" ? { phone: identifier, otp } : { email: identifier, otp };
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.ok) {
          const { data } = (await res.json()) as { data: { verified: true; proof: string } };
          setVerified(true);
          await resolveIdentity({
            method: method as "phone_otp" | "magic_link",
            identifier,
            proof: data.proof,
            redirectParam: searchParams.get("redirect"),
            redirectTarget,
            router,
          });
          return;
        }
        if (res.status === 422) {
          setOtpError(true);
          setOtpErrorMsg("Incorrect code. Please try again.");
          return;
        }
        throw new Error(`verify failed (${res.status})`);
      })
      .catch(() => {
        setOtpError(true);
        setOtpErrorMsg("Couldn't verify right now. Please try again.");
      })
      .finally(() => setVerifying(false));
  }

  function handleResend() {
    resetTimer();
    // TODO: [API] re-send OTP / magic link
  }

  function handleChange() {
    reset();
    router.push("/login");
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#e9eef4] px-4 py-12">
      <LaCard className="w-full max-w-xs rounded-2xl p-8 flex flex-col gap-5">

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-slate-800">Enter the 6-digit code</h1>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm text-slate-600">
              Sent to <span className="font-medium text-slate-800">{maskedIdentifier}</span>
            </p>
            <span className="text-slate-400">·</span>
            <button
              type="button"
              onClick={handleChange}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Change
            </button>
          </div>
        </div>

        {/* OTP input */}
        <OtpInput
          error={otpError}
          disabled={verifying}
          onComplete={handleOtpComplete}
          onErrorCleared={handleOtpErrorCleared}
        />

        {/* Status messages */}
        {verifying && <p className="text-sm text-slate-500">Verifying&hellip;</p>}
        {otpErrorMsg && <p className="text-sm text-rose-600">{otpErrorMsg}</p>}

        {/* Resend */}
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-slate-500">Didn&apos;t receive it?</p>
          {enabled ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-slate-800 hover:underline"
            >
              Resend
            </button>
          ) : (
            <p className="text-sm text-slate-500">
              Resend in <span className="font-bold text-slate-800">{seconds}s</span>
            </p>
          )}
        </div>
    </LaCard>
    </div>
  );
}
