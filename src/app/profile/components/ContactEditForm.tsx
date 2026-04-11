"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";

import ResponsiveModal from "./ResponsiveModal";

import type { ProfileUser } from "../types";

/* ================= MOCK DELAY ================= */
const fakeDelay = (ms = 1000) =>
  new Promise((res) => setTimeout(res, ms));

/* ================= OTP HOOK ================= */
function useOtpFlow(initialValue: string) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState(initialValue);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;

    const t = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timer]);

  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await fakeDelay();
      setStep("otp");
      setTimer(30);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (onSuccess: () => void) => {
    setLoading(true);
    setError("");

    try {
      await fakeDelay();

      if (otp.length !== 6) {
        setError("Invalid OTP");
        return;
      }

      onSuccess();
    } catch {
      setError("Invalid OTP");
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
    sendOtp,
    verifyOtp,
    reset,
  };
}

/* ================= REUSABLE MODAL ================= */
function ContactFieldEditor({
  open,
  onClose,
  label,
  initialValue,
  onSave,
}: any) {
  const flow = useOtpFlow(initialValue);

  useEffect(() => {
    if (open) {
      flow.reset();
      flow.setValue(initialValue);
    }
  }, [open, initialValue]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v: boolean) => !v && onClose()}
      title={`Update ${label}`}
    >
      <div className="space-y-5 mt-2">

        {/* ERROR */}
        {flow.error && (
          <p className="text-sm text-red-500">{flow.error}</p>
        )}

        {/* INPUT STEP */}
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
              disabled={
                flow.loading || flow.value.trim() === initialValue
              }
              onClick={flow.sendOtp}
            >
              {flow.loading ? "Sending..." : "Continue"}
            </Button>
          </>
        )}

        {/* OTP STEP */}
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
              onClick={() =>
                flow.verifyOtp(async () => {
                  await fakeDelay();
                  await onSave(flow.value);

                  toast.success(`${label} updated`);
                  onClose();
                })
              }
            >
              {flow.loading ? "Verifying..." : "Verify"}
            </Button>

            {/* RESEND */}
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

/* ================= MAIN COMPONENT ================= */
export default function ContactEditForm({
  user,
}: {
  user: ProfileUser;
}) {
  const router = useRouter();

  const [active, setActive] = useState<
    null | "email" | "phone" | "secondary1" | "secondary2"
  >(null);

  const handleSave = async (payload: any) => {
    await fakeDelay();
    router.refresh();
  };

  return (
    <>
      <Form className="space-y-6">

        {/* EMAIL */}
        <FormField label="Email Address">
          <div className="flex items-end justify-between gap-4">
            <Input value={user.email} disabled className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={() => setActive("email")}
            >
              Edit
            </Button>
          </div>
        </FormField>

        {/* PHONE */}
        <FormField label="Phone Number">
          <div className="flex items-end justify-between gap-4">
            <Input value={user.primaryNumber} disabled className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={() => setActive("phone")}
            >
              Edit
            </Button>
          </div>
        </FormField>

        {/* SECONDARY */}
        <FormFieldWrapper className="space-y-4">

          {/* Secondary 1 */}
          <FormField label="Secondary Number 1">
            <div className="flex items-end justify-between gap-4">
              {user.secondaryNumber1 ? (
                <>
                  <Input value={user.secondaryNumber1} disabled className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActive("secondary1")}
                  >
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1 text-gray-400 text-sm italic">
                    Not added
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActive("secondary1")}
                  >
                    Add
                  </Button>
                </>
              )}
            </div>
          </FormField>

          {/* Secondary 2 */}
          <FormField label="Secondary Number 2">
            <div className="flex items-end justify-between gap-4">
              {user.secondaryNumber2 ? (
                <>
                  <Input value={user.secondaryNumber2} disabled className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActive("secondary2")}
                  >
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1 text-gray-400 text-sm italic">
                    Not added
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActive("secondary2")}
                  >
                    Add
                  </Button>
                </>
              )}
            </div>
          </FormField>

        </FormFieldWrapper>
      </Form>

      {/* EMAIL */}
      <ContactFieldEditor
        open={active === "email"}
        onClose={() => setActive(null)}
        label="Email"
        initialValue={user.email}
        onSave={(value: string) => handleSave({ email: value })}
      />

      {/* PHONE */}
      <ContactFieldEditor
        open={active === "phone"}
        onClose={() => setActive(null)}
        label="Phone"
        initialValue={user.primaryNumber}
        onSave={(value: string) =>
          handleSave({ primaryNumber: value })
        }
      />

      {/* SECONDARY 1 */}
      <ContactFieldEditor
        open={active === "secondary1"}
        onClose={() => setActive(null)}
        label="Secondary Number 1"
        initialValue={user.secondaryNumber1 || ""}
        onSave={(value: string) =>
          handleSave({ secondaryNumber1: value })
        }
      />

      {/* SECONDARY 2 */}
      <ContactFieldEditor
        open={active === "secondary2"}
        onClose={() => setActive(null)}
        label="Secondary Number 2"
        initialValue={user.secondaryNumber2 || ""}
        onSave={(value: string) =>
          handleSave({ secondaryNumber2: value })
        }
      />
    </>
  );
}