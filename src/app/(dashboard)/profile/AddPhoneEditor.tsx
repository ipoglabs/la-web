"use client";

/**
 * AddPhoneEditor — 2-stage OTP flow for adding OR editing a phone number in
 * Contact Information on /profile.
 *
 * Stage 1 "enter-phone": country + number entry (PhoneNumberInput, scoped to
 *   the 3 active markets), duplicate-number check before sending.
 * Stage 2 "verify-otp":  OtpInput (auto-submits at 6 digits) + resend timer.
 *
 * Pass `initialValue` (the current stored number) to switch this into edit
 * mode: stage 1 prefills with that number, and if the user saves without
 * changing it, no OTP is required (it's already verified). Any different
 * number — new or edited — must always pass OTP before onVerified fires.
 *
 * On success: calls onVerified(fullNumber) — the parent applies the number
 * (append for add, replace for edit) and closes this dialog. Cancel/close at
 * either stage discards everything; nothing is saved until verification
 * succeeds.
 *
 * Send/verify goes through the real sendOtp/verifyOtp server actions
 * (channel: "phone") — DB-backed via the Otp collection, same as email OTP.
 * No SMS provider is wired up yet (see otpService.ts), so instead of a real
 * text message the code is shown via toast/on-screen until one is added.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PhoneNumberInput } from "@/components/phone-number-input/PhoneNumberInput";
import { COUNTRIES, type Country } from "@/components/phone-number-input/countries";
import { OtpInput } from "@/components/ui/otp-input";
import { useResendTimer } from "@/lib/hooks/useResendTimer";
import { isValidPhone, normalizePhoneDigits } from "@/lib/validation";
import { sendOtp } from "@/app/actions/profile/sendOtp";
import { verifyOtp } from "@/app/actions/profile/verifyOtp";
import { cn } from "@/lib/utils";
import { ResponsiveEditor } from "./ResponsiveEditor";

// Countries shown in the picker — same 3 active markets as everywhere else
export const ALLOWED_COUNTRIES = ["SG", "IN", "GB"];
const MIN_DIGITS = 5;

function defaultCountryFor(hint: string | undefined): Country {
  const lower = (hint ?? "").trim().toLowerCase();
  const code = lower.includes("india")
    ? "IN"
    : lower.includes("kingdom") || lower === "uk" || lower === "gb"
      ? "GB"
      : "SG";
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

/**
 * Splits a stored full number (e.g. "+65 9123 4567") back into its country
 * + local digits, so an existing number can be re-edited with the same
 * country-picker input used when adding one. Falls back to SG if the dial
 * code isn't recognised among the 3 active markets.
 */
export function parsePhoneNumber(value: string): { country: Country; digits: string } {
  const trimmed = value.trim();
  const match = trimmed.match(/^\+(\d{1,3})\s*(.*)$/);
  if (match) {
    const found = COUNTRIES.find((c) => ALLOWED_COUNTRIES.includes(c.code) && c.dial === match[1]);
    if (found) return { country: found, digits: match[2].replace(/\D/g, "") };
  }
  return { country: defaultCountryFor(undefined), digits: trimmed.replace(/\D/g, "") };
}

type Stage = "enter-phone" | "verify-otp";

