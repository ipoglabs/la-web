"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function JobFreelanceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  const setField = usePostFormStore((s) => s.setField);

  const name             = usePostFormStore((s) => s.name) ?? "";
  const description      = usePostFormStore((s) => s.description) ?? "";
  const company          = usePostFormStore((s) => (s as any).company) ?? "";
  const projectType      = usePostFormStore((s) => (s as any).projectType) ?? "";
  const budgetType       = usePostFormStore((s) => (s as any).budgetType) ?? "";
  const budgetAmount     = usePostFormStore((s) => (s as any).budgetAmount) ?? "";
  const contractDuration = usePostFormStore((s) => (s as any).contractDuration) ?? "";
  const applyLink        = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const workMode         = usePostFormStore((s) => (s as any).workMode) ?? "";
  const skills           = (usePostFormStore((s) => (s as any).skills) ?? []) as string[];

  const [skillsText, setSkillsText] = useState(skills.join(", "));
  const [errors, setErrors]         = useState<Record<string, string>>({});

  useEffect(() => {
    setField("employmentType", "Freelance");
  }, [setField]);

  const onSkillsBlur = () => {
    const arr = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("skills", arr);
  };

  const showBudgetAmount = useMemo(
    () => budgetType === "fixed" || budgetType === "hourly",
    [budgetType]
  );

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobfreelanceform:validated", { detail: { ok } }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())    mapped.name    = "Project title is required.";
    if (!company.trim()) mapped.company = "Company is required.";
    if (showBudgetAmount && !isPositive(budgetAmount)) mapped.budgetAmount = "Budget must be greater than 0.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    dispatchValidated(true);
  };

  return (
    <form
      id="jobFreelanceForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Freelance / Gig</h2>

      <FormField
        label="Project Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Project Description"
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

      <ToggleButtonGroup title="Project Type" singleSelect value={projectType ? [projectType] : []} onChange={(v) => setField("projectType", v[0] ?? "")}>
        <ToggleGroupButton value="web-development">Web Development</ToggleGroupButton>
        <ToggleGroupButton value="design">Design</ToggleGroupButton>
        <ToggleGroupButton value="writing">Writing</ToggleGroupButton>
        <ToggleGroupButton value="marketing">Marketing</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Contract Duration"
        field="contractDuration"
        value={contractDuration}
        onChange={(v) => setField("contractDuration", v)}
      />

      <ToggleButtonGroup title="Budget Type" singleSelect value={budgetType ? [budgetType] : []} onChange={(v) => setField("budgetType", v[0] ?? "")}>
        <ToggleGroupButton value="fixed">Fixed</ToggleGroupButton>
        <ToggleGroupButton value="hourly">Hourly</ToggleGroupButton>
      </ToggleButtonGroup>

      {showBudgetAmount && (
        <FormField
          label={`Budget Amount (${currency})`}
          field="budgetAmount"
          type="number"
          value={budgetAmount}
          onChange={(v) => setField("budgetAmount", v)}
        />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Skills</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={onSkillsBlur}
          placeholder="e.g. React, Node.js, Design"
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
