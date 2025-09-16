"use client";

import { useEffect, useMemo, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function JobInternshipForm() {
  const setField = usePostFormStore((s) => s.setField);
  const skillsValue = usePostFormStore((s) => s.skills);
  const stipendType = usePostFormStore((s) => s.stipendType);

  // Ensure category/subcategory are set by the parent route/page.
  // We only preset employmentType here:
  useEffect(() => {
    setField("employmentType", "Internship");
  }, [setField]);

  // Local controlled text that we split into an array for store
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

  const showStipendAmount = useMemo(
    () => stipendType && stipendType !== "unpaid",
    [stipendType]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Internship</h2>

      {/* Title / Description */}
      <FormField
        label="Internship Title"
        field="name"
        placeholder="e.g. Software Development Intern"
        required
      />
      <FormField
        label="Internship Description"
        field="description"
        type="textarea"
        placeholder="Describe responsibilities, stack, outcomes…"
      />

      {/* Company / Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company" field="company" placeholder="Company Name" required />
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

      {/* Duration / Start Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Internship Duration"
          field="duration"
          placeholder="e.g. 3 months, 6 months"
        />
        <FormField label="Start Date" field="startDate" type="date" />
      </div>

      {/* Stipend Type / Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Stipend / Salary"
          field="stipendType"
          options={[
            { value: "unpaid", label: "Unpaid" },
            { value: "stipend", label: "Stipend" },
            { value: "salary", label: "Salary" },
          ]}
        />
        {showStipendAmount && (
          <FormField
            label="Amount (₹)"
            field="stipend"
            type="number"
            placeholder="e.g. 15000"
          />
        )}
      </div>

      {/* Skills (comma-separated -> array) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Required Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. React, Java, Communication"
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
        placeholder="https://company.com/careers/job-id"
      />
    </div>
  );
}
