"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { useResendTimer } from "@/hooks/useResendTimer";
import { useRegisterStore } from "@/store/registerStore";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export default function EmailVerificationPage() {
  const router = useRouter();
  const { general, emailVerified, setEmailVerified, setVerifiedEmail } =
    useRegisterStore();

  const email = (general.email || "").trim().toLowerCase();

  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const { seconds, enabled, reset } = useResendTimer(30);
  const autoSentRef = useRef(false);

  const lockActive = lockUntil ? Date.now() < lockUntil : false;
  const lockSecondsLeft = lockUntil
    ? Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))
    : 0;

  useEffect(() => {
    if (!email) return;
    const raw = localStorage.getItem(`email-otp-guard:${email}`);
    if (!raw) return;
    try {
      const { attempts, lockUntil } = JSON.parse(raw);
      setAttempts(attempts || 0);
      setLockUntil(lockUntil || null);
    } catch {}
  }, [email]);

  useEffect(() => {
    if (!email || emailVerified || autoSentRef.current) return;
    autoSentRef.current = true;
    void sendOtp();
  }, [email, emailVerified]);

  const persistGuard = (nextAttempts: number, nextLockUntil: number | null) => {
    localStorage.setItem(
      `email-otp-guard:${email}`,
      JSON.stringify({ attempts: nextAttempts, lockUntil: nextLockUntil })
    );
  };

  async function sendOtp() {
    if (!email) return;
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        reset();
        toast.success("We sent a 6-digit code to your email.");
      } else {
        toast.error(data?.error || "Failed to send code");
        autoSentRef.current = false;
      }
    } catch {
      toast.error("Failed to send code.");
      autoSentRef.current = false;
    }
  }

  async function handleOtpComplete(otp: string) {
    if (lockActive) {
      toast.error(
        `Too many attempts. Try again in ${Math.ceil(lockSecondsLeft / 60)} minutes.`
      );
      return;
    }

    setVerifying(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        setEmailVerified(true);
        setVerifiedEmail(email);
        setAttempts(0);
        setLockUntil(null);
        persistGuard(0, null);
        toast.success("Email verified ✅");
      } else {
        const nextAttempts = attempts + 1;
        let nextLockUntil: number | null = null;

        if (nextAttempts >= MAX_ATTEMPTS) {
          nextLockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
          toast.error("Too many attempts. Locked for 15 minutes.");
        } else {
          setOtpError(true);
          setOtpErrorMsg("Incorrect code. Try again.");
        }

        setAttempts(nextAttempts);
        setLockUntil(nextLockUntil);
        persistGuard(nextAttempts, nextLockUntil);
      }
    } catch {
      setOtpError(true);
      setOtpErrorMsg("Verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  const handleOtpErrorCleared = useCallback(() => {
    setOtpError(false);
    setOtpErrorMsg("");
  }, []);

  // ── Verified ──────────────────────────────────────────────────────────────
  if (emailVerified) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-semibold leading-tight">Email verified</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-sm text-muted-foreground truncate">{email}</p>
                    <span className="text-muted-foreground">·</span>
                    <button
                      type="button"
                      onClick={() => router.push("/register")}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/register/phone-verification")}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Verify OTP ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold leading-tight">
                  Enter the 6-digit code
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Sent to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            </div>

            <OtpInput
              error={otpError}
              disabled={verifying || lockActive}
              onComplete={handleOtpComplete}
              onErrorCleared={handleOtpErrorCleared}
            />

            {lockActive ? (
              <p className="text-sm text-destructive text-center">
                Locked for security. Try again in{" "}
                <span className="font-semibold">{lockSecondsLeft}s</span>
              </p>
            ) : verifying ? (
              <p className="text-sm text-muted-foreground text-center">
                Verifying&hellip;
              </p>
            ) : otpErrorMsg ? (
              <p className="text-sm text-destructive text-center">{otpErrorMsg}</p>
            ) : null}

            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Didn&apos;t receive it?</span>
              {enabled ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="font-medium text-foreground hover:underline transition-colors"
                >
                  Resend
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {seconds}s
                  </span>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
