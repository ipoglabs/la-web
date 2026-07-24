"use client";

/**
 * OtpVerify — shared "enter the 6-digit code we sent you" step.
 *
 * This didn't exist before: ChangeEmailEditor.tsx imported it from
 * "@/components/otp-verify" but the module was never created, so that
 * editor could not actually compile/render. Built here as a thin wrapper
 * around the same primitives AddPhoneEditor.tsx already uses inline
 * (OtpInput + useResendTimer), so both editors share one OTP UI.
 *
 * `demoCode`, when provided, is shown as a dev-mode hint (used for phone
 * OTPs, since no SMS provider is wired up yet — see otpService.ts).
 */

import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { OtpInput } from "@/components/ui/otp-input";
import { LaButton } from "@/components/la";

export function OtpVerify({
  destination,
  demoCode,
  verifying,
  error,
  onErrorCleared,
  onComplete,
  onResend,
  backLabel,
  onBack,
}: {
  destination: string;
  demoCode?: string;
  verifying: boolean;
  error: boolean;
  onErrorCleared: () => void;
  onComplete: (otp: string) => void;
  onResend: () => void;
  backLabel?: string;
  onBack?: () => void;
}) {
  const { seconds, enabled, reset } = useResendTimer(30);

  function handleResend() {
    if (!enabled) return;
    reset();
    onResend();
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm text-slate-600">
        Enter the 6-digit code we sent to{" "}
        <span className="font-semibold text-slate-900">{destination}</span>
      </p>

      {demoCode && (
        <p className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          Demo code: {demoCode}
        </p>
      )}

      <div className="w-full max-w-[220px]">
        <OtpInput
          error={error}
          disabled={verifying}
          onComplete={onComplete}
          onErrorCleared={onErrorCleared}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          Incorrect code. Please try again.
        </p>
      )}
      {verifying && <p className="text-sm text-slate-500">Verifying...</p>}

      <button
        type="button"
        onClick={handleResend}
        disabled={!enabled}
        className="text-sm font-medium text-blue-700 underline underline-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
      >
        {enabled ? "Resend code" : `Resend code in ${seconds}s`}
      </button>

      {onBack && (
        <LaButton type="button" intent="ghost" size="default" onClick={onBack} className="text-sm">
          {backLabel || "Back"}
        </LaButton>
      )}
    </div>
  );
}
