"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { useOtpFlow } from "@/hooks/useOtpFlow";
import { updateContact } from "@/app/actions/profile/updateContact";

import ResponsiveModal from "./ResponsiveModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



function isIndiaMock(value: string) {
  return value.replace(/\s+/g, "").startsWith("+91");
}

export default function EmailEditForm({ open, onClose, user }: any) {
  const router = useRouter();

  const [stage, setStage] = useState<"phone" | "main">("phone");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const flow = useOtpFlow(user.email, "email");

  const sendPhoneOtp = async () => {
  const phone = user.primaryNumber;

  if (!phone) {
    setError("Phone number not found");
    return;
  }

  if (isIndiaMock(phone)) {
    toast.success("Use 111111");
    setOtpSent(true);
    return;
  }

  setLoadingSend(true);
  setError("");

  try {
    await fetch("/api/sms/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    setOtpSent(true);
    toast.success("OTP sent successfully");
  } catch (e: any) {
    setError(e?.message || "Failed to send OTP");
  } finally {
    setLoadingSend(false);
  }
};

const verifyPhoneOtp = async () => {
  const phone = user.primaryNumber;

  if (!phone) {
    setError("Phone number not found");
    return;
  }

  // ✅ mock support
  if (isIndiaMock(phone)) {
    if (otp === "111111") {
      setStage("main");
    } else {
      setError("Wrong code — expected 111111");
    }
    return;
  }

  setLoadingVerify(true);
  setError("");

  try {
    const normalizedPhone = phone.replace(/\s+/g, "");

    await fetch("/api/sms/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: normalizedPhone,
        otp,
      }),
    });

    setStage("main");
  } catch (e: any) {
    setError(e?.message || "Invalid OTP");
  } finally {
    setLoadingVerify(false);
  }
};

