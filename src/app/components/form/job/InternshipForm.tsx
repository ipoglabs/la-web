"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function JobInternshipForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name          = usePostFormStore((s) => s.name) ?? "";
  const description   = usePostFormStore((s) => s.description) ?? "";
  const company       = usePostFormStore((s) => (s as any).company) ?? "";
  const duration      = usePostFormStore((s) => (s as any).duration) ?? "";
  const startDate     = usePostFormStore((s) => (s as any).startDate) ?? "";
  const endDate       = usePostFormStore((s) => (s as any).endDate) ?? "";
  const stipendType   = usePostFormStore((s) => (s as any).stipendType) ?? "";
  const stipendAmount = usePostFormStore((s) => (s as any).stipendAmount) ?? "";
  const applyLink     = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const workMode      = usePostFormStore((s) => (s as any).workMode) ?? "";

  const skillsValue = (usePostFormStore((s) => (s as any).skills) ?? []) as string[];
  const [skillsText, setSkillsText] = useState(
    Array.isArray(skillsValue) ? skillsValue.join(", ") : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("employmentType", "Internship");
  }, [setField]);

  const onSkillsBlur = () => {
    const arr = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("skills", arr);
  };

  const showStipendAmount = useMemo(
    () => stipendType && stipendType !== "unpaid",
    [stipendType]
  );

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobinternshipform:validated", { detail: { ok } }));
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

    if (!name.trim())    mapped.name    = "Title is required.";
    if (!company.trim()) mapped.company = "Company is required.";
    if (showStipendAmount && !isPositive(stipendAmount)) mapped.stipendAmount = "Stipend must be greater than 0.";

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
      id="jobInternshipForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Internship</h2>

      <FormField
        label="Internship Title"
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
          label="Duration"
          field="duration"
          value={duration}
          onChange={(v) => setField("duration", v)}
        />

        <FormField
          label="Start Date"
          field="startDate"
          type="date"
          value={startDate}
          onChange={(v) => setField("startDate", v)}
        />
      </div>

      <FormField
        label="End Date"
        field="endDate"
        type="date"
        value={endDate}
        onChange={(v) => setField("endDate", v)}
      />

      <ToggleButtonGroup title="Stipend Type" singleSelect value={stipendType ? [stipendType] : []} onChange={(v) => setField("stipendType", v[0] ?? "")}>
        <ToggleGroupButton value="unpaid">Unpaid</ToggleGroupButton>
        <ToggleGroupButton value="stipend">Stipend</ToggleGroupButton>
        <ToggleGroupButton value="salary">Salary</ToggleGroupButton>
      </ToggleButtonGroup>

      {showStipendAmount && (
        <FormField
          label={`Stipend Amount (${currency})`}
          field="stipendAmount"
          type="number"
          value={stipendAmount}
          onChange={(v) => setField("stipendAmount", v)}
        />
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={onSkillsBlur}
          placeholder="e.g. React, Communication, Excel"
        />
      </div>

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
