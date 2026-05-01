"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProfile } from "@/app/actions/updateProfile";
import { checkUserIdAvailability } from "@/app/actions/profile/checkUserId";
import { useAutoScrollInput } from "@/hooks/useAutoScrollInput";
import { userIdSchema } from "@/validators/profile";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";

import type { ProfileUser } from "../types";

type Props = {
  user: ProfileUser;
  onSuccess?: () => void;
};

export default function PublicProfileEdit({ user, onSuccess }: Props) {
  useAutoScrollInput();
  const router = useRouter();

  const initialValue = useMemo(() => (user.profileId || "").trim(), [user.profileId]);

  const [userId, setUserId] = useState(initialValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setUserId(initialValue);
    setErrors([]);
  }, [initialValue]);

  const hasChanged = userId.trim() !== initialValue;

  /* ================= ZOD VALIDATION (MULTI ERROR) ================= */
  const validateSync = (value: string) => {
    const result = userIdSchema.safeParse(value);

    if (!result.success) {
      return result.error.issues.map((e) => e.message);
    }

    return [];
  };

  /* ================= ON BLUR UNIQUE CHECK ================= */
  const handleBlur = async () => {
    const trimmed = userId.trim();

    const syncErrors = validateSync(trimmed);

    if (syncErrors.length > 0) {
      setErrors(syncErrors);
      return;
    }

    if (!hasChanged) return;

    try {
      setChecking(true);

      const res = await checkUserIdAvailability(trimmed, initialValue);

      if (!res.available) {
        setErrors(["• This Profile ID is already taken"]);
      } else {
        setErrors([]); // ✅ clear if valid
      }
    } catch {
      setErrors(["• Unable to validate. Try again."]);
    } finally {
      setChecking(false);
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const trimmed = userId.trim();

    const syncErrors = validateSync(trimmed);

    if (syncErrors.length > 0) {
      setErrors(syncErrors);
      return;
    }

    if (!hasChanged) {
      toast.info("No changes to update");
      return;
    }

    if (errors.length > 0) return;

    try {
      setLoading(true);

      await updateProfile({
        userId: trimmed,
      });

      toast.success("Profile ID updated successfully");

      router.refresh();
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <FormField
        label="Public Profile ID"
        error={
          errors.length > 0 ? (
            <div className="space-y-1">
              {errors.map((err, idx) => (
                <div key={idx} className="text-red-500 text-sm">
                  {err}
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <Input
          value={userId}
          maxLength={18}
          onChange={(e) => {
            setUserId(e.target.value);
            setErrors([]);
          }}
          onBlur={handleBlur}
          placeholder="Enter profile ID"
        />
      </FormField>

      {/* STATUS */}
      {checking && (
        <p className="text-xs text-muted-foreground mt-1">
          Checking availability...
        </p>
      )}

      {/* SUCCESS STATE */}
      {!checking && errors.length === 0 && hasChanged && userId && (
        <p className="text-xs text-green-600 mt-1">
          ✓ Profile ID is available
        </p>
      )}

      {/* PREVIEW */}
      <p className="text-sm text-muted-foreground mt-2">
        Your public profile will be{" "}
        <b>lokalads.com/{userId.trim() || "your-id"}</b>
      </p>

      {/* ACTION */}
      <Button
        type="button"
        className="w-full mt-4"
        disabled={!hasChanged || loading || checking}
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </>
  );
}