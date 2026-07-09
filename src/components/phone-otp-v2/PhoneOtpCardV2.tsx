"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneNumberInput } from "@/components/phone-number-input/PhoneNumberInput";
import { type Country, COUNTRIES } from "@/components/phone-number-input/countries";
import { OtpInput } from "@/components/ui/otp-input";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { VALID_OTP } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MAX_NUMBERS = 3;
const LABELS = ["Primary", "Secondary 1", "Secondary 2"] as const;
const MIN_DIGITS = 5;
// Countries shown in the picker — update here to change across the whole component
const ALLOWED_COUNTRIES: string[] = ["SG", "IN", "GB"];

type Stage = "enter-phone" | "verify-otp" | "summary";

interface VerifiedEntry {
  country: Country;
  phone: string;
  label: (typeof LABELS)[number];
}

/**
 * Phone OTP v2 — same flow as PhoneOtpCard but uses PhoneNumberInput
 * (SVG flags + searchable country picker) instead of native <select>.
 *
 * Stages: enter-phone → verify-otp → summary
 * Supports up to 3 numbers (1 primary + 2 secondary).
 *
 * ## API integration points
 * 1. `handleSend`       — call your "send OTP" endpoint here
 * 2. `handleOtpComplete` — call your "verify OTP" endpoint here
 *
 * ## Customisation
 * - Change which countries appear: edit `ALLOWED_COUNTRIES` at the top of this file
 * - Change default country: edit the `useState` initialiser for `country`
 * - Change max numbers: edit `MAX_NUMBERS`
 */
