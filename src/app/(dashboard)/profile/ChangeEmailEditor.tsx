"use client";

/**
 * ChangeEmailEditor — 4-stage flow for changing the account email in
 * Contact Information on /profile.
 *
 * Stage 1 "enter-email":       new email entry + availability check.
 * Stage 2 "verify-new-email":  OtpVerify — proves the user owns the
 *   new address.
 * Stage 3 "verify-phone":      OtpVerify — second factor via the
 *   account's primary phone (guaranteed to exist, see standing rule:
 *   "Primary phone number is mandatory, always"). No back-link here — once
 *   the new email is verified, the only way out is Cancel (discards
 *   everything) or completing this step.
 * Stage 4 "confirm":           real review screen (shows the new email once
 *   more + explicit "Confirm Change") — never auto-commits right after the
 *   phone OTP passes.
 *
 * Cancel at any stage discards everything; nothing is saved on the account
 * until Stage 4's Confirm Change succeeds. Design locked 2026-07-14.
 *
 * Availability check: POST /api/check-email (real, DB-backed).
 * Email OTP send/verify: sendOtp/verifyOtp server actions (real, DB-backed,
 * same Otp collection used at registration).
 * Phone 2nd-factor OTP: sendOtp/verifyOtp with channel "phone" — DB-backed,
 * but no SMS provider is wired up yet (see otpService.ts), so the code is
 * shown in-app via toast instead of a real text message until one is added.
 * Commit: updateContact({ field: "email", value }) server action.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LaInput } from "@/components/la";
import { OtpVerify } from "@/components/otp-verify";
import { isValidEmail } from "@/lib/validation";
import { sendOtp } from "@/app/actions/profile/sendOtp";
import { verifyOtp } from "@/app/actions/profile/verifyOtp";
import { ResponsiveEditor } from "./ResponsiveEditor";

type Stage = "enter-email" | "verify-new-email" | "verify-phone" | "confirm";

const STAGE_TITLES: Record<Stage, string> = {
  "enter-email": "Change Email Address",
  "verify-new-email": "Verify New Email",
  "verify-phone": "Verify Your Identity",
  confirm: "Confirm Email Change",
};

export function ChangeEmailEditor({
  open,
  onOpenChange,
  currentEmail,
  primaryPhone,
  onVerified,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  /** The account's primary phone, used as the second-factor destination in Stage 3. Always present per the primary-phone-mandatory rule. */
  primaryPhone: string;
  onVerified: (newEmail: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("enter-email");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Fresh state every time the dialog opens
  useEffect(() => {
    if (open) {
      setStage("enter-email");
      setNewEmail("");
      setEmailError("");
      setCheckingAvailability(false);
      setOtpError(false);
      setVerifying(false);
      setSaving(false);
      setDevCode(null);
    }
  }, [open]);

  async function handleSendCode() {
    const trimmed = newEmail.trim();
    if (!trimmed) {
      setEmailError("Please enter your new email address.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (trimmed.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError("This is already your current email address.");
      return;
    }
    setEmailError("");
    setCheckingAvailability(true);
    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't check email availability");
      if (data.exists) {
        setEmailError("This email is already registered to another account.");
        return;
      }
      await sendOtp({ channel: "email", value: trimmed });
      setStage("verify-new-email");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCheckingAvailability(false);
    }
  }

  async function handleNewEmailOtpComplete(otp: string) {
    setVerifying(true);
    try {
      await verifyOtp({ channel: "email", value: newEmail.trim(), otp });
      setOtpError(false);
      const res = await sendOtp({ channel: "phone", value: primaryPhone });
      if (res.devCode) {
        setDevCode(res.devCode);
        toast.info(`Demo phone code (no SMS provider yet): ${res.devCode}`);
      }
      setStage("verify-phone");
    } catch {
      setOtpError(true);
    } finally {
      setVerifying(false);
    }
  }

  async function handlePhoneOtpComplete(otp: string) {
    setVerifying(true);
    try {
      await verifyOtp({ channel: "phone", value: primaryPhone, otp });
      setOtpError(false);
      setStage("confirm");
    } catch {
      setOtpError(true);
    } finally {
      setVerifying(false);
    }
  }

  function handleOtpErrorCleared() {
    setOtpError(false);
  }

  async function handleResendOtp() {
    try {
      if (stage === "verify-new-email") {
        await sendOtp({ channel: "email", value: newEmail.trim() });
      } else if (stage === "verify-phone") {
        const res = await sendOtp({ channel: "phone", value: primaryPhone });
        if (res.devCode) {
          setDevCode(res.devCode);
          toast.info(`Demo phone code (no SMS provider yet): ${res.devCode}`);
          return;
        }
      }
      toast.info("Code resent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't resend code");
    }
  }

  function handleBackToEnterEmail() {
    setStage("enter-email");
    setOtpError(false);
  }

  function handleConfirm() {
    setSaving(true);
    // Actual persistence + old-email security notice happens in
    // updateContact() (called by the parent's onVerified handler) so both
    // the email-change and phone-change flows share one save path.
    onVerified(newEmail.trim());
    setSaving(false);
  }

  const trimmedNewEmail = newEmail.trim();

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title={STAGE_TITLES[stage]}
      onSave={stage === "confirm" ? handleConfirm : handleSendCode}
      saveLabel={
        stage === "confirm"
          ? saving
            ? "Saving..."
            : "Confirm Change"
          : checkingAvailability
            ? "Checking..."
            : "Send code"
      }
      saveDisabled={stage === "confirm" ? saving : checkingAvailability}
      hideSaveButton={stage === "verify-new-email" || stage === "verify-phone"}
    >
      {stage === "enter-email" && (
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm leading-snug text-slate-500">
            Enter the new email address you&apos;d like to use. We&apos;ll send a code to confirm
            it&apos;s yours.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">New Email Address</p>
            <LaInput
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              status={emailError ? "error" : "default"}
            />
          </div>
          {emailError && (
            <p role="alert" className="text-sm font-medium text-rose-600">
              {emailError}
            </p>
          )}
        </div>
      )}

      {stage === "verify-new-email" && (
        <div className="px-6 py-5">
          <OtpVerify
            destination={trimmedNewEmail}
            verifying={verifying}
            error={otpError}
            onErrorCleared={handleOtpErrorCleared}
            onComplete={handleNewEmailOtpComplete}
            onResend={handleResendOtp}
            backLabel="Change email"
            onBack={handleBackToEnterEmail}
          />
        </div>
      )}

      {stage === "verify-phone" && (
        <div className="space-y-4 px-6 py-5">
          <p className="text-center text-sm text-slate-600">
            For your security, we need to confirm this change with your primary phone number.
          </p>
          <OtpVerify
            destination={primaryPhone}
            demoCode={devCode ?? undefined}
            verifying={verifying}
            error={otpError}
            onErrorCleared={handleOtpErrorCleared}
            onComplete={handlePhoneOtpComplete}
            onResend={handleResendOtp}
          />
        </div>
      )}

      {stage === "confirm" && (
        <div className="space-y-3 px-6 py-5">
          <p className="text-sm text-slate-700">You&apos;re changing your account email to:</p>
          <p className="text-lg font-semibold text-slate-900">{trimmedNewEmail}</p>
          <p className="text-sm text-slate-500">
            We&apos;ll send a security alert to your old email ({currentEmail}) letting you know
            this change was made.
          </p>
        </div>
      )}
    </ResponsiveEditor>
  );
}
