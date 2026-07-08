"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function JobTemporaryForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name         = usePostFormStore((s) => s.name) ?? "";
  const description  = usePostFormStore((s) => s.description) ?? "";
  const company      = usePostFormStore((s) => (s as any).company) ?? "";
  const startDate    = usePostFormStore((s) => (s as any).startDate) ?? "";
  const endDate      = usePostFormStore((s) => (s as any).endDate) ?? "";
  const workingHours = usePostFormStore((s) => (s as any).workingHours) ?? "";
  const salary       = usePostFormStore((s) => (s as any).salary) ?? "";
  const skills       = usePostFormStore((s) => (s as any).skills) ?? [];
  const workMode     = usePostFormStore((s) => (s as any).workMode) ?? "";

  const [skillsText, setSkillsText] = useState(
    Array.isArray(skills) ? skills.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("employmentType", "Temporary");
  }, [setField]);

  const commitSkills = () => {
    const arr = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("skills", arr);
  };

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobtemporaryform:validated", { detail: { ok } }));
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
    if (salary && !isPositive(salary)) mapped.salary = "Salary must be greater than 0.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      mapped.endDate = "End date must be after start date.";
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
      id="jobTemporaryForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Temporary Job</h2>

      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
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

      <FormField
        label="Working Hours"
        field="workingHours"
        value={workingHours}
        onChange={(v) => setField("workingHours", v)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          field="startDate"
          type="date"
          value={startDate}
          onChange={(v) => setField("startDate", v)}
        />

        <FormField
          label="End Date"
          field="endDate"
          type="date"
          value={endDate}
          onChange={(v) => setField("endDate", v)}
        />
      </div>

      <FormField
        label={`Salary (${currency})`}
        field="salary"
        type="number"
        value={salary}
        onChange={(v) => setField("salary", v)}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Required Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
          placeholder="e.g. Communication, Customer Service"
        />
      </div>

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}
