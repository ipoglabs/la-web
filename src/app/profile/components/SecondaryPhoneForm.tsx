"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { useOtpFlow } from "@/hooks/useOtpFlow";
import { updateContact } from "@/app/actions/profile/updateContact";

import ResponsiveModal from "./ResponsiveModal";

import { PhoneNumberInput } from "../components/phone-number-input/PhoneNumberInput";
import {
  type Country,
  COUNTRIES,
} from "../components/phone-number-input/countries";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

function isIndiaMock(value: string) {
  return value.replace(/\s+/g, "").startsWith("+91");
}

export default function SecondaryPhoneForm({
  open,
  onClose,
  user,
  field,
}: any) {
  const router = useRouter();

  const existingValue = user[field];

  // ✅ Require email verification ONLY if editing existing secondary number
  const requiresEmailVerification = !!existingValue;

  const [stage, setStage] = useState<"email" | "main">(
    requiresEmailVerification ? "email" : "main"
  );

  const flow = useOtpFlow(existingValue || "", "phone");
  const emailFlow = useOtpFlow(user.email, "email");

  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === "SG") ?? COUNTRIES[0]
  );

  useEffect(() => {
    if (open) {
      setStage(requiresEmailVerification ? "email" : "main");

      flow.reset();
      emailFlow.reset();

      // ✅ detect country from existing phone
      if (existingValue?.startsWith("+")) {
        const matchedCountry = COUNTRIES.find((c) =>
          existingValue.startsWith(`+${c.dial}`)
        );

        if (matchedCountry) {
          setCountry(matchedCountry);

          const localNumber = existingValue.replace(
            `+${matchedCountry.dial}`,
            ""
          );

          flow.setValue(localNumber);
        } else {
          flow.setValue(existingValue);
        }
      } else {
        flow.setValue(existingValue || "");
      }

      emailFlow.setValue(user.email);
    }
  }, [open]);

  const getFullPhone = () => {
    let local = String(flow.value || "").trim();

    if (!local) return "";

    // remove spaces/dashes
    local = local.replace(/[^\d+]/g, "");

    // already full phone
    if (local.startsWith("+")) {
      return local;
    }

    return `+${country.dial}${local}`;
  };

  const handleSave = async () => {
    const fullPhone = getFullPhone();

    // validate
    if (!/^\+\d{10,15}$/.test(fullPhone)) {
      flow.setError("Enter valid phone number");
      return;
    }

    // prevent same as primary
    if (fullPhone === user.primaryNumber) {
      flow.setError("Cannot use primary number");
      return;
    }

    // prevent duplicate secondary
    const otherField =
      field === "secondaryNumber1"
        ? user.secondaryNumber2
        : user.secondaryNumber1;

    if (fullPhone === otherField) {
      flow.setError("Number already added");
      return;
    }

    await updateContact({
      field,
      value: fullPhone,
    });

    toast.success(
      existingValue
        ? "Secondary number updated"
        : "Secondary number added"
    );

    router.refresh();
    onClose();
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={() => onClose()}
      title={
        field === "secondaryNumber1"
          ? "Secondary Number 1"
          : "Secondary Number 2"
      }
    >
      <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2 space-y-4">

        {/* ================= EMAIL VERIFY ================= */}
        {stage === "email" && (
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">

            {/* INPUT */}
            {emailFlow.step === "input" && (
              <>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    Verify your email
                  </h2>

                  <p className="text-sm text-muted-foreground mt-0.5">
                    We will send a one-time verification code.
                  </p>
                </div>

                <div className="space-y-3">

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

                    <Input
                      value={user.email}
                      disabled
                      className="pl-9"
                    />
                  </div>

                  {emailFlow.error && (
                    <p className="text-sm text-destructive">
                      {emailFlow.error}
                    </p>
                  )}

                  <Button
                    className="w-full"
                    onClick={() =>
                      emailFlow.sendOtp(user.email, true)
                    }
                  >
                    Send code
                  </Button>

                </div>
              </>
            )}

            {/* OTP */}
            {emailFlow.step === "otp" && (
              <>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    Enter the 6-digit code
                  </h2>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-sm text-muted-foreground">
                      Sent to{" "}
                      <span className="font-medium text-foreground">
                        {user.email}
                      </span>
                    </p>

                    <span className="text-muted-foreground">·</span>

                    <button
                      type="button"
                      onClick={() => emailFlow.reset()}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <Input
                  value={emailFlow.otp}
                  maxLength={6}
                  onChange={(e) =>
                    emailFlow.setOtp(e.target.value)
                  }
                  className="text-center tracking-[0.5em] text-lg"
                  placeholder="------"
                />

                {emailFlow.loading ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Verifying...
                  </p>
                ) : emailFlow.error ? (
                  <p className="text-sm text-destructive text-center">
                    {emailFlow.error}
                  </p>
                ) : null}

                <Button
                  className="w-full"
                  onClick={() =>
                    emailFlow.verifyOtp(
                      emailFlow.value,
                      () => setStage("main")
                    )
                  }
                >
                  Verify Email
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">
                    Didn’t receive it?
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      emailFlow.sendOtp(user.email, true)
                    }
                    className="font-medium text-foreground hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= PHONE FLOW ================= */}
        {stage === "main" && (
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">

            {/* INPUT */}
            {flow.step === "input" && (
              <>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    {existingValue
                      ? "Update your phone"
                      : "Add secondary number"}
                  </h2>

                  <p className="text-sm text-muted-foreground mt-0.5">
                    {existingValue
                      ? "Enter your new phone number to continue."
                      : "Add a backup phone number for account recovery."}
                  </p>
                </div>

                <div className="space-y-3">

                  <PhoneNumberInput
                    value={flow.value}
                    country={country}
                    onlyCountries={["SG", "IN", "GB"]}
                    onCountryChange={(c) => {
                      setCountry(c);
                      flow.setValue("");
                    }}
                    onChange={(digits) =>
                      flow.setValue(digits)
                    }
                  />

                  {flow.error && (
                    <p className="text-sm text-destructive">
                      {flow.error}
                    </p>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => {
                      const fullPhone = getFullPhone();
                      flow.sendOtp(String(fullPhone));
                    }}
                  >
                    Send code
                  </Button>

                </div>
              </>
            )}

            {/* OTP */}
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
                        {getFullPhone()}
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

                <Input
                  value={flow.otp}
                  maxLength={6}
                  onChange={(e) =>
                    flow.setOtp(e.target.value)
                  }
                  className="text-center tracking-[0.5em] text-lg"
                  placeholder="------"
                />

                {flow.loading ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Verifying...
                  </p>
                ) : flow.error ? (
                  <p className="text-sm text-destructive text-center">
                    {flow.error}
                  </p>
                ) : null}

                <Button
                  className="w-full"
                  onClick={() => {
                    const fullPhone = getFullPhone();

                    flow.verifyOtp(fullPhone, handleSave);
                  }}
                >
                  Verify & Save
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">
                    Didn’t receive it?
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const fullPhone = getFullPhone();
                      flow.sendOtp(fullPhone);
                    }}
                    className="font-medium text-foreground hover:underline"
                  >
                    Resend
                  </button>
                </div>

                {isIndiaMock(getFullPhone()) && (
                  <p className="text-center text-xs text-muted-foreground font-mono">
                    Demo OTP:{" "}
                    <span className="font-bold tracking-widest">
                      111111
                    </span>
                  </p>
                )}
              </>
            )}

          </div>
        )}

      </div>
    </ResponsiveModal>
  );
}