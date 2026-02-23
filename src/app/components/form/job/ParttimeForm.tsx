"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { toast } from "sonner";

export default function JobPartTimeForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const company = usePostFormStore((s) => (s as any).company) ?? "";
  const workMode = usePostFormStore((s) => (s as any).workMode) ?? "";
  const hourlyRate = usePostFormStore((s) => (s as any).hourlyRate) ?? "";
  const workingHours = usePostFormStore((s) => (s as any).workingHours) ?? "";
  const deadline = usePostFormStore((s) => (s as any).deadline) ?? "";
  const applyLink = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const shifts =
    (usePostFormStore((s) => (s as any).shifts) ?? []) as string[];

  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {
    name: "",
    email: "",
    phone: "",
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ default employmentType
  useEffect(() => {
    setField("employmentType", "Part Time");
  }, [setField]);

  const shiftOptions = [
    "Morning",
    "Evening",
    "Night",
    "Weekend",
    "Rotational",
  ];

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
    window.dispatchEvent(
      new CustomEvent("jobparttimeform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Job title is required.";
    if (!company.trim()) mapped.company = "Company is required.";

    if (hourlyRate && !isPositive(hourlyRate)) {
      mapped.hourlyRate = "Hourly rate must be greater than 0.";
    }

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    dispatchValidated(true);
  };

  return (
    <form
      id="jobPartTimeForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Part-Time Job
      </h2>

      {/* Title */}
      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Company + Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Company"
          field="company"
          value={company}
          onChange={(v) => setField("company", v)}
          required
        />

        <SelectField
          label="Work Mode"
          field="workMode"
          options={[
            { value: "onsite", label: "On-site" },
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
          ]}
        />
      </div>

      {/* Rate + Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Hourly Rate (₹)"
          field="hourlyRate"
          type="number"
          value={hourlyRate}
          onChange={(v) => setField("hourlyRate", v)}
        />

        <FormField
          label="Working Hours"
          field="workingHours"
          value={workingHours}
          onChange={(v) => setField("workingHours", v)}
        />
      </div>

      {/* Deadline */}
      <FormField
        label="Application Deadline"
        field="deadline"
        type="date"
        value={deadline}
        onChange={(v) => setField("deadline", v)}
      />

      {/* Shifts */}
      <CheckboxGroupField
        label="Shifts"
        field="shifts"
        options={shiftOptions}
        cols={3}
      />

      {/* Apply Link */}
      <FormField
        label="Apply Link"
        field="applyLink"
        value={applyLink}
        onChange={(v) => setField("applyLink", v)}
      />

      {/* Contact */}
      {/* <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.name}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                name: e.target.value,
              })
            }
            placeholder="Name"
          />

          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.email}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                email: e.target.value,
              })
            }
            placeholder="Email"
          />

          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.phone}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                phone: e.target.value,
              })
            }
            placeholder="Phone"
          />
        </div>
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}
