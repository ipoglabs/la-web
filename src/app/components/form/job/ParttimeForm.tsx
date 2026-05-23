"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

const SHIFT_OPTIONS = ["Morning", "Evening", "Night", "Weekend", "Rotational"];

export default function JobPartTimeForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name         = usePostFormStore((s) => s.name) ?? "";
  const description  = usePostFormStore((s) => s.description) ?? "";
  const company      = usePostFormStore((s) => (s as any).company) ?? "";
  const hourlyRate   = usePostFormStore((s) => (s as any).hourlyRate) ?? "";
  const workingHours = usePostFormStore((s) => (s as any).workingHours) ?? "";
  const deadline     = usePostFormStore((s) => (s as any).deadline) ?? "";
  const applyLink    = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const workMode     = usePostFormStore((s) => (s as any).workMode) ?? "";
  const shifts       = (usePostFormStore((s) => (s as any).shifts) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("employmentType", "Part Time");
  }, [setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobparttimeform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())    mapped.name    = "Job title is required.";
    if (!company.trim()) mapped.company = "Company is required.";
    if (hourlyRate && !isPositive(hourlyRate)) mapped.hourlyRate = "Hourly rate must be greater than 0.";

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
      <h2 className="text-2xl font-semibold text-center">Post Part-Time Job</h2>

      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <FormField
        label="Company"
        field="company"
        value={company}
        onChange={(v) => setField("company", v)}
        required
      />

      <ToggleButtonGroup title="Work Mode" singleSelect value={workMode ? [workMode] : []} onChange={(v) => setField("workMode", v[0] ?? "")}>
        <ToggleGroupButton value="onsite">On-site</ToggleGroupButton>
        <ToggleGroupButton value="remote">Remote</ToggleGroupButton>
        <ToggleGroupButton value="hybrid">Hybrid</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={`Hourly Rate (${currency})`}
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

      <FormField
        label="Application Deadline"
        field="deadline"
        type="date"
        value={deadline}
        onChange={(v) => setField("deadline", v)}
      />

      <ToggleButtonGroup title="Shifts" value={shifts} onChange={(v) => setField("shifts", v)}>
        {SHIFT_OPTIONS.map((s) => (
          <ToggleGroupButton key={s} value={s}>{s}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <FormField
        label="Apply Link"
        field="applyLink"
        value={applyLink}
        onChange={(v) => setField("applyLink", v)}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}
