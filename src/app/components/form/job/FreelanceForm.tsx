// src/app/components/form/job/JobFreelanceForm.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function JobFreelanceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  // store values
  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const company = usePostFormStore((s) => (s as any).company) ?? "";
  const workMode = usePostFormStore((s) => (s as any).workMode) ?? "";
  const projectType = usePostFormStore((s) => (s as any).projectType) ?? "";
  const budgetType = usePostFormStore((s) => (s as any).budgetType) ?? "";
  const budgetAmount = usePostFormStore((s) => (s as any).budgetAmount) ?? "";
  const contractDuration = usePostFormStore((s) => (s as any).contractDuration) ?? "";
  const applyLink = usePostFormStore((s) => (s as any).applyLink) ?? "";
  const skills = (usePostFormStore((s) => (s as any).skills) ?? []) as string[];

  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {
    name: "",
    email: "",
    phone: "",
  };

  const [skillsText, setSkillsText] = useState(skills.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ set employment type
  useEffect(() => {
    setField("employmentType", "Freelance");
  }, [setField]);

  // convert skills → array
  const onSkillsBlur = () => {
    const arr = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setField("skills", arr);
  };

  const showBudgetAmount = useMemo(
    () => budgetType === "fixed" || budgetType === "hourly",
    [budgetType]
  );

  const isPositive = (v: any) => {
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

    if (!name.trim()) mapped.name = "Project title is required";
    if (!company.trim()) mapped.company = "Company is required";

    if (showBudgetAmount && !isPositive(budgetAmount)) {
      mapped.budgetAmount = "Budget must be greater than 0";
    }

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      toast.error("Please fix the highlighted fields");
      dispatchValidated(false);
      return;
    }

    dispatchValidated(true);
  };

  return (
    <form
      id="jobFreelanceForm"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Freelance / Gig
      </h2>

      {/* Title */}
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

      {/* Company / Work Mode */}
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
            { value: "onsite" },
            { value: "remote" },
            { value: "hybrid" },
          ]}
        />
      </div>

      {/* Project Type / Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Project Type"
          field="projectType"
          options={[
            { value: "web-development" },
            { value: "design" },
            { value: "writing" },
            { value: "marketing" },
            { value: "other" },
          ]}
        />

        <FormField
          label="Contract Duration"
          field="contractDuration"
          value={contractDuration}
          onChange={(v) => setField("contractDuration", v)}
        />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Budget Type"
          field="budgetType"
          options={[
            { value: "fixed" },
            { value: "hourly" },
          ]}
        />

        {showBudgetAmount && (
          <FormField
            label="Budget Amount (₹)"
            field="budgetAmount"
            type="number"
            value={budgetAmount}
            onChange={(v) => setField("budgetAmount", v)}
          />
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Skills</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={onSkillsBlur}
        />
      </div>

      {/* Apply link */}
      <FormField
        label="Apply Link"
        field="applyLink"
        value={applyLink}
        onChange={(v) => setField("applyLink", v)}
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={sellerInfo.name}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, name: e.target.value })
          }
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={sellerInfo.email}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, email: e.target.value })
          }
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone"
          value={sellerInfo.phone}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
          }
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}
