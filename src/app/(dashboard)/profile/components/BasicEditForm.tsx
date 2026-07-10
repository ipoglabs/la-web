"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateProfile } from "@/app/actions/updateProfile";
import { basicProfileSchema } from "@/validators/profileBasic";
import { useAutoScrollInput } from "@/hooks/useAutoScrollInput";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { FormHelperText } from "@/components/FormHelperText";
import { DateInput } from "@/components/date-input";
import { useMediaQuery } from "@/components/hooks/use-media-query";

import type { ProfileUser } from "../types";

type Props = {
  user: ProfileUser;
  onSuccess?: () => void;
};

const ROLES = [
  { key: "individual", label: "Individual" },
  { key: "business", label: "Business" },
  { key: "agency", label: "Agency" },
  { key: "other", label: "Other" },
];

function cx(...arr: any[]) {
  return arr.filter(Boolean).join(" ");
}

export default function BasicEditForm({ user, onSuccess }: Props) {
  useAutoScrollInput();
  const router = useRouter();
  const isBelowLaptop = useMediaQuery("(max-width:1024px)");

 const PREDEFINED_ROLES = ["individual", "business", "agency"];

const [formData, setFormData] = useState({
  fullName: user.fullName || "",

  // 🔥 detect if it's custom role
  role: PREDEFINED_ROLES.includes(user.role)
    ? user.role
    : "other",

  // 🔥 populate title ONLY if custom
  roleTitle: PREDEFINED_ROLES.includes(user.role)
    ? ""
    : user.role || "",

  roleDescription: user.roleDescription || "",
  dateOfBirth: user.dateOfBirth || "",
});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validateField = (field: string, value: any) => {
    const result = basicProfileSchema.safeParse({
      ...formData,
      [field]: value,
    });

    if (!result.success) {
      const issue = result.error.issues.find((e) => e.path[0] === field);
      return issue?.message;
    }
    return "";
  };

  const validateAll = () => {
    const result = basicProfileSchema.safeParse(formData);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        nextErrors[e.path[0] as string] = e.message;
      });
      setErrors(nextErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      setLoading(true);

      await updateProfile({
        ...formData,
        fullName: formData.fullName.trim(),
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
    <Form onSubmit={onSubmit} className="space-y-2 px-3">

      {/* NAME */}
      <FormField label="Full Name" htmlFor="fullName" error={errors.fullName}>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value });
            setErrors({ ...errors, fullName: "" });
          }}
          onBlur={(e) => {
            const msg = validateField("fullName", e.target.value);
            if (msg) setErrors((p) => ({ ...p, fullName: msg }));
          }}
        />
      </FormField>

    {/* ================= ROLE ================= */}
    <FormField
      label="Role"
      htmlFor="role"
      error={errors.role || errors.roleTitle || errors.roleDescription}
    >
      <p className="text-xs text-muted-foreground mt-1">
        Choose how you’ll use Lokalads — roles customise your dashboard and features.
      </p>

      {/* ROLE CARDS */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((r) => {
          const active = formData.role === r.key;

          return (
            <button
              key={r.key}
              type="button"
              onClick={() => {
               setFormData((prev) => ({
                ...prev,
                role: r.key,
                roleTitle: r.key === "other" ? prev.roleTitle : "",
                roleDescription: r.key === "other" ? prev.roleDescription : "",
              }));

                setErrors((prev) => ({
                  ...prev,
                  role: "",
                  roleTitle: "",
                  roleDescription: "",
                }));
              }}
              className={cx(
                "rounded-xl border p-4 text-left transition",
                active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-input hover:bg-muted/40"
              )}
            >
              <div className="font-medium">{r.label}</div>

              <div className="text-xs text-muted-foreground mt-1">
                {r.key === "individual" && "Personal buying/selling"}
                {r.key === "business" && "Shops, SMBs and brands"}
                {r.key === "agency" && "Manage listings for clients"}
                {r.key === "other" && "Something else"}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= OTHER ROLE ================= */}
      {formData.role === "other" && (
        <FormFieldWrapper className="mt-4 grid grid-cols-1 gap-3">

          {/* ROLE TITLE */}
          <FormField label="Role title" error={errors.roleTitle}>
            <Input
              placeholder="e.g. Freelancer, Community Moderator"
              value={formData.roleTitle || ""}
              maxLength={80}
              onChange={(e) => {
                setFormData({ ...formData, roleTitle: e.target.value });
                setErrors((prev) => ({ ...prev, roleTitle: "" }));
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();

                let msg = "";
                if (!value) msg = "Role title is required";
                else if (value.length < 2) msg = "Minimum 2 characters required";
                else if (value.length > 80) msg = "Max 80 characters allowed";
                else if (!/^[A-Za-z0-9\s,|&()\-]+$/.test(value)) {
                  msg = "Invalid characters used";
                }

                setFormData({ ...formData, roleTitle: value });

                if (msg) {
                  setErrors((prev) => ({ ...prev, roleTitle: msg }));
                }
              }}
            />
          </FormField>

          {/* ROLE DESCRIPTION */}
          <FormField label="Role description" error={errors.roleDescription}>
            <textarea
              placeholder="Describe how you will use Lokalads"
              value={formData.roleDescription || ""}
              maxLength={300}
              onChange={(e) => {
                setFormData({ ...formData, roleDescription: e.target.value });
                setErrors((prev) => ({ ...prev, roleDescription: "" }));
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();

                let msg = "";
                if (!value) msg = "Description is required";
                else if (value.length < 2) msg = "Minimum 2 characters required";
                else if (value.length > 300) msg = "Max 300 characters allowed";

                setFormData({ ...formData, roleDescription: value });

                if (msg) {
                  setErrors((prev) => ({ ...prev, roleDescription: msg }));
                }
              }}
              className={cx(
                "mt-1 w-full min-h-[80px] rounded-sm border px-3 py-2 text-sm",
                errors.roleDescription && "border-red-500"
              )}
            />
          </FormField>

        </FormFieldWrapper>
      )}
    </FormField>

      {/* DOB */}
      <FormField
        label="Date of Birth"
        htmlFor="dateOfBirth"
        error={errors.dateOfBirth}
        helperLabel="We need this to confirm you are 18+"
        showFocusWithin={!isBelowLaptop}
      >
        <DateInput
          id="dateOfBirth"
          value={formData.dateOfBirth || ""}
          onChange={(value) => {
            setFormData({ ...formData, dateOfBirth: value || "" });
            setErrors((p) => ({ ...p, dateOfBirth: "" }));
          }}
          inputFormat="DMY"
          separator="/"
          blurDisplay="medium"
          placeholder="DD / MM / YYYY"
          error={errors.dateOfBirth}
          className={cx(
            !!errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500/20"
          )}
        />
      </FormField>

      {/* ACTION */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

    </Form>
  );
}