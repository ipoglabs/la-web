"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProfile } from "@/app/actions/updateProfile";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";

import type { ProfileUser } from "../types";

type Props = {
  user: ProfileUser;
  onSuccess?: () => void;
};

export default function PublicProfileEdit({ user, onSuccess }: Props) {
  const router = useRouter();

  /* ================= INITIAL VALUE ================= */
  const initialValue = useMemo(() => user.id || "", [user.id]);

  const [userId, setUserId] = useState(initialValue);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= RESET WHEN OPEN ================= */
  useEffect(() => {
    setUserId(initialValue);
    setError("");
  }, [initialValue]);

  /* ================= VALIDATION ================= */
  const validate = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Profile ID is required";
    if (trimmed.length > 18) return "Max 18 characters allowed";

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return "Only letters, numbers, and underscore allowed";
    }

    return "";
  };

  const hasChanged = userId.trim() !== initialValue.trim();

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const err = validate(userId);

    if (err) {
      setError(err);
      return;
    }

    if (!hasChanged) return;

    try {
      setLoading(true);

      await updateProfile({
        userId: userId.trim(), // ✅ updated field
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
      <FormField label="Public Profile ID" error={error}>
        <Input
          value={userId}
          maxLength={18}
          onChange={(e) => {
            setUserId(e.target.value);
            setError("");
          }}
          placeholder="Enter profile ID"
        />
      </FormField>

      {/* PREVIEW */}
      <p className="text-sm text-muted-foreground mt-2">
        Your public profile will be:{" "}
        <b>lokalads.com/u/{userId.trim() || "your-id"}</b>
      </p>

      {/* ACTION */}
      <Button
        type="button"
        className="w-full mt-4"
        disabled={!hasChanged || loading}
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </>
  );
}