"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  error?: boolean;
  disabled?: boolean;
  /** Number of digits to collect before firing onComplete. Default 6. */
  length?: number;
  onComplete: (otp: string) => void;
  onErrorCleared: () => void;
  /**
   * Focus on mount. Default true — safe for the two current callers
   * (TwoFactorAuthEditor, AddPhoneEditor) because this only ever mounts
   * after a user-triggered stage transition inside an already-open,
   * already-settled Drawer/Dialog. Pass `false` (or `!isMobile`) if a
   * future caller ever renders this as a Drawer's *initial* open-mount
   * stage on mobile — forcing the keyboard open while the sheet's own
   * slide-up transform is still animating is the exact iOS Safari bug
   * fixed in LocationPicker.tsx (content vanishes, only the keyboard shows).
   */
  autoFocus?: boolean;
}

export function OtpInput({ error = false, disabled = false, length = 6, onComplete, onErrorCleared, autoFocus = true }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onErrorClearedRef = useRef(onErrorCleared);
  useEffect(() => { onErrorClearedRef.current = onErrorCleared; });

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => {
      setValue("");
      inputRef.current?.focus();
      onErrorClearedRef.current();
    }, 600);
    return () => clearTimeout(t);
  }, [error]);

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, length);
    setValue(digits);
    if (digits.length === length) onComplete(digits);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={length}
      placeholder={"•".repeat(length)}
      aria-label={`${length}-digit OTP code`}
      disabled={disabled}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2",
        "text-center text-lg font-bold tracking-[0.4em]",
        "bg-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error
          ? "border-destructive text-destructive bg-destructive/5"
          : "border-input text-foreground"
      )}
    />
  );
}