export function AddPhoneEditor({
  open,
  onOpenChange,
  existingNumbers,
  defaultCountryHint,
  initialValue,
  onVerified,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Full formatted numbers already on the account — used for duplicate check */
  existingNumbers: string[];
  /** Residence country name (e.g. "India") — used to preselect the dial code */
  defaultCountryHint?: string;
  /** Present when editing an existing number — prefills stage 1 with it, and
   *  OTP is skipped only if the user saves without changing it. */
  initialValue?: string;
  onVerified: (fullNumber: string) => void;
}) {
  const isEditing = !!initialValue;
  const [stage, setStage] = useState<Stage>("enter-phone");
  const [country, setCountry] = useState<Country>(() =>
    initialValue ? parsePhoneNumber(initialValue).country : defaultCountryFor(defaultCountryHint)
  );
  const [phone, setPhone] = useState(() => (initialValue ? parsePhoneNumber(initialValue).digits : ""));
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const { seconds, enabled, reset } = useResendTimer(30);

  // Fresh state every time the dialog opens
  useEffect(() => {
    if (open) {
      setStage("enter-phone");
      if (initialValue) {
        const parsed = parsePhoneNumber(initialValue);
        setCountry(parsed.country);
        setPhone(parsed.digits);
      } else {
        setCountry(defaultCountryFor(defaultCountryHint));
        setPhone("");
      }
      setPhoneError("");
      setOtpError(false);
      setVerifying(false);
      setDevCode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fullNumber = `+${country.dial} ${phone}`;

  async function handleSend() {
    const digits = phone.trim();
    if (!digits) {
      setPhoneError("Please enter your phone number.");
      return;
    }
    if (!isValidPhone(digits, MIN_DIGITS)) {
      setPhoneError(`That number's too short — enter at least ${MIN_DIGITS} digits.`);
      return;
    }
    // Compare normalized digits (not raw formatted strings) — stored numbers
    // and freshly-typed numbers can have different spacing for the same value.
    const isDuplicate = existingNumbers.some(
      (n) => normalizePhoneDigits(n) === normalizePhoneDigits(fullNumber)
    );
    if (isDuplicate) {
      setPhoneError("That number's already on your account.");
      return;
    }
    // Editing but the number didn't actually change — it's already verified.
    if (isEditing && normalizePhoneDigits(fullNumber) === normalizePhoneDigits(initialValue ?? "")) {
      onOpenChange(false);
      return;
    }
    setPhoneError("");
    setSending(true);
    try {
      const res = await sendOtp({ channel: "phone", value: fullNumber });
      if (res.devCode) {
        setDevCode(res.devCode);
        toast.info(`Demo code (no SMS provider yet): ${res.devCode}`);
      }
      reset();
      setStage("verify-otp");
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : "Couldn't send verification code");
    } finally {
      setSending(false);
    }
  }

  async function handleOtpComplete(otp: string) {
    setVerifying(true);
    try {
      await verifyOtp({ channel: "phone", value: fullNumber, otp });
      onVerified(fullNumber);
    } catch {
      setOtpError(true);
    } finally {
      setVerifying(false);
    }
  }

  function handleOtpErrorCleared() {
    setOtpError(false);
  }

  async function handleResend() {
    if (!enabled) return;
    reset();
    try {
      const res = await sendOtp({ channel: "phone", value: fullNumber });
      if (res.devCode) {
        setDevCode(res.devCode);
        toast.info(`Demo code (no SMS provider yet): ${res.devCode}`);
        return;
      }
      toast.info("Code resent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't resend code");
    }
  }

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title={
        stage === "enter-phone"
          ? isEditing
            ? "Edit Phone Number"
            : "Add Phone Number"
          : "Verify Your Phone"
      }
      onSave={handleSend}
      saveLabel={sending ? "Sending..." : "Send code"}
      saveDisabled={sending}
      hideSaveButton={stage === "verify-otp"}
    >
      {stage === "enter-phone" ? (
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm leading-snug text-slate-500">
            {isEditing
              ? "Changing your number requires a one-time code to verify it."
              : "We will send a one-time code to verify it."}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Phone Number</p>
            <PhoneNumberInput
              value={phone}
              onChange={(digits) => {
                setPhone(digits);
                if (phoneError) setPhoneError("");
              }}
              country={country}
              onCountryChange={setCountry}
              onlyCountries={ALLOWED_COUNTRIES}
              placeholder="1234512345"
            />
          </div>
          {phoneError && <p className="text-sm text-rose-600">{phoneError}</p>}
        </div>
      ) : (
        <div className="space-y-4 px-6 py-5">
          <p className="text-center text-sm text-slate-600">
            We texted a 6-digit code to{" "}
            <span className="font-semibold text-slate-800">{fullNumber}</span>
          </p>
          <OtpInput
            error={otpError}
            disabled={verifying}
            onComplete={handleOtpComplete}
            onErrorCleared={handleOtpErrorCleared}
          />
          {verifying ? (
            <p className="text-center text-sm text-slate-500">Checking your code&hellip;</p>
          ) : otpError ? (
            <p className="text-center text-sm font-medium text-red-600">That code didn't match — give it another try.</p>
          ) : devCode ? (
            <p className="text-center text-sm text-slate-500">
              Demo code (no SMS provider yet): <span className="font-bold tracking-widest text-slate-700">{devCode}</span>
            </p>
          ) : null}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setStage("enter-phone")}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Change number
            </button>
            <button
              type="button"
              disabled={!enabled}
              onClick={handleResend}
              className={cn(
                "text-sm font-semibold",
                enabled ? "text-blue-700 hover:text-blue-800" : "cursor-not-allowed text-slate-400",
              )}
            >
              {enabled ? "Resend code" : `Resend in ${seconds}s`}
            </button>
          </div>
        </div>
      )}
    </ResponsiveEditor>
  );
}
