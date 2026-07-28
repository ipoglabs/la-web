"use client";

/**
 * AppleEmailStep — Register · Apple-only detour to collect + verify a real
 * email.
 *
 * Apple's id_token never gives this app a trustworthy, reachable address
 * (see apple-callback/route.ts's header) — whatever it does send lands in
 * `appleEmailId` (models/user.ts), a lookup key only. So every Apple
 * sign-up is routed here by AppleBootstrap, right after OAuth succeeds and
 * before Details/Role, to collect a real email exactly the way Magic Link
 * registration does: send a 6-digit code via the existing
 * `/api/auth/magic-link` + `/api/auth/verify-magic` routes (same
 * Mongo-backed `otpService` used everywhere else), then carry the result
 * into `onboardingStore`'s `identifier`/`proof` fields — the same two
 * fields RoleStep's final `complete-profile` call already reads for every
 * method. complete-profile re-verifies the proof server-side before
 * creating the account (see its Apple branch), so nothing here is trusted
 * just because the client claims it.
 *
 * Guard: only reachable mid-Apple-signup (method "apple", account already
 * silently created per onboardingStore's security-model note) and only
 * until an email has actually been verified — an apple sign-up that has
 * already produced an `identifier` skips straight past this on re-entry.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OtpInput } from "@/components/ui/otp-input";
import { LaButton, LaCard, LaInput } from "@/components/la";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { isValidEmail } from "@/lib/validation";
import { maskEmail, withRedirectParam } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/stores/onboardingStore";

export function AppleEmailStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const method = useOnboardingStore((s) => s.method);
  const accountCreated = useOnboardingStore((s) => s.accountCreated);
  const storeIdentifier = useOnboardingStore((s) => s.identifier);

  const [phase, setPhase] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const { seconds, enabled, reset: resetTimer } = useResendTimer(60);

  const emailValid = isValidEmail(email);

  // Guard: must be mid-Apple-signup. Already-verified (identifier set) —
  // e.g. back button after completing this step — just moves on.
  useEffect(() => {
    if (method !== "apple" || !accountCreated) {
      router.replace("/register");
      return;
    }
    if (storeIdentifier) {
      router.replace(withRedirectParam("/register/details", redirectParam));
    }
  }, [method, accountCreated, storeIdentifier, redirectParam, router]);

  if (method !== "apple" || !accountCreated) return null;
  if (storeIdentifier) return null;

  function handleOtpErrorCleared() {
    setOtpError(false);
    setOtpErrorMsg("");
  }

  async function sendCode(targetEmail: string) {
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    });
    if (!res.ok) throw new Error("send failed");
  }

  async function handleSendCode() {
    setTouched(true);
    if (!emailValid) return;
    setSending(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      await sendCode(trimmedEmail);
      setEmail(trimmedEmail);
      setPhase("otp");
      resetTimer();
    } catch {
      toast.error("Couldn't send your code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleOtpComplete(otp: string) {
    setVerifying(true);
    fetch("/api/auth/verify-magic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
      .then(async (res) => {
        if (res.ok) {
          const { data } = (await res.json()) as { data: { verified: true; proof: string } };
          const { setMethod, setVerified, setProof } = useOnboardingStore.getState();
          setMethod("apple", email);
          setVerified(true);
          setProof(data.proof);
          router.push(withRedirectParam("/register/details", redirectParam));
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
    sendCode(email).catch(() => {
      toast.error("Couldn't resend your code. Please try again.");
    });
  }

  function handleChangeEmail() {
    setPhase("email");
    setOtpError(false);
    setOtpErrorMsg("");
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#e9eef4] px-4 py-12">
      <LaCard className="w-full max-w-xs rounded-2xl p-8 flex flex-col gap-5">
        {phase === "email" ? (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-800">Add your email</h1>
              <p className="text-sm text-slate-600">
                Apple didn&apos;t share a reachable email with us — add yours so we
                can keep your account secure and let buyers/sellers reach you.
              </p>
            </div>

            <div className="space-y-1.5">
              <LaInput
                id="apple-email"
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

            <LaButton
              intent="primary"
              size="default"
              className="w-full"
              disabled={sending}
              onClick={handleSendCode}
            >
              {sending ? "Sending…" : "Send code"}
            </LaButton>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-800">Enter the 6-digit code</h1>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm text-slate-600">
                  Sent to <span className="font-medium text-slate-800">{maskEmail(email, "partial")}</span>
                </p>
                <span className="text-slate-400">·</span>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Change
                </button>
              </div>
            </div>

            <OtpInput
              error={otpError}
              disabled={verifying}
              onComplete={handleOtpComplete}
              onErrorCleared={handleOtpErrorCleared}
            />

            {verifying && <p className="text-sm text-slate-500">Verifying&hellip;</p>}
            {otpErrorMsg && <p className="text-sm text-rose-600">{otpErrorMsg}</p>}

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
          </>
        )}
      </LaCard>
    </div>
  );
}
