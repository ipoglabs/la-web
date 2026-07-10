"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { FormHelperText } from "@/components/FormHelperText";
import { updatePassword } from "@/app/actions/profile/updatePassword";

type Props = {
  onSuccess?: () => void;
};

export default function ResetPassword({ onSuccess }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD STRENGTH ================= */
  const getScore = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Za-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;
    return score;
  };

  const pwScore = getScore(newPassword);

  const pwLabel =
    pwScore >= 4
      ? "Strong"
      : pwScore >= 2
      ? "Medium"
      : "Weak";

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm password";
    if (value !== newPassword) return "Passwords do not match";
    return "";
  };

  /* ================= SUBMIT ================= */
  const handleSave = async () => {
  // reset previous errors
  setError("");
  setConfirmError("");

  /* ================= BASIC VALIDATION ================= */
  if (!currentPassword.trim()) {
    setError("Current password is required");
    return;
  }

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    setConfirmError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await updatePassword({
      currentPassword,
      newPassword,
    });

    /* ================= HANDLE RESPONSE ================= */
    if (!res?.success) {
      // 👉 smarter UX: map error to correct field
      if (res?.message?.toLowerCase().includes("current password")) {
        setError(res.message); // show under current password field
      } else {
        toast.error(res?.message || "Failed to update password");
      }
      return;
    }

    /* ================= SUCCESS ================= */
    toast.success("Password updated successfully");

    // clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setError("");
    setConfirmError("");

    onSuccess?.();

  } catch (err) {
    console.error("Unexpected error:", err);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* CURRENT PASSWORD */}
      <FormField label="Current Password" error={error}>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setError("");
          }}
        />
      </FormField>

      {/* Password + Confirm */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-6">

        {/* PASSWORD */}
        <FormField label="New Password" error={error} className="mb-0">
          <div className="relative">
            <Input
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              type={showPwd ? "text" : "password"}
              placeholder="Create a secure password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              onPaste={(e) => e.preventDefault()}
              className={`pr-10 ${error ? "border-red-500" : ""}`}
            />

            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
            >
              {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <FormHelperText className="mt-1">
            At least 8 characters. Use numbers, letters and a symbol.
          </FormHelperText>

          {/* STRENGTH BAR */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded ${
                    i < pwScore
                      ? pwScore >= 4
                        ? "bg-green-600"
                        : pwScore >= 2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{pwLabel}</span>
          </div>
        </FormField>

        {/* CONFIRM PASSWORD */}
        <FormField label="Confirm Password" error={confirmError} className="mb-0">
          <div className="relative">
            <Input
              type={showConfirmPwd ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmError("");
              }}
              onPaste={(e) => e.preventDefault()}
              onBlur={() => {
                setConfirmTouched(true);
                const msg = validateConfirmPassword(confirmPassword);
                setConfirmError(msg);
              }}
              className={`pr-10 ${confirmError ? "border-red-500" : ""}`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPwd((p) => !p)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
            >
              {showConfirmPwd ? (
                <EyeOffIcon size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>
          </div>
        </FormField>
      </FormFieldWrapper>

      {/* PASSWORD CHECKLIST */}
      <div className="mt-3 space-y-1 pb-4 text-xs">
        {[
          { label: "At least 8 characters long", valid: newPassword.length >= 8 },
          { label: "At least 1 letter", valid: /[A-Za-z]/.test(newPassword) },
          { label: "At least 1 number", valid: /\d/.test(newPassword) },
          { label: "At least 1 special character", valid: /[^A-Za-z0-9]/.test(newPassword) },
        ].map((rule, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {rule.valid ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <p className="text-slate-900">{rule.label}</p>
          </div>
        ))}
      </div>

      {/* ACTION */}
      <Button
        type="button"
        className="w-full mt-4"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </>
  );
}