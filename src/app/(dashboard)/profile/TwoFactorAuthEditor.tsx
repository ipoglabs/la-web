"use client";

/**
 * TwoFactorAuthEditor — 4-step 2FA setup/verify/backup-codes/enabled flow.
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 *
 * Demo-only secret/backup codes — a real integration generates a per-user
 * secret + QR server-side and never exposes it in client source.
 */

import { useEffect, useState } from "react";
import { AlertCircle, Check, Copy, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OtpInput } from "@/components/ui/otp-input";
import { VALID_OTP } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ResponsiveEditor } from "./ResponsiveEditor";

const MOCK_2FA_SECRET = "JBSW Y3DP EHPK 3PXP";
const MOCK_BACKUP_CODES = [
  "4F7K-9XQ2", "8H3L-6WZP", "2D9R-4TVN", "7G1M-8YXK", "5B6C-3PQW",
  "9J4H-7RTL", "1K8N-5MXD", "6P2V-9WZQ", "3T7Y-4HLR", "8Q5F-2NVK",
];

type TwoFactorStep = "setup" | "verify" | "backup" | "enabled";

const TWO_FACTOR_TITLES: Record<TwoFactorStep, string> = {
  setup: "Set Up Two-Factor Authentication",
  verify: "Verify Your App",
  backup: "Save Backup Codes",
  enabled: "Two-Factor Authentication",
};

export function TwoFactorAuthEditor({
  open,
  onOpenChange,
  enabled,
  onEnable,
  onDisable,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}) {
  const [step, setStep] = useState<TwoFactorStep>("setup");
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(enabled ? "enabled" : "setup");
      setOtpError(false);
      setVerifying(false);
      setBackupConfirmed(false);
      setDisabling(false);
      setConfirmDisableOpen(false);
    }
  }, [open, enabled]);

  function handleCopySecret() {
    if (!navigator.clipboard) {
      toast.error("Copy not supported in this browser — please type the code manually");
      return;
    }
    navigator.clipboard
      .writeText(MOCK_2FA_SECRET.replace(/\s/g, ""))
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Couldn't copy — please copy manually"));
  }

  function handleOtpComplete(otp: string) {
    setVerifying(true);
    // TODO [INTEGRATION]: POST /api/profile/2fa/verify — verify the TOTP code
    // server-side against the secret generated at setup time.
    setTimeout(() => {
      setVerifying(false);
      if (otp === VALID_OTP) {
        setStep("backup");
      } else {
        setOtpError(true);
      }
    }, 700);
  }

  function handleOtpErrorCleared() {
    setOtpError(false);
  }

  function handleEnableConfirm() {
    // TODO [INTEGRATION]: POST /api/profile/2fa/enable — persist enabled
    // state + backup codes hash server-side.
    onEnable();
    onOpenChange(false);
    toast.success("Two-factor authentication enabled");
  }

  function handleDisableConfirm() {
    setDisabling(true);
    // TODO [INTEGRATION]: POST /api/profile/2fa/disable
    setTimeout(() => {
      setDisabling(false);
      setConfirmDisableOpen(false);
      onDisable();
      onOpenChange(false);
      toast.success("Two-factor authentication disabled");
    }, 500);
  }

  const footerByStep: Record<TwoFactorStep, { label: string; disabled: boolean; onSave: () => void }> = {
    setup: { label: "Continue", disabled: false, onSave: () => setStep("verify") },
    verify: { label: "", disabled: true, onSave: () => {} },
    backup: { label: "Done", disabled: !backupConfirmed, onSave: handleEnableConfirm },
    enabled: { label: "Disable", disabled: false, onSave: () => setConfirmDisableOpen(true) },
  };
  const footer = footerByStep[step];

  return (
    <>
      <ResponsiveEditor
        open={open}
        onOpenChange={onOpenChange}
        title={TWO_FACTOR_TITLES[step]}
        onSave={footer.onSave}
        saveLabel={footer.label}
        saveDisabled={footer.disabled}
        hideSaveButton={step === "verify"}
      >
        {step === "setup" && (
          <div className="space-y-4 px-6 py-5">
            <p className="text-sm text-slate-600">
              Scan this QR code with an authenticator app like Google Authenticator or Authy.
            </p>
            <div className="flex justify-center">
              <div className="flex size-40 items-center justify-center rounded-lg border-2 border-slate-300 bg-slate-50">
                <QrCode className="size-20 text-slate-400" strokeWidth={1} />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-700">Can&apos;t scan? Enter this code manually</p>
              <button
                type="button"
                onClick={handleCopySecret}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-400"
              >
                <span className="font-mono text-sm font-semibold tracking-wider text-slate-800">
                  {MOCK_2FA_SECRET}
                </span>
                <Copy className="size-4 shrink-0 text-slate-500" />
              </button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4 px-6 py-5">
            <p className="text-sm text-slate-600">Enter the 6-digit code from your authenticator app.</p>
            <OtpInput
              error={otpError}
              disabled={verifying}
              onComplete={handleOtpComplete}
              onErrorCleared={handleOtpErrorCleared}
            />
            {verifying ? (
              <p className="text-center text-sm text-slate-500">Verifying&hellip;</p>
            ) : otpError ? (
              <p className="text-center text-sm font-medium text-red-600">Incorrect code. Try again.</p>
            ) : (
              <p className="text-center text-sm text-slate-500">
                Demo OTP: <span className="font-bold tracking-widest text-slate-700">{VALID_OTP}</span>
              </p>
            )}
          </div>
        )}

        {step === "backup" && (
          <div className="space-y-4 px-6 py-5">
            <p className="text-sm text-slate-600">
              Save these backup codes somewhere safe. Each code can be used once if you lose access
              to your authenticator app.
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-300 bg-slate-50 p-4">
              {MOCK_BACKUP_CODES.map((code) => (
                <span key={code} className="font-mono text-sm font-semibold text-slate-700">
                  {code}
                </span>
              ))}
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg py-1 transition hover:opacity-80 focus-within:ring-2 focus-within:ring-blue-300">
              <input
                type="checkbox"
                checked={backupConfirmed}
                onChange={() => setBackupConfirmed((v) => !v)}
                className="sr-only"
              />
              <div
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition",
                  backupConfirmed ? "border-blue-500 bg-blue-500" : "border-slate-400 bg-white"
                )}
              >
                {backupConfirmed && <Check className="size-2.5 text-white" strokeWidth={3} />}
              </div>
              <p className="text-sm font-medium text-slate-700">
                I&apos;ve saved these codes somewhere safe
              </p>
            </label>
          </div>
        )}

        {step === "enabled" && (
          <div className="space-y-4 px-6 py-5">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Two-factor authentication is on</p>
                <p className="text-sm text-emerald-700">Your account has an extra layer of protection.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              You&apos;ll be asked for a code from your authenticator app when signing in from a new device.
            </p>
          </div>
        )}
      </ResponsiveEditor>

      <AlertDialog open={confirmDisableOpen} onOpenChange={(open) => !disabling && setConfirmDisableOpen(open)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <AlertCircle className="size-5 text-rose-500" />
            </AlertDialogMedia>
            <AlertDialogTitle>Disable two-factor authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your account less secure — you won&apos;t be asked for a code when
              signing in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disabling}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={disabling} onClick={handleDisableConfirm}>
              {disabling ? "Disabling..." : "Yes, Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
