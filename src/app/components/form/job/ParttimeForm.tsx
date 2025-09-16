"use client";

import { useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
// If you use a shared contact section elsewhere, keep using it there.

export default function JobPartTimeForm() {
  const setField = usePostFormStore((s) => s.setField);

  // Default employmentType to "Part Time" once
  useEffect(() => {
    setField("employmentType", "Part Time");
  }, [setField]);

  const shiftOptions = [
    "Morning",
    "Evening",
    "Night",
    "Weekend",
    "Rotational",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Part-Time Job</h2>

      {/* Job Title / Description */}
      <FormField
        label="Job Title"
        field="name"
        placeholder="e.g. Part-Time Retail Assistant"
        required
      />
      <FormField
        label="Job Description"
        field="description"
        type="textarea"
        placeholder="Describe responsibilities, expectations, perks…"
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

      {/* Compensation (hourly for part-time) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Hourly Rate (₹)"
          field="hourlyRate"
          type="number"
          placeholder="e.g. 250"
        />
        <FormField
          label="Application Deadline"
          field="deadline"
          type="date"
        />
      </div>

      {/* Shifts (array) */}
      <CheckboxGroupField
        label="Shifts"
        field="shifts"
        options={shiftOptions}
        cols={3}
      />

      {/* Optional apply link */}
      <FormField
        label="Apply Link / Website"
        field="applyLink"
        placeholder="https://company.com/careers/job-id"
      />

      {/* Hidden preset for employmentType just in case you need it in preview/details */}
      {/* If you prefer to show it, replace this with a SelectField. */}
    </div>
  );
}
