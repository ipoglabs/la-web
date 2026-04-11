"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProfile } from "@/app/actions/updateProfile";

import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { FormHelperText } from "@/components/FormHelperText";

import type { ProfileUser } from "../types";

type Props = {
  user: ProfileUser;
  onSuccess?: () => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function BasicEditForm({ user, onSuccess }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    role: user.role || "",
    dateOfBirth: user.dateOfBirth || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateName = (value: string, label: string) => {
    const v = value.trim();
    if (!v) return `Please enter ${label}`;
    if (!/^[A-Za-z]+$/.test(v)) return "Only letters A-Z are allowed";
    return "";
  };

  const validateAll = () => {
    const nextErrors: Record<string, string> = {};

    const firstNameError = validateName(formData.firstName, "first name");
    const lastNameError = validateName(formData.lastName, "last name");

    if (firstNameError) nextErrors.firstName = firstNameError;
    if (lastNameError) nextErrors.lastName = lastNameError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      setLoading(true);

      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role.trim(),
        dateOfBirth: formData.dateOfBirth,
      });

      toast.success("Profile updated successfully");
      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-5">
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <FormField label="First Name" error={errors.firstName} className="mb-0">
          <Input
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              clearError("firstName");
            }}
            className={cx(errors.firstName && "border-red-500")}
          />
        </FormField>

        <FormField label="Last Name" error={errors.lastName} className="mb-0">
          <Input
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              clearError("lastName");
            }}
            className={cx(errors.lastName && "border-red-500")}
          />
        </FormField>
      </FormFieldWrapper>

      <FormHelperText>Use your real name to build trust.</FormHelperText>

      <FormField label="Role Title">
        <Input
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        />
      </FormField>

      <FormField label="Date of Birth">
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          max={todayISO()}
          className="w-full border rounded px-3 py-2"
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
}