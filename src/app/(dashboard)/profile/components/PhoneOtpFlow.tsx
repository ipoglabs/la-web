"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/updateProfile";
import { toast } from "sonner";

export default function PhoneOtpFlow({ user }: any) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState(user.primaryNumber);
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    setStep("otp");
  };

  const verifyOtp = async () => {
    await updateProfile({ primaryNumber: phone });
    toast.success("Phone updated");
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {step === "input" && (
        <>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
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