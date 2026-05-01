"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { sendOtp } from "@/app/actions/profile/sendOtp";
import { verifyOtp as verifyOtpApi } from "@/app/actions/profile/verifyOtp";
import { updateContact } from "@/app/actions/profile/updateContact";
import { useAutoScrollInput } from "@/hooks/useAutoScrollInput";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";

import ResponsiveModal from "./ResponsiveModal";

import type { ProfileUser } from "../types";

/* ================= VALIDATORS ================= */
const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const isValidPhone = (v: string) =>
  /^[0-9+\- ]{7,15}$/.test(v);

/* ================= OTP HOOK ================= */
function useOtpFlow(initialValue: string, type: "email" | "phone") {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState(initialValue);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const sendOtpHandler = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Value is required");
      return;
    }

    if (type === "email" && !isValidEmail(trimmed)) {
      setError("Enter a valid email");
      return;
    }

    if (
      type === "phone" &&
      !isValidPhone(trimmed) &&
      !trimmed.startsWith("mock")
    ) {
      setError("Enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp({ channel: type, value: trimmed });
      setStep("otp");
      setTimer(30);
      toast.success("OTP sent successfully");
    } catch (e: any) {
      setError(e?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (onSuccess: () => void) => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    // ✅ Mock support
    if (value.startsWith("mock") && otp === "111111") {
      toast.success("Mock OTP verified");
      onSuccess();
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOtpApi({
        channel: type,
        value: value.trim(),
        otp,
      });

      toast.success("OTP verified");
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setOtp("");
    setError("");
    setTimer(0);
  };

  return {
    step,
    value,
    setValue,
    otp,
    setOtp,
    loading,
    error,
    timer,
    sendOtp: sendOtpHandler,
    verifyOtp: verifyOtpHandler,
    reset,
  };
}

/* ================= MODAL ================= */
function ContactFieldEditor({
  open,
  onClose,
  label,
  initialValue,
  field,
  primaryNumber,
}: any) {
  const router = useRouter();

  const isEmailEdit = label === "Email";

  const [stage, setStage] = useState<"phone" | "main">(
    isEmailEdit ? "phone" : "main"
  );

  /* ================= REGISTER STYLE STATE ================= */
  const [otp, setOtp] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  /* ================= EXISTING EMAIL FLOW (UNCHANGED) ================= */
  const flow = useOtpFlow(
    initialValue,
    isEmailEdit ? "email" : "phone"
  );

  useEffect(() => {
    if (open) {
      setStage(isEmailEdit ? "phone" : "main");
      setOtp("");
      setError("");

      flow.reset();
      flow.setValue(initialValue);
    }
  }, [open]);

  /* ================= PHONE SEND OTP ================= */
  const sendPhoneOtp = async () => {
  const composed = String(primaryNumber).trim();

  if (!composed) {
    setError("Phone number missing");
    return;
  }

  // MOCK
  if (composed.startsWith("mock")) {
    toast.success("Mock mode enabled. Use OTP: 111111");
    setOtpSent(true); // ✅ move to OTP UI
    return;
  }

  setLoadingSend(true);
  setError("");

  try {
    const res = await fetch("/api/sms/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: composed }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("OTP sent to your phone");
      setOtpSent(true); // ✅ move to OTP UI
    } else {
      setError(data?.error || "Failed to send OTP");
    }
  } catch {
    setError("Failed to send OTP");
  } finally {
    setLoadingSend(false);
  }
};

  /* ================= PHONE VERIFY ================= */
  const verifyPhoneOtp = async () => {
    if (!otp) return setError("Enter OTP");

    const composed = String(primaryNumber).trim();

    // ✅ MOCK
    if (composed.startsWith("mock")) {
      if (otp === "111111") {
        toast.success("Phone verified (mock)");
        setStage("main");
      } else {
        setError("Wrong mock OTP");
      }
      return;
    }

    setLoadingVerify(true);
    setError("");

    try {
      const res = await fetch("/api/sms/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: composed, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Phone verified");
        setStage("main");
      } else {
        setError(data?.error || "Verification failed");
      }
    } catch {
      setError("Verification failed");
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleSave = async () => {
    await updateContact({
      field,
      value: flow.value.trim(),
    });

    toast.success(`${label} updated`);
    router.refresh();
    onClose();
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v: boolean) => !v && onClose()}
      title={`Update ${label}`}
    >
      <div className="space-y-5 mt-2">

        {/* ================= PHONE STEP ================= */}
        {isEmailEdit && stage === "phone" && (
  <>
    {error && (
      <p className="text-sm text-red-500">{error}</p>
    )}

    {/* STEP 1: BEFORE OTP */}
    {!otpSent && (
      <>
        <p className="text-sm text-muted-foreground">
          This is your primary number:
        </p>

        <p className="text-base font-semibold">
          {primaryNumber}
        </p>

        <p className="text-xs text-muted-foreground">
          We’ll send an OTP to verify it's you
        </p>

        <Button
          className="w-full"
          onClick={sendPhoneOtp}
          disabled={loadingSend}
        >
          {loadingSend ? "Sending..." : "Send OTP"}
        </Button>
      </>
    )}

    {/* STEP 2: AFTER OTP SENT */}
    {otpSent && (
      <>
        <p className="text-sm text-muted-foreground">
          OTP sent to <b>{primaryNumber}</b>
        </p>

        {primaryNumber?.startsWith("mock") && (
          <p className="text-xs text-blue-500">
            Using mock number? Enter <b>111111</b>
          </p>
        )}

        <Input
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          className="tracking-[0.5em] text-center"
          placeholder="------"
        />

        <Button
          className="w-full"
          onClick={verifyPhoneOtp}
          disabled={loadingVerify}
        >
          {loadingVerify ? "Verifying..." : "Verify Phone"}
        </Button>

        {/* OPTIONAL: RESEND */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={sendPhoneOtp}
        >
          Resend OTP
        </Button>
      </>
    )}
  </>
)}

        {/* ================= EXISTING EMAIL FLOW ================= */}
        {(!isEmailEdit || stage === "main") && (
          <>
            {flow.error && (
              <p className="text-sm text-red-500">{flow.error}</p>
            )}

            {flow.step === "input" && (
              <>
                <Input
                  value={flow.value}
                  onChange={(e) => flow.setValue(e.target.value)}
                />

                <Button
                  className="w-full"
                  onClick={flow.sendOtp}
                >
                  Continue
                </Button>
              </>
            )}

            {flow.step === "otp" && (
              <>
                <Input
                  value={flow.otp}
                  onChange={(e) => flow.setOtp(e.target.value)}
                />

                <Button
                  className="w-full"
                  onClick={() => flow.verifyOtp(handleSave)}
                >
                  Verify & Save
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </ResponsiveModal>
  );
}

/* ================= MAIN ================= */
export default function ContactEditForm({
  user,
}: {
  user: ProfileUser;
}) {
  const [active, setActive] = useState<
    null | "email" | "phone"
  >(null);

  return (
    <>
      <div className="space-y-6">

        <FormField label="Email Address">
          <div className="flex justify-between gap-4">
            <Input value={user.email} disabled />
            <Button
              type="button"
              onClick={() => setActive("email")}
              variant="outline"
            >
              Edit
            </Button>
          </div>
        </FormField>

        <FormField label="Phone Number">
          <div className="flex justify-between gap-4">
            <Input value={user.primaryNumber} disabled />
            <Button
              type="button"
              onClick={() => setActive("phone")}
              variant="outline"
            >
              Edit
            </Button>
          </div>
        </FormField>

      </div>

      <ContactFieldEditor
        open={active === "email"}
        onClose={() => setActive(null)}
        label="Email"
        initialValue={user.email}
        field="email"
        primaryNumber={user.primaryNumber}
      />

      <ContactFieldEditor
        open={active === "phone"}
        onClose={() => setActive(null)}
        label="Phone"
        initialValue={user.primaryNumber}
        field="primaryNumber"
      />
    </>
  );
}