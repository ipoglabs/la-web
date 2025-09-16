"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function JobFullTimeForm() {
  const { sellerInfo, setField } = usePostFormStore();

  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "TypeScript",
    "SQL",
    "Python",
    "Communication",
    "Leadership",
  ];

  const benefitOptions = [
    "Health Insurance",
    "Paid Time Off",
    "Remote Friendly",
    "Bonus",
    "Provident Fund",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Full-Time Job</h2>

      {/* Job Type fixed to Full Time (still saved for clarity) */}
      <SelectField
        label="Job Type"
        field="jobType"
        options={[{ value: "Full Time" }]}
        required
      />

      {/* Company & Role */}
      <FormField label="Company" field="company" placeholder="e.g. Acme Corp" required />
      <FormField label="Job Title" field="name" placeholder="e.g. Frontend Engineer" required />
      <FormField
        label="Job Description"
        field="description"
        type="textarea"
        placeholder="Role summary, responsibilities, stack, etc."
        required
      />

      {/* Salary & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Annual Salary (₹)"
          field="salary"
          type="number"
          placeholder="e.g. 1200000"
        />
        <FormField
          label="Experience"
          field="experience"
          placeholder="e.g. 2-4 years"
        />
      </div>

      {/* Skills & Benefits */}
      <CheckboxGroupField label="Skills" field="skills" options={skillOptions} cols={3} />
      <CheckboxGroupField label="Benefits" field="benefits" options={benefitOptions} cols={3} />

      {/* Location (you already capture address via your shared Location picker; if you want city/onsite/remote flags, add below) */}
      <SelectField
        label="Work Mode"
        field="workMode"
        options={[
          { value: "Onsite" },
          { value: "Hybrid" },
          { value: "Remote" },
        ]}
      />

      {/* Contact (inline). If you have a shared section, replace with it. */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Recruiter / HR"
          value={sellerInfo.name}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo.email}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo.phone}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