export function PhoneOtpCardV2() {
  const [stage, setStage] = useState<Stage>("enter-phone");
  const [verified, setVerified] = useState<VerifiedEntry[]>([]);
  const [country, setCountry] = useState<Country>(() => COUNTRIES.find(c => c.code === "SG") ?? COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  const { seconds, enabled, reset } = useResendTimer(30);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Submit on Enter key from the phone input field
  useEffect(() => {
    const el = phoneInputRef.current;
    if (!el || stage !== "enter-phone") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter") handleSend(); };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, phone]);

  function handleSend() {
    const digits = phone.trim();
    if (!digits) { setPhoneError("Please enter your phone number."); return; }
    if (digits.length < MIN_DIGITS) {
      setPhoneError(`Please enter at least ${MIN_DIGITS} digits.`);
      return;
    }
    setPhoneError("");
    setStage("verify-otp"); // TODO: [API] call send-OTP endpoint before advancing
  }

  function handleOtpComplete(otp: string) {
    setVerifying(true);
    // TODO: [API] swap this setTimeout with a real verify-OTP API call
    setTimeout(() => {
      setVerifying(false);
      if (otp === VALID_OTP) {
        setVerified((prev) => [
          ...prev,
          { country, phone, label: LABELS[prev.length] },
        ]);
        setStage("summary");
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

  function handleAddAnother() {
    setCountry(COUNTRIES.find(c => c.code === "SG") ?? COUNTRIES[0]);
    setPhone("");
    setPhoneError("");
    setOtpError(false);
    setOtpErrorMsg("");
    setConfirmingDelete(null);
    reset();
    setStage("enter-phone");
  }

  function handleChangeNumber() {
    setPhone("");
    setPhoneError("");
    setOtpError(false);
    setOtpErrorMsg("");
    setConfirmingDelete(null);
    setStage("enter-phone");
  }

  function handleDelete(index: number) {
    const updated = verified.filter((_, i) => i !== index);
    setVerified(updated);
    setConfirmingDelete(null);
    if (updated.length === 0 && stage === "summary") {
      setStage("enter-phone");
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  if (stage === "summary") {
    const allDone = verified.length >= MAX_NUMBERS;
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold leading-tight">
              {allDone ? "All numbers verified" : "Number verified"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {verified.length} of {MAX_NUMBERS} added
            </p>
          </div>

          <div className="space-y-2">
            {verified.map((entry, i) => {
              const Flag = entry.country.Flag;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-4 py-3 transition-colors",
                    confirmingDelete === i
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-muted/40"
                  )}
                >
                  {confirmingDelete === i ? (
                    <>
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <Flag className="h-4 w-5 shrink-0" />
                        <p className="text-sm font-medium text-destructive truncate">
                          Remove +{entry.country.dial} {entry.phone}?
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button type="button" onClick={() => setConfirmingDelete(null)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                          Cancel
                        </button>
                        <button type="button" onClick={() => handleDelete(i)}
                          className="text-xs font-semibold text-destructive hover:text-destructive/70 transition-colors">
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {LABELS[i]}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Flag className="h-3.5 w-5 shrink-0" />
                          <p className="text-sm font-medium text-foreground truncate">
                            +{entry.country.dial} {entry.phone}
                          </p>
                        </div>
                      </div>
                      <button type="button" aria-label="Remove number"
                        onClick={() => setConfirmingDelete(i)}
                        className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {!allDone && (
            <button type="button" onClick={handleAddAnother}
              className="flex items-center justify-center gap-2 w-full rounded-md border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <Plus className="w-4 h-4" />
              {verified.length === 1 ? "Add secondary number" : "Add another secondary number"}
            </button>
          )}

          <Button className="w-full" onClick={() => {
            setVerified([]);
            setPhone("");
            setCountry(COUNTRIES.find(c => c.code === "SG") ?? COUNTRIES[0]);
            setStage("enter-phone");
          }}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  // ─── Enter phone / Verify OTP ────────────────────────────────────────────────

  return (
    <div className="w-full max-w-sm space-y-3">

      {/* Already-verified chips above the card */}
      {verified.length > 0 && (
        <div className="space-y-2">
          {verified.map((entry, i) => {
            const Flag = entry.country.Flag;
            return (
              <div key={i}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-2.5 transition-colors",
                  confirmingDelete === i
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card"
                )}
              >
                {confirmingDelete === i ? (
                  <>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <Flag className="h-4 w-5 shrink-0" />
                      <p className="text-sm font-medium text-destructive truncate">
                        Remove +{entry.country.dial} {entry.phone}?
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button type="button" onClick={() => setConfirmingDelete(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                      </button>
                      <button type="button" onClick={() => handleDelete(i)}
                        className="text-xs font-semibold text-destructive hover:text-destructive/70 transition-colors">
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">
                        {LABELS[i]}
                      </span>
                      <Flag className="h-3.5 w-5 shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        +{entry.country.dial} {entry.phone}
                      </span>
                    </div>
                    <button type="button" aria-label="Remove number"
                      onClick={() => setConfirmingDelete(i)}
                      className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">

        {stage === "enter-phone" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                {verified.length === 0 ? "Verify your phone" : `Add ${LABELS[verified.length].toLowerCase()} number`}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {verified.length === 0
                  ? "We will send a one-time code to verify it."
                  : "Add a backup number for account recovery."}
              </p>
            </div>

            <div className="space-y-3">
              {/* PhoneNumberInput with SVG flag picker */}
              <PhoneNumberInput
                value={phone}
                country={country}
                onlyCountries={ALLOWED_COUNTRIES}
                onCountryChange={(c) => { setCountry(c); setPhone(""); setPhoneError(""); }}
                onChange={(digits) => { setPhone(digits); setPhoneError(""); }}
                inputRef={phoneInputRef}
              />
              {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
              <Button className="w-full" onClick={handleSend}>
                Send code
              </Button>
            </div>
          </>
        )}

        {stage === "verify-otp" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">Enter the 6-digit code</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm text-muted-foreground">
                  Sent to{" "}
                  <span className="font-medium text-foreground">
                    +{country.dial} {phone}
                  </span>
                </p>
                <span className="text-muted-foreground">·</span>
                <button type="button" onClick={handleChangeNumber}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
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
                <button type="button" onClick={() => reset()}
                  className="font-medium text-foreground hover:underline transition-colors">
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
