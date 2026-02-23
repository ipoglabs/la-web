"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function JobTemporaryForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const company = usePostFormStore((s) => (s as any).company) ?? "";
  const workMode = usePostFormStore((s) => (s as any).workMode) ?? "";
  const startDate = usePostFormStore((s) => (s as any).startDate) ?? "";
  const endDate = usePostFormStore((s) => (s as any).endDate) ?? "";
  const workingHours = usePostFormStore((s) => (s as any).workingHours) ?? "";
  const salary = usePostFormStore((s) => (s as any).salary) ?? "";
  const skills = usePostFormStore((s) => (s as any).skills) ?? [];

  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {
    name: "",
    email: "",
    phone: "",
  };

  const [skillsText, setSkillsText] = useState(
    Array.isArray(skills) ? skills.join(", ") : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ set employment type
  useEffect(() => {
    setField("employmentType", "Temporary");
  }, [setField]);

  // convert skills text → array
  const commitSkills = () => {
    const arr = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setField("skills", arr);
  };

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
    window.dispatchEvent(
      new CustomEvent("jobtemporaryform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Job title is required.";
    if (!company.trim()) mapped.company = "Company is required.";

    if (salary && !isPositive(salary)) {
      mapped.salary = "Salary must be greater than 0.";
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      mapped.endDate = "End date must be after start date.";
    }

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
      id="jobTemporaryForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Temporary Job
      </h2>

      {/* Title */}
      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Company */}
      <FormField
        label="Company"
        field="company"
        value={company}
        onChange={(v) => setField("company", v)}
        required
      />

      {/* Work Mode + Hours */}
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
          label="Working Hours"
          field="workingHours"
          value={workingHours}
          onChange={(v) => setField("workingHours", v)}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          field="startDate"
          type="date"
          value={startDate}
          onChange={(v) => setField("startDate", v)}
        />

        <FormField
          label="End Date"
          field="endDate"
          type="date"
          value={endDate}
          onChange={(v) => setField("endDate", v)}
        />
      </div>

      {/* Salary */}
      <FormField
        label="Salary (₹)"
        field="salary"
        type="number"
        value={salary}
        onChange={(v) => setField("salary", v)}
      />

      {/* Skills */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Required Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
          placeholder="e.g. Communication, Customer Service"
        />
      </div>

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Contact */}
      {/* <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.name}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                name: e.target.value,
              })
            }
            placeholder="Name"
          />

          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.email}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                email: e.target.value,
              })
            }
            placeholder="Email"
          />

          <input
            className="border rounded px-3 py-2"
            value={sellerInfo.phone}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                phone: e.target.value,
              })
            }
            placeholder="Phone"
          />
        </div>
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}
