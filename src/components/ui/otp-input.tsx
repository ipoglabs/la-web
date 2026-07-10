"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  error?: boolean;
  disabled?: boolean;
  onComplete: (otp: string) => void;
  onErrorCleared: () => void;
}

export function OtpInput({ error = false, disabled = false, onComplete, onErrorCleared }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onErrorClearedRef = useRef(onErrorCleared);
  useEffect(() => { onErrorClearedRef.current = onErrorCleared; });

  useEffect(() => { inputRef.current?.focus(); }, []);

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
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setValue(digits);
    if (digits.length === 6) onComplete(digits);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      placeholder="••••••"
      aria-label="6-digit OTP code"
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