const handleSendEmailOtp = async () => {
  const email = flow.value.trim().toLowerCase();

  // ✅ basic validation
  if (!email) {
    flow.setError("Email is required");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    flow.setError("Enter a valid email address");
    return;
  }

  try {
    // ✅ call your API
    const res = await fetch("/api/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.exists) {
      flow.setError("This email is already registered");
      return;
    }

    // ✅ only send OTP if email is free
    await flow.sendOtp(email, false);

  } catch (e: any) {
    flow.setError("Failed to check email");
  }
};

  useEffect(() => {
    if (open) {
      setStage("phone");
      setOtp("");
      setOtpSent(false);
      setError("");
      flow.reset();
      flow.setValue(user.email);
    }
  }, [open]);

  const handleSave = async () => {
    const email = flow.value.trim().toLowerCase();

    if (!email) return flow.setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return flow.setError("Enter a valid email address");
    }

    if (email === user.email?.toLowerCase()) {
      toast.info("You are already using this email");
      return;
    }

    try {
      await updateContact({ field: "email", value: email });

      toast.success("Email updated successfully");
      flow.reset();
      onClose();
    } catch (e: any) {
      flow.setError(e?.message || "Failed to update email");
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={() => onClose()} title="Update Email">
          {/* 🔁 SAME UI reused */}
          <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2 space-y-4">
    
            {/* ================= STEP 1: PHONE VERIFY (NEW UI) ================= */}
    {stage === "phone" && (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    
        {/* ================= ENTER PHONE ================= */}
        {!otpSent && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Verify your phone
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                We will send a one-time code to verify it.
              </p>
            </div>
    
            <div className="space-y-3">
              {/* Showing existing primary number (no change in logic) */}
              <div className="text-sm font-medium">
                {user.primaryNumber}
              </div>
    
              <Button
                className="w-full"
                onClick={sendPhoneOtp}
                disabled={loadingSend}
              >
                {loadingSend ? "Sending..." : "Send code"}
              </Button>
            </div>
          </>
        )}
    
        {/* ================= VERIFY OTP ================= */}
        {otpSent && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Enter the 6-digit code
              </h2>
    
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm text-muted-foreground">
                  Sent to{" "}
                  <span className="font-medium text-foreground">
                    {user.primaryNumber}
                  </span>
                </p>
    
                <span className="text-muted-foreground">·</span>
    
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Change
                </button>
              </div>
            </div>
    
            {/* OTP INPUT */}
            <Input
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-[0.5em] text-lg"
              placeholder="------"
            />
    
            {/* STATUS */}
            {loadingVerify ? (
              <p className="text-sm text-muted-foreground text-center">
                Verifying...
              </p>
            ) : error ? (
              <p className="text-sm text-destructive text-center">
                {error}
              </p>
            ) : null}
    
            {/* VERIFY BUTTON */}
            <Button
              className="w-full"
              onClick={verifyPhoneOtp}
              disabled={loadingVerify}
            >
              Verify Phone
            </Button>
    
            {/* RESEND */}
            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-muted-foreground">
                Didn’t receive it?
              </span>
    
              <button
                type="button"
                onClick={sendPhoneOtp}
                className="font-medium text-foreground hover:underline"
              >
                Resend
              </button>
            </div>
    
            {/* MOCK SUPPORT */}
            {user.primaryNumber?.startsWith("mock") && (
              <p className="text-center text-xs text-muted-foreground font-mono">
                Demo OTP: <span className="font-bold tracking-widest">111111</span>
              </p>
            )}
          </>
        )}
      </div>
    )}
    
            {/* STEP 2 */}
            {/* ================= STEP 2: EMAIL EDIT (NEW UI) ================= */}
            {stage === "main" && (
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
    
                {/* ── Stage: enter-email ── */}
                {flow.step === "input" && (
                  <>
                    <div>
                      <h2 className="text-base font-semibold leading-tight">
                        Update your email
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Enter your new email address to continue.
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
                          value={flow.value}
                          onChange={(e) => flow.setValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendEmailOtp();
                            }
                            }}
                          className="pl-9"
                        />
                      </div>
    
                      {flow.error && (
                        <p className="text-sm text-destructive">{flow.error}</p>
                      )}
    
                      <Button className="w-full" onClick={() => flow.sendOtp(flow.value, false)}>
                        Send code
                      </Button>
                    </div>
                  </>
                )}
    
                {/* ── Stage: verify-otp ── */}
                {flow.step === "otp" && (
                  <>
                    <div>
                      <h2 className="text-base font-semibold leading-tight">
                        Enter the 6-digit code
                      </h2>
    
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-sm text-muted-foreground">
                          Sent to{" "}
                          <span className="font-medium text-foreground">
                            {flow.value}
                          </span>
                        </p>
    
                        <span className="text-muted-foreground">·</span>
    
                        <button
                          type="button"
                          onClick={() => flow.reset()}
                          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                        >
                          Change
                        </button>
                      </div>
                    </div>
    
                    {/* OTP INPUT */}
                    <Input
                      value={flow.otp}
                      maxLength={6}
                      onChange={(e) => flow.setOtp(e.target.value)}
                      className="text-center tracking-[0.5em] text-lg"
                      placeholder="------"
                    />
    
                    {/* STATUS */}
                    {flow.loading ? (
                      <p className="text-sm text-muted-foreground text-center">
                        Verifying...
                      </p>
                    ) : flow.error ? (
                      <p className="text-sm text-destructive text-center">
                        {flow.error}
                      </p>
                    ) : null}
    
                    {/* VERIFY BUTTON */}
                    <Button
                      className="w-full"
                      onClick={() =>
                        flow.verifyOtp(flow.value, async () => {
                          await handleSave();
                        })
                      }
                    >
                      Verify & Save
                    </Button>
    
                    {/* RESEND */}
                    <div className="flex items-center justify-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">
                        Didn’t receive it?
                      </span>
    
                      <button
                        type="button"
                        onClick={() => flow.sendOtp(flow.value, false)}
                        className="font-medium text-foreground hover:underline"
                      >
                        Resend
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </ResponsiveModal>
  );
}