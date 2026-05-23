"use client";

import React, { useRef, useState, useEffect } from "react";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { useJobConfig } from "@/hooks/useJobConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

const SKILL_OPTIONS = [
  "JavaScript",
  "React",
  "Node.js",
  "TypeScript",
  "SQL",
  "Python",
  "Communication",
  "Leadership",
];

export default function JobFulltimeForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = useJobConfig();
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const company     = usePostFormStore((s) => (s as any).company) ?? "";
  const salary      = usePostFormStore((s) => (s as any).salary) ?? "";
  const experience  = usePostFormStore((s) => (s as any).experience) ?? "";
  const deadline    = usePostFormStore((s) => (s as any).deadline) ?? "";
  const applyLink   = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const workMode    = usePostFormStore((s) => (s as any).workMode) ?? "";
  const skills      = (usePostFormStore((s) => (s as any).skills) as string[]) ?? [];
  const benefits    = (usePostFormStore((s) => (s as any).benefits) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("jobType", "Full Time");
  }, [setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobfulltimeform:validated", { detail: { ok } }));
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
    if (!description.trim()) mapped.description = "Description is required.";
    if (!company.trim()) mapped.company = "Company is required.";
    if (salary && !isPositive(salary)) mapped.salary = "Salary must be greater than 0.";

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
      id="jobFulltimeForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Full-Time Job</h2>


      <FormField
        label="Company"
        field="company"
        value={company}
        onChange={(v) => setField("company", v)}
        required
      />

      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Job Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={`Salary (${currency})`}
          field="salary"
          type="number"
          value={salary}
          onChange={(v) => setField("salary", v)}
        />

        <FormField
          label="Experience"
          field="experience"
          value={experience}
          onChange={(v) => setField("experience", v)}
        />
      </div>

      <ToggleButtonGroup title="Skills" value={skills} onChange={(v) => setField("skills", v)}>
        {SKILL_OPTIONS.map((s) => (
          <ToggleGroupButton key={s} value={s}>{s}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Benefits" value={benefits} onChange={(v) => setField("benefits", v)}>
        {config.benefits.map((b) => (
          <ToggleGroupButton key={b} value={b}>{b}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Work Mode" singleSelect value={workMode ? [workMode] : []} onChange={(v) => setField("workMode", v[0] ?? "")}>
        <ToggleGroupButton value="Onsite">On-site</ToggleGroupButton>
        <ToggleGroupButton value="Hybrid">Hybrid</ToggleGroupButton>
        <ToggleGroupButton value="Remote">Remote</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Application Deadline"
        field="deadline"
        type="date"
        value={deadline}
        onChange={(v) => setField("deadline", v)}
      />

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
