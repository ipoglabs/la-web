"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";


import { PhoneNumberInput } from "../components/phone-number-input/PhoneNumberInput";
import { type Country, COUNTRIES } from "../components/phone-number-input/countries";

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
    const finalValue =
      type === "phone" ? getFullPhone() : trimmed;

    await sendOtp({ channel: type, value: finalValue });
    setStep("otp");
    setTimer(30);
    toast.success("OTP sent successfully");
  } catch (e: any) {
    setError(e?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

  const verifyOtpHandler = async (
  value: string,
  onSuccess?: () => void
) => {
  if (!value || typeof value !== "string") {
    setError("Invalid value");
    return;
  }

  if (otp.length !== 6) {
    setError("OTP must be 6 digits");
    return;
  }

  // ✅ Mock support
  if (value.startsWith("mock") && otp === "111111") {
    toast.success("Mock OTP verified");
    onSuccess?.();
    return;
  }

  setLoading(true);
  setError("");

  try {
    await verifyOtpApi({
      channel: type,
      value,
      otp,
    });

    toast.success("OTP verified");
    onSuccess?.();
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
function EmailEditModal({ open, onClose, user }: any) {
  const router = useRouter();

  const [stage, setStage] = useState<"phone" | "main">("phone");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const flow = useOtpFlow(user.email, "email");

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

  const sendPhoneOtp = async () => {
    const phone = user.primaryNumber;

    if (phone.startsWith("mock")) {
      toast.success("Use 111111");
      setOtpSent(true);
      return;
    }

    setLoadingSend(true);

    await fetch("/api/sms/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    setLoadingSend(false);
    setOtpSent(true);
  };

  const verifyPhoneOtp = async () => {
    if (user.primaryNumber.startsWith("mock")) {
      if (otp === "111111") {
        setStage("main");
        return;
      }
    }

    setLoadingVerify(true);

    await fetch("/api/sms/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        phone: user.primaryNumber,
        otp,
      }),
    });

    setLoadingVerify(false);
    setStage("main");
  };

  const handleSave = async () => {
    await updateContact({
      field: "email",
      value: flow.value.trim(),
    });

    toast.success("Email updated");
    router.refresh();
    onClose();
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
                if (e.key === "Enter") flow.sendOtp();
              }}
              className="pl-9"
            />
          </div>

          {flow.error && (
            <p className="text-sm text-destructive">{flow.error}</p>
          )}

          <Button className="w-full" onClick={flow.sendOtp}>
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
          onClick={() => flow.verifyOtp(handleSave)}
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
            onClick={flow.sendOtp}
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

function PhoneEditModal({ open, onClose, user }: any) {
  const router = useRouter();

  const [stage, setStage] = useState<"email" | "main">("email");
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === "SG") ?? COUNTRIES[0]
  );
  
  const getFullPhone = () => {
    const localNumber = String(flow.value || "").trim();

    if (localNumber.startsWith("mock")) {
      return localNumber;
    }

    if (localNumber.startsWith("+")) {
      return localNumber.replace(/\s+/g, "");
    }

    return `+${country.dial}${localNumber}`.replace(/\s+/g, "");
  };

  const flow = useOtpFlow(user.primaryNumber, "phone");
  const emailFlow = useOtpFlow(user.email, "email");

  useEffect(() => {
    if (open) {
      setStage("email");
      flow.reset();
      emailFlow.reset();
      flow.setValue(user.primaryNumber);
    }
  }, [open]);

  const handleSave = async () => {
  const fullPhone = getFullPhone();

  await updateContact({
    field: "primaryNumber",
    value: fullPhone,
  });

  toast.success("Phone updated");
  router.refresh();
  onClose();
};

  return (
    <ResponsiveModal open={open} onOpenChange={() => onClose()} title="Update Phone">
      <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2 space-y-4">

        {/* ================= STEP 1: EMAIL VERIFY (NEW UI) ================= */}
{stage === "email" && (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">

    {/* ── Stage: enter-email ── */}
    {emailFlow.step === "input" && (
      <>
        <div>
          <h2 className="text-base font-semibold leading-tight">
            Verify your email
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            We will send a one-time code to verify it.
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
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
            onClick={emailFlow.sendOtp}
          >
            Send code
          </Button>
        </div>
      </>
    )}

    {/* ── Stage: verify-otp ── */}
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

        {/* OTP INPUT */}
        <Input
          value={emailFlow.otp}
          maxLength={6}
          onChange={(e) => emailFlow.setOtp(e.target.value)}
          className="text-center tracking-[0.5em] text-lg"
          placeholder="------"
        />

        {/* STATUS */}
        {emailFlow.loading ? (
          <p className="text-sm text-muted-foreground text-center">
            Verifying...
          </p>
        ) : emailFlow.error ? (
          <p className="text-sm text-destructive text-center">
            {emailFlow.error}
          </p>
        ) : null}

        {/* VERIFY BUTTON */}
        <Button
          className="w-full"
          onClick={() =>
            emailFlow.verifyOtp(emailFlow.value, () => setStage("main"))
          }
        >
          Verify Email
        </Button>

        {/* RESEND */}
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-muted-foreground">
            Didn’t receive it?
          </span>

          <button
            type="button"
            onClick={emailFlow.sendOtp}
            className="font-medium text-foreground hover:underline"
          >
            Resend
          </button>
        </div>
      </>
    )}
  </div>
)}

        {/* ================= STEP 2: PHONE UPDATE (NEW UI) ================= */}
{stage === "main" && (
  <div className="rounded-lg border border-border bg-card p-6 space-y-4">

    {/* ── Stage: enter-phone ── */}
    {flow.step === "input" && (
  <>
    <div>
      <h2 className="text-base font-semibold leading-tight">
        Update your phone
      </h2>
      <p className="text-sm text-muted-foreground mt-0.5">
        Enter your phone number to continue.
      </p>
    </div>

    <div className="space-y-3">

      {/* PHONE INPUT WITH COUNTRY */}
      <PhoneNumberInput
        value={flow.value}
        country={country}
        onlyCountries={["SG", "IN", "GB"]}   // ✅ restrict countries
        onCountryChange={(c) => {
          setCountry(c);
          flow.setValue(""); // reset on change
        }}
        onChange={(digits) => flow.setValue(digits)}
      />

      {flow.error && (
        <p className="text-sm text-destructive">{flow.error}</p>
      )}

      <Button
  className="w-full"
  onClick={() => {
    const fullPhone = getFullPhone();   // ✅ HERE
    flow.sendOtp(fullPhone);
  }}
>
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
                +{country.dial} {flow.value}
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

       <Button
          className="w-full"
          onClick={() => {
            const fullPhone = getFullPhone();
            flow.verifyOtp(fullPhone, handleSave);
          }}
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
            onClick={() => {
              const fullPhone = getFullPhone();
              flow.sendOtp(fullPhone);
            }}
          >
            Resend
          </button>
        </div>

        {/* MOCK SUPPORT */}
        {flow.value?.startsWith("mock") && (
          <p className="text-center text-xs text-muted-foreground font-mono">
            Demo OTP: <span className="font-bold tracking-widest">111111</span>
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
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

  {/* Email */}
  <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 gap-4">

    <div className="min-w-0 flex-1">
      <div className="text-xs font-semibold text-slate-500">
        Email Address
      </div>
      <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
        {user.email || "—"}
      </div>
    </div>

    <button
      type="button"
      onClick={() => setActive("email")}
      className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
    >
      Edit
    </button>

  </div>

  {/* Phone */}
  <div className="flex items-center justify-between px-4 py-3.5 gap-4">

    <div className="min-w-0 flex-1">
      <div className="text-xs font-semibold text-slate-500">
        Phone Number
      </div>
      <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
        {user.primaryNumber || "—"}
      </div>
    </div>

    <button
      type="button"
      onClick={() => setActive("phone")}
      className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
    >
      Edit
    </button>

  </div>

</div>

      <EmailEditModal
  open={active === "email"}
  onClose={() => setActive(null)}
  user={user}
/>

<PhoneEditModal
  open={active === "phone"}
  onClose={() => setActive(null)}
  user={user}
/>
    </>
  );
}