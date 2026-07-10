"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { useOtpFlow } from "@/hooks/useOtpFlow";   // ✅ NEW
import { updateContact } from "@/app/actions/profile/updateContact";

import { PhoneNumberInput } from "../components/phone-number-input/PhoneNumberInput";
import { type Country, COUNTRIES } from "../components/phone-number-input/countries";


import ResponsiveModal from "./ResponsiveModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function isIndiaMock(value: string) {
  return value.replace(/\s+/g, "").startsWith("+91");
}

export default function PhoneEditForm({ open, onClose, user }: any) {
  const router = useRouter();

  const [stage, setStage] = useState<"email" | "main">("email");

  const flow = useOtpFlow(user.primaryNumber, "phone");
  const emailFlow = useOtpFlow(user.email, "email");

  const [country, setCountry] = useState<Country>(
  COUNTRIES.find((c) => c.code === "SG") ?? COUNTRIES[0]
);

const getFullPhone = () => {
  let local = String(flow.value || "").trim();

  if (!local) return "";

  // remove spaces, dashes
  local = local.replace(/[^\d+]/g, "");

  // mock support
  if (local.startsWith("mock")) return local;

  // already has +
  if (local.startsWith("+")) {
    return local;
  }

  // attach country code
  return `+${country.dial}${local}`;
};

  useEffect(() => {
    if (open) {
      setStage("email");
      flow.reset();
      emailFlow.reset();
      flow.setValue(user.primaryNumber);
      emailFlow.setValue(user.email);
    }
  }, [open]);

  const handleSave = async () => {
  const fullPhone = getFullPhone();

  // ✅ validate before sending
  if (!/^\+\d{10,15}$/.test(fullPhone)) {
    flow.setError("Enter a valid phone number");
    return;
  }

  await updateContact({
    field: "primaryNumber",
    value: fullPhone,   // ✅ CORRECT
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
               Verify your email for user is authentication
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
               className="w-full" onClick={() => emailFlow.sendOtp(user.email, true)} >
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
               onClick={() => emailFlow.sendOtp(user.email, true)}
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
     const fullPhone = getFullPhone();
     flow.sendOtp(String(fullPhone))   // ✅ correct
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
           {isIndiaMock(getFullPhone()) && (
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