"use client";

import { useState, useCallback } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LaInput as Input } from "@/components/la/la-input";
import { OtpInput } from "@/components/ui/otp-input";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { VALID_OTP } from "@/lib/constants";
import { cn, maskEmail, type EmailMaskMode } from "@/lib/utils";

type Stage = "enter-email" | "verify-otp" | "verified";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  /**
   * Controls how the email is displayed in the verify-otp stage.
   *
   * - `"local-first"` (Option A): `j***@gmail.com`      — first char only + domain
   * - `"partial"`     (Option B): `jo***ne@gmail.com`    — first 2 + last 1 of local part
   * - `"full"`        (Option C): `johndoe@gmail.com`    — unmasked (default)
   *
   * @default "full"
   */
  maskMode?: EmailMaskMode;
}

/**
 * Self-contained email address verification flow.
 *
 * Stages: enter-email → verify-otp → verified
 * Supports a single email address only.
 *
 * ## API integration points
 * 1. `handleSend`        — call your "send OTP" endpoint here
 * 2. `handleOtpComplete` — call your "verify OTP" endpoint here
 *
 * @example
 * // Default — full email shown, no masking
 * <EmailOtpCard />
 *
 * // Option A — j***@gmail.com
 * <EmailOtpCard maskMode="local-first" />
 *
 * // Option B — jo***ne@gmail.com
 * <EmailOtpCard maskMode="partial" />
 */
export function EmailOtpCard({ maskMode = "full" }: Props) {
  const [stage, setStage] = useState<Stage>("enter-email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { seconds, enabled, reset } = useResendTimer(30);

  /**
   * Validates the email format and advances to OTP entry.
   *
   * TODO: [API] Replace the setStage call with your send-OTP endpoint:
   * ```ts
   * await api.sendEmailOtp({ email });
   * setStage("verify-otp");
   * ```
   */
  function handleSend() {
    const trimmed = email.trim();
    if (!trimmed) { setEmailError("Please enter your email address."); return; }
    if (!EMAIL_REGEX.test(trimmed)) { setEmailError("Please enter a valid email address."); return; }
    setEmail(trimmed); // normalise — strip any accidental surrounding whitespace
    setEmailError("");
    setStage("verify-otp"); // TODO: [API] call send-OTP endpoint before advancing
  }

  /**
   * Called automatically when the user types the 6th digit.
   * Simulates a 700ms API round-trip, then checks the OTP.
   *
   * TODO: [API] Replace the setTimeout block with your verify-OTP endpoint:
   * ```ts
   * setVerifying(true);
   * try {
   *   await api.verifyEmailOtp({ email, otp });
   *   setStage("verified");
   * } catch {
   *   setOtpError(true);
   *   setOtpErrorMsg("Incorrect code. Try again.");
   * } finally {
   *   setVerifying(false);
   * }
   * ```
   */
  function handleOtpComplete(otp: string) {
    setVerifying(true);
    // TODO: [API] swap this setTimeout with a real verify-OTP API call (see JSDoc above)
    setTimeout(() => {
      setVerifying(false);
      if (otp === VALID_OTP) {
        setStage("verified");
      } else {
        setOtpError(true);
        setOtpErrorMsg("Incorrect code. Try again.");
      }
    }, 700);
  }

  const handleOtpErrorCleared = useCallback(() => {
    setOtpError(false);
    setOtpErrorMsg("");
  }, []);

  function handleChangeEmail() {
    setOtpError(false);
    setOtpErrorMsg("");
    reset(); // restart resend timer so it's fresh when they re-send to the new address
    setStage("enter-email");
  }

  function handleReset() {
    setEmail("");
    setEmailError("");
    setOtpError(false);
    setOtpErrorMsg("");
    reset();
    setStage("enter-email");
  }

  // ─── Verified ────────────────────────────────────────────────────────────────
  if (stage === "verified") {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">Email verified</h2>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{maskEmail(email, maskMode)}</p>
            </div>
          </div>
          <Button className="w-full" onClick={handleReset}>Done</Button>
        </div>
      </div>
    );
  }

  // ─── Enter email + Verify OTP ─────────────────────────────────────────────
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">

        {/* ── Stage: enter-email ── */}
        {stage === "enter-email" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">Verify your email</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                We will send a one-time code to verify it.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  className={cn("pl-9", emailError && "border-destructive focus-visible:ring-destructive")}
                />
              </div>
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              <Button className="w-full" onClick={handleSend}>Send code</Button>
            </div>
          </>
        )}

        {/* ── Stage: verify-otp ── */}
        {stage === "verify-otp" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">Enter the 6-digit code</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm text-muted-foreground">
                  Sent to{" "}
                  <span className="font-medium text-foreground">{maskEmail(email, maskMode)}</span>
                </p>
                <span className="text-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
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

            {verifying ? (
              <p className="text-sm text-muted-foreground text-center">Verifying&hellip;</p>
            ) : otpErrorMsg ? (
              <p className="text-sm text-destructive text-center">{otpErrorMsg}</p>
            ) : null}

            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Didn&apos;t receive it?</span>
              {enabled ? (
                <button
                  type="button"
                  onClick={() => reset()}
                  className="font-medium text-foreground hover:underline transition-colors"
                >
                  Resend
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in{" "}
                  <span className="font-semibold text-foreground tabular-nums">{seconds}s</span>
                </span>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground/50 font-mono">
              Demo OTP: <span className="font-bold tracking-widest">{VALID_OTP}</span>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
