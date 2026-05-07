"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sendOtp } from "@/app/actions/profile/sendOtp";
import { verifyOtp as verifyOtpApi } from "@/app/actions/profile/verifyOtp";

export function useOtpFlow(initialValue: string, type: "email" | "phone") {
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

  const sendOtpHandler = async (value: string, isVerificationFlow = false) => {
    const v = value.trim();

    if (!v) {
      setError(type === "email" ? "Email required" : "Phone required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp({ channel: type, value: v });
      setStep("otp");
      setTimer(30);
      toast.success("OTP sent");
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (value: string, onSuccess?: () => void) => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOtpApi({ channel: type, value, otp });
      toast.success("Verified");
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