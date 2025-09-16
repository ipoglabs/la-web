"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function JobWantedForm() {
  const setField = usePostFormStore((s) => s.setField);
  const skills = usePostFormStore((s) => s.skills);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

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
    // set an empty value so UI can pick one; category/subcategory handled elsewhere
    setField("employmentType", "");
  }, [setField]);

  // --- Contact helpers (update nested sellerInfo safely) ---
  const updateSeller = (k: "name" | "email" | "phone", v: string) => {
    const current = sellerInfo || { name: "", email: "", phone: "" };
    setField("sellerInfo", { ...current, [k]: v });
  };

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

      {/* ===================== Contact Details ===================== */}
      <div className="space-y-3 border-t pt-5">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              className="border rounded w-full py-2 px-3"
              placeholder="Your Name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => updateSeller("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="border rounded w-full py-2 px-3"
              placeholder="you@email.com"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => updateSeller("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <input
              className="border rounded w-full py-2 px-3"
              placeholder="+1 555 555 5555"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => updateSeller("phone", e.target.value)}
              required
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          These details populate <code>seller_info</code> and are required to post.
        </p>
      </div>
      {/* =========================================================== */}
    </div>
  );
}
