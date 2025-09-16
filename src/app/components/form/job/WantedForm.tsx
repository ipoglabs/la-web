"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function JobWantedForm() {
  const setField = usePostFormStore((s) => s.setField);
  const skills = usePostFormStore((s) => s.skills);

  // Controlled comma-input for skills
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

  useEffect(() => {
    // category and subcategory auto-set if needed
    setField("employmentType", "");
  }, [setField]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Job Wanted</h2>

      <FormField
        label="Your Name"
        field="candidateName"
        placeholder="e.g. John Doe"
        required
      />

      <FormField
        label="Desired Job Title"
        field="name"
        placeholder="e.g. Software Engineer"
        required
      />

      <SelectField
        label="Employment Type"
        field="employmentType"
        options={[
          { value: "full-time", label: "Full Time" },
          { value: "part-time", label: "Part Time" },
          { value: "internship", label: "Internship" },
          { value: "freelance", label: "Freelance" },
          { value: "temporary", label: "Temporary" },
          { value: "contract", label: "Contract" },
        ]}
      />

      <FormField
        label="Preferred Location"
        field="preferred_locations"
        placeholder="e.g. Remote, New York, Mumbai"
      />

      <FormField label="Available From" field="available_from" type="date" />

      <FormField
        label="Expected Salary (₹)"
        field="salary"
        type="number"
        placeholder="e.g. 40000"
      />

      {/* Skills (comma separated → array in store) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. React, Node.js, Marketing"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
        />
        <p className="text-xs text-gray-500">
          Tip: comma-separate skills; they will be saved as a list.
        </p>
      </div>

      <FormField
        label="Experience"
        field="experience"
        placeholder="e.g. 2 years in Marketing"
      />

      <FormField
        label="Additional Info / Career Objective"
        field="description"
        type="textarea"
        placeholder="Share your goals, strengths, or career objectives"
      />
    </div>
  );
}
