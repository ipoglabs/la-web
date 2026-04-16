"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { sendOtp } from "@/app/actions/profile/sendOtp";
import { verifyOtp as verifyOtpApi } from "@/app/actions/profile/verifyOtp";
import { updateContact } from "@/app/actions/profile/updateContact";

import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";

import ResponsiveModal from "./ResponsiveModal";

import type { ProfileUser } from "../types";


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
    if (!value.trim()) {
      setError("Value is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
       await sendOtp({
      email: value.trim(),
    });
      setStep("otp");
      setTimer(30);
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

    setLoading(true);
    setError("");

    try {
       await verifyOtpApi({
      email: value.trim(), // ✅ FIXED
      otp,
    });
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
}: any) {

  const router = useRouter();

  const type = label === "Email" ? "email" : "phone";

  const flow = useOtpFlow(initialValue, type);

  useEffect(() => {
    if (open) {
      flow.reset();
      flow.setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = async () => {
  try {
    await updateContact({
      field,
      value: flow.value.trim(), // ✅ ensure trimmed
    });

    toast.success(`${label} updated successfully`);

    router.refresh();   // ✅ THIS FIXES YOUR ISSUE
    onClose();
  } catch (e: any) {
    toast.error(e?.message || "Update failed");
  }
};

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v: boolean) => !v && onClose()}
      title={`Update ${label}`}
    >
      <div className="space-y-5 mt-2">

        {flow.error && (
          <p className="text-sm text-red-500">{flow.error}</p>
        )}

        {/* INPUT */}
        {flow.step === "input" && (
          <>
            <Input
              autoFocus
              value={flow.value}
              onChange={(e) => flow.setValue(e.target.value)}
              placeholder={`Enter ${label}`}
            />

            <Button
              type="button"
              className="w-full"
              disabled={flow.loading || flow.value.trim() === initialValue}
              onClick={flow.sendOtp}
            >
              {flow.loading ? "Sending..." : "Continue"}
            </Button>
          </>
        )}

        {/* OTP */}
        {flow.step === "otp" && (
          <>
            <p className="text-sm text-muted-foreground">
              Enter code sent to <b>{flow.value}</b>
            </p>

            <Input
              value={flow.otp}
              maxLength={6}
              onChange={(e) => flow.setOtp(e.target.value)}
              className="tracking-[0.5em] text-center text-lg"
              placeholder="------"
            />

            <Button
              type="button"
              className="w-full"
              disabled={flow.otp.length !== 6 || flow.loading}
              onClick={() => flow.verifyOtp(handleSave)}
            >
              {flow.loading ? "Verifying..." : "Verify"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={flow.timer > 0}
              onClick={flow.sendOtp}
            >
              {flow.timer > 0
                ? `Resend in ${flow.timer}s`
                : "Resend Code"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={flow.reset}
            >
              Change {label}
            </Button>
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
    null | "email" | "phone" | "secondary1" | "secondary2"
  >(null);

  return (
    <>
      <Form className="space-y-6">

        {/* EMAIL */}
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

        {/* PHONE */}
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

      </Form>

      {/* MODALS */}
      <ContactFieldEditor
        open={active === "email"}
        onClose={() => setActive(null)}
        label="Email"
        initialValue={user.email}
        field="email"
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