"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function JobTemporaryForm() {
  const setField = usePostFormStore((s) => s.setField);
  const skills = usePostFormStore((s) => s.skills);

  // preset employmentType in the store
  useEffect(() => {
    setField("employmentType", "Temporary");
  }, [setField]);

  // Comma text -> array in store
  const [skillsText, setSkillsText] = useState(
    Array.isArray(skills) ? skills.join(", ") : ""
  );
  const commitSkills = () => {
    const arr = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("skills", arr);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Temporary Job</h2>

      {/* Title / Company */}
      <FormField
        label="Job Title"
        field="name"
        placeholder="e.g. Temporary Store Helper"
        required
      />
      <FormField
        label="Company Name"
        field="company"
        placeholder="e.g. ABC Enterprises"
        required
      />

      {/* Work mode / hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Work Mode"
          field="workMode"
          options={[
            { value: "onsite", label: "On-site" },
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
          ]}
        />
        <FormField
          label="Working Hours / Shift"
          field="workingHours"
          placeholder="e.g. 8 hrs/day, Morning shift"
        />
      </div>

      {/* Start / End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Start Date" field="startDate" type="date" />
        <FormField label="End Date" field="endDate" type="date" />
      </div>

      {/* Pay */}
      <FormField
        label="Salary / Payment (₹)"
        field="salary"
        type="number"
        placeholder="e.g. 500 (per day) or 20000 (for project)"
      />

      {/* Skills */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Required Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. Communication, Customer Service"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
        />
        <p className="text-xs text-gray-500">
          Tip: comma-separate skills; we’ll save them as a list.
        </p>
      </div>

      {/* Description */}
      <FormField
        label="Job Description"
        field="description"
        type="textarea"
        placeholder="Temporary job responsibilities and details"
      />
    </div>
  );
}
