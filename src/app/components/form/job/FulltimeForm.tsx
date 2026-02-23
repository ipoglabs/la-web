"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { toast } from "sonner";

export default function JobFulltimeForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const company = usePostFormStore((s) => (s as any).company) ?? "";
  const salary = usePostFormStore((s) => (s as any).salary) ?? "";
  const experience = usePostFormStore((s) => (s as any).experience) ?? "";
  const workMode = usePostFormStore((s) => (s as any).workMode) ?? "";
  const deadline = usePostFormStore((s) => (s as any).deadline) ?? "";
  const applyLink = usePostFormStore((s) => (s as any).applyLink) ?? "";

  const skills = (usePostFormStore((s) => (s as any).skills) ?? []) as string[];
  const benefits = (usePostFormStore((s) => (s as any).benefits) ?? []) as string[];

  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {
    name: "",
    email: "",
    phone: "",
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ auto-set jobType
  useEffect(() => {
    setField("jobType", "Full Time");
  }, [setField]);

  const skillOptions = useMemo(
    () => [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "SQL",
      "Python",
      "Communication",
      "Leadership",
    ],
    []
  );

  const benefitOptions = useMemo(
    () => [
      "Health Insurance",
      "Paid Time Off",
      "Remote Friendly",
      "Bonus",
      "Provident Fund",
    ],
    []
  );

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
      new CustomEvent("jobfulltimeform:validated", { detail: { ok } })
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
    if (!description.trim()) mapped.description = "Description is required.";
    if (!company.trim()) mapped.company = "Company is required.";

    if (salary && !isPositive(salary)) {
      mapped.salary = "Salary must be greater than 0.";
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
      id="jobFulltimeForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Full-Time Job
      </h2>

      {/* Job Type */}
      <SelectField
        label="Job Type"
        field="jobType"
        options={[{ value: "Full Time" }]}
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

      {/* Title */}
      <FormField
        label="Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Description */}
      <FormField
        label="Job Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* Salary / Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Salary (₹)"
          field="salary"
          type="number"
          value={salary}
          onChange={(v) => setField("salary", v)}
        />

        <FormField
          label="Experience"
          field="experience"
          value={experience}
          onChange={(v) => setField("experience", v)}
        />
      </div>

      {/* Skills */}
      <CheckboxGroupField
        label="Skills"
        field="skills"
        options={skillOptions}
        cols={3}
      />

      {/* Benefits */}
      <CheckboxGroupField
        label="Benefits"
        field="benefits"
        options={benefitOptions}
        cols={3}
      />

      {/* Work Mode */}
      <SelectField
        label="Work Mode"
        field="workMode"
        options={[
          { value: "Onsite" },
          { value: "Hybrid" },
          { value: "Remote" },
        ]}
      />

      {/* Deadline */}
      <FormField
        label="Application Deadline"
        field="deadline"
        type="date"
        value={deadline}
        onChange={(v) => setField("deadline", v)}
      />

      {/* Apply Link */}
      <FormField
        label="Apply Link"
        field="applyLink"
        value={applyLink}
        onChange={(v) => setField("applyLink", v)}
      />

      {/* Contact */}
      {/* <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={sellerInfo.name}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                name: e.target.value,
              })
            }
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={sellerInfo.email}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                email: e.target.value,
              })
            }
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={sellerInfo.phone}
            onChange={(e) =>
              setField("sellerInfo", {
                ...sellerInfo,
                phone: e.target.value,
              })
            }
          />
        </div>
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}
