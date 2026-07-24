"use client";

/**
 * ChangePasswordEditor — current/new/confirm password change dialog.
 * Split out of page.tsx (Golden Rule file-size split, 2026-07-14).
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LaInput } from "@/components/la";
import {
  isValidPassword,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation";
import { updatePassword } from "@/app/actions/profile/updatePassword";
import { ResponsiveEditor } from "./ResponsiveEditor";

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_PASSWORD_FORM: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordEditor({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [draft, setDraft] = useState<ChangePasswordValues>(EMPTY_PASSWORD_FORM);
  const [saving, setSaving] = useState(false);
  const [currentTouched, setCurrentTouched] = useState(false);
  const [newTouched, setNewTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(EMPTY_PASSWORD_FORM);
      setSaving(false);
      setCurrentTouched(false);
      setNewTouched(false);
      setConfirmTouched(false);
      setSaveError("");
    }
  }, [open]);

  const currentError =
    currentTouched && draft.currentPassword.length === 0 ? "Enter your current password" : null;

  const newError = !newTouched
    ? null
    : draft.newPassword.length === 0
      ? "Enter a new password"
      : !isValidPassword(draft.newPassword)
        ? `At least ${PASSWORD_MIN_LENGTH} characters, with letters and numbers`
        : draft.newPassword === draft.currentPassword && draft.currentPassword.length > 0
          ? "New password must be different from your current password"
          : null;

  const confirmError =
    confirmTouched && draft.confirmPassword !== draft.newPassword ? "Passwords don't match" : null;

  const canSave =
    draft.currentPassword.length > 0 &&
    isValidPassword(draft.newPassword) &&
    draft.newPassword !== draft.currentPassword &&
    draft.confirmPassword === draft.newPassword;

  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setCurrentTouched(true);
    setNewTouched(true);
    setConfirmTouched(true);
    if (!canSave) return;
    setSaving(true);
    setSaveError("");
    try {
      const result = await updatePassword({
        currentPassword: draft.currentPassword,
        newPassword: draft.newPassword,
      });
      if (!result.success) {
        setSaveError(result.message || "Couldn't update password");
        return;
      }
      onOpenChange(false);
      toast.success("Password updated");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResponsiveEditor
      open={open}
      onOpenChange={onOpenChange}
      title="Change Password"
      onSave={handleSave}
      saveLabel={saving ? "Saving..." : "Save Changes"}
      saveDisabled={saving}
    >
      <div className="space-y-4 px-6 py-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Current Password</p>
          <LaInput
            type="password"
            showPasswordToggle
            value={draft.currentPassword}
            onChange={(e) => setDraft((prev) => ({ ...prev, currentPassword: e.target.value }))}
            onBlur={() => setCurrentTouched(true)}
            autoComplete="current-password"
            status={currentError ? "error" : "default"}
          />
          {currentError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {currentError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">New Password</p>
          <LaInput
            type="password"
            showPasswordToggle
            value={draft.newPassword}
            onChange={(e) => setDraft((prev) => ({ ...prev, newPassword: e.target.value }))}
            onBlur={() => setNewTouched(true)}
            autoComplete="new-password"
            status={newError ? "error" : "default"}
          />
          {newError ? (
            <p role="alert" className="text-sm font-medium text-red-600">
              {newError}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              At least {PASSWORD_MIN_LENGTH} characters, with letters and numbers
            </p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Confirm New Password</p>
          <LaInput
            type="password"
            showPasswordToggle
            value={draft.confirmPassword}
            onChange={(e) => setDraft((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            onBlur={() => setConfirmTouched(true)}
            autoComplete="new-password"
            status={confirmError ? "error" : "default"}
          />
          {confirmError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {confirmError}
            </p>
          )}
        </div>
        {saveError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {saveError}
          </p>
        )}
      </div>
    </ResponsiveEditor>
  );
}
