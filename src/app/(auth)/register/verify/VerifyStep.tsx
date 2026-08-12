"use client";

/**
 * VerifyStep — Step 2 · OTP / magic-link verification
 *
 * Reads method + identifier from `useRegisterStore` (set on `/register`) —
 * never asks for the identifier again, never carries it in the URL.
 * Guards against direct navigation: bounces back to `/register` if no
 * method was chosen, or if the chosen method doesn't need verification here
 * (google/apple skip straight to `/register/role`).
 *
 * Calls the real verify routes — see `md/api-contracts/auth-register.md`:
 *   phone_otp  → POST /api/auth/phone/verify-otp { phone, otp } — Twilio
 *                Verify (incl. India) when TWILIO_ACCOUNT_SID/AUTH_TOKEN/
 *                VERIFY_SID are set (see lib/twilioVerify.ts), else a
 *                Mongo-generated mock code (dev only).
 *   magic_link → POST /api/auth/verify-magic { email, otp } — always a
 *                real Mongo-generated + emailed code.
 * A network failure (distinct from a wrong code) shows its own message
 * rather than being mistaken for "incorrect code".
 *
 * On success, hands off to the shared `resolveIdentity()` helper (mirrors
 * Login's VerifyStep) instead of always continuing to Details/Role —
 * someone "registering" with an email/phone that already has an account
 * gets signed straight into it, rather than filling in Details/Role only
 * to have `complete-profile` 409 at the very last step.
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OtpInput } from "@/components/ui/otp-input";
import { LaCard } from "@/components/la";
import ConfettiButton from "@/components/confettibutton";
import { useConfettiCelebration } from "@/lib/hooks/useConfettiCelebration";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { maskEmail, withRedirectParam } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";
import { resolveIdentity } from "../../resolveIdentity";

function maskPhone(digits: string): string {
  if (digits.length <= 2) return digits;
  return `${"•".repeat(Math.max(digits.length - 2, 0))}${digits.slice(-2)}`;
}

export function VerifyStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam || "/";
  const method = useOnboardingStore((s) => s.method);
  const identifier = useOnboardingStore((s) => s.identifier);
  const reset = useOnboardingStore((s) => s.reset);

  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { seconds, enabled, reset: resetTimer } = useResendTimer(60);
  const { celebrating, celebrate } = useConfettiCelebration();

  const handleOtpErrorCleared = useCallback(() => {
    setOtpError(false);
    setOtpErrorMsg("");
  }, []);

  // Guard: only phone_otp / magic_link land here, and only with an identifier set.
  useEffect(() => {
    if (method !== "phone_otp" && method !== "magic_link") {
      router.replace("/register");
      return;
    }
    if (!identifier) {
      router.replace("/register");
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
          // Matched → signs the user into their existing account and
          // redirects; no match → hands off into this same store and
          // continues to /register/details exactly as before.
          await resolveIdentity({
            method: method as "phone_otp" | "magic_link",
            identifier,
            proof: data.proof,
            redirectParam,
            redirectTarget,
            router,
            celebrate,
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

  async function handleResend() {
    setResending(true);
    try {
      const endpoint = method === "phone_otp" ? "/api/auth/phone/send-otp" : "/api/auth/magic-link";
      const body = method === "phone_otp" ? { phone: identifier } : { email: identifier };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("resend failed");
      // devCode only comes back when Twilio isn't configured at all (dev
      // only, see otpService.ts).
      const data = await res.json().catch(() => ({}));
      if (data?.devCode) {
        toast.info(`Demo code (no SMS sent): ${data.devCode}`);
      } else {
        toast.success("Code resent.");
      }
      resetTimer();
    } catch {
      toast.error("Couldn't resend your code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  function handleChange() {
    reset();
    router.push(withRedirectParam("/register", redirectParam));
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#e9eef4] px-4 py-12">
      {celebrating && <ConfettiButton autoFire showButton={false} />}
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
              disabled={resending}
              className="text-sm font-semibold text-slate-800 hover:underline disabled:opacity-60 disabled:no-underline"
            >
              {resending ? "Resending…" : "Resend"}
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
