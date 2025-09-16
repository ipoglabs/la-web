"use client";

import { useEffect, useMemo, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function JobFreelanceForm() {
  const setField = usePostFormStore((s) => s.setField);
  const skillsValue = usePostFormStore((s) => s.skills);
  const budgetType = usePostFormStore((s) => s.budgetType);

  // Preset employmentType
  useEffect(() => {
    setField("employmentType", "Freelance");
  }, [setField]);

  // Comma list → array
  const [skillsText, setSkillsText] = useState(
    Array.isArray(skillsValue) ? skillsValue.join(", ") : ""
  );
  const onSkillsBlur = () => {
    const arr = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("skills", arr);
  };

  const showBudgetAmount = useMemo(
    () => budgetType && (budgetType === "fixed" || budgetType === "hourly"),
    [budgetType]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Freelance / Gig</h2>

      {/* Title / Description */}
      <FormField
        label="Project Title"
        field="name"
        placeholder="e.g. Website Development"
        required
      />
      <FormField
        label="Project Description"
        field="description"
        type="textarea"
        placeholder="Brief the scope, deliverables, tools…"
      />

      {/* Client / Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Client / Company" field="company" placeholder="e.g. ABC Solutions" required />
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

      {/* Project Type / Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Project Type"
          field="projectType"
          options={[
            { value: "web-development", label: "Web Development" },
            { value: "graphic-design", label: "Graphic Design" },
            { value: "content-writing", label: "Content Writing" },
            { value: "marketing", label: "Marketing" },
            { value: "other", label: "Other" },
          ]}
        />
        <FormField
          label="Project Duration / Deadline"
          field="duration"
          placeholder="e.g. 2 months, by Dec 2025"
        />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Budget Type"
          field="budgetType"
          options={[
            { value: "fixed", label: "Fixed Price" },
            { value: "hourly", label: "Hourly Rate" },
          ]}
        />
        {showBudgetAmount && (
          <FormField
            label={budgetType === "hourly" ? "Hourly Rate (₹)" : "Budget Amount (₹)"}
            field="budgetAmount"
            type="number"
            placeholder={budgetType === "hourly" ? "e.g. 800" : "e.g. 50000"}
          />
        )}
      </div>

      {/* Skills (comma-separated -> array) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Required Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. React, Photoshop, SEO"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={onSkillsBlur}
        />
        <p className="text-xs text-gray-500">
          Tip: comma-separate skills; we’ll save them as a list.
        </p>
      </div>

      {/* Optional apply link */}
      <FormField
        label="Apply Link / Website"
        field="applyLink"
        placeholder="https://client.com/job/project-id"
      />
    </div>
  );
}
