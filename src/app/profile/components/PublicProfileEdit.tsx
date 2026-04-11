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

  const initialValue = useMemo(
    () => user.username || user.id || "",
    [user.username, user.id]
  );

  const [username, setUsername] = useState(initialValue);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsername(initialValue);
    setError("");
  }, [initialValue]);

  const validate = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Profile ID is required";
    if (trimmed.length > 18) return "Max 18 characters allowed";
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return "Only letters, numbers, and underscore allowed";
    }

    return "";
  };

  const hasChanged = username.trim() !== initialValue.trim();

  const handleSave = async () => {
    const err = validate(username);
    if (err) {
      setError(err);
      return;
    }

    if (!hasChanged) return;

    try {
      setLoading(true);

      await updateProfile({
        username: username.trim(),
      });

      toast.success("Public Profile ID updated");
      router.refresh();
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormField label="Public Profile ID" error={error}>
        <Input
          value={username}
          maxLength={18}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="Enter profile ID"
        />
      </FormField>

      <p className="text-sm text-muted-foreground mt-2">
        Your public profile will be:{" "}
        <b>lokalads.com/{username.trim() || "your-id"}</b>
      </p>

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