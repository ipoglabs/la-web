"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/updateProfile";
import { toast } from "sonner";

export default function EmailOtpFlow({ user }: any) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [email, setEmail] = useState(user.email);
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    setStep("otp");
  };

  const verifyOtp = async () => {
    await updateProfile({ email });
    toast.success("Email updated");
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {step === "input" && (
        <>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={sendOtp} className="w-full">Confirm</Button>
        </>
      )}

      {step === "otp" && (
        <>
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={verifyOtp} className="w-full">Verify</Button>
        </>
      )}
    </div>
  );
}