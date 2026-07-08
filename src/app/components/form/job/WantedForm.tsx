"use client";

import React, { useRef, useState, useEffect } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useJobConfig } from "@/hooks/useJobConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function JobWantedForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = useJobConfig();
  const { currency, locationPlaceholder } = useCountryConfig();

  const setField   = usePostFormStore((s) => s.setField);
  const skills     = usePostFormStore((s) => s.skills);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const salary      = usePostFormStore((s) => (s as any).salary) ?? "";
  const experience  = usePostFormStore((s) => (s as any).experience) ?? "";
  const available_from = usePostFormStore((s) => (s as any).available_from) ?? "";
  const preferred_locations = usePostFormStore((s) => (s as any).preferred_locations) ?? "";
  const candidateName    = usePostFormStore((s) => (s as any).candidateName) ?? "";
  const employmentType   = usePostFormStore((s) => (s as any).employmentType) ?? "";

  const [skillsText, setSkillsText] = useState(
    Array.isArray(skills) ? skills.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("employmentType", "");
  }, [setField]);

  const commitSkills = () => {
    const arr = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("skills", arr);
  };

  const updateSeller = (k: "name" | "email" | "phone", v: string) => {
    const current = sellerInfo || { name: "", email: "", phone: "" };
    setField("sellerInfo", { ...current, [k]: v });
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("jobwantedform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!candidateName.trim()) mapped.candidateName = "Your name is required.";
    if (!name.trim())          mapped.name          = "Desired job title is required.";
    if (!sellerInfo?.email?.trim()) mapped["sellerInfo.email"] = "Email is required.";

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
      id="jobWantedForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Job Wanted</h2>

      <FormField
        label="Your Name"
        field="candidateName"
        value={candidateName}
        onChange={(v) => setField("candidateName", v)}
        placeholder="e.g. John Doe"
        required
      />

      <FormField
        label="Desired Job Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Software Engineer"
        required
      />

      <ToggleButtonGroup title="Employment Type" singleSelect value={employmentType ? [employmentType] : []} onChange={(v) => setField("employmentType", v[0] ?? "")}>
        <ToggleGroupButton value="full-time">Full Time</ToggleGroupButton>
        <ToggleGroupButton value="part-time">Part Time</ToggleGroupButton>
        <ToggleGroupButton value="internship">Internship</ToggleGroupButton>
        <ToggleGroupButton value="freelance">Freelance</ToggleGroupButton>
        <ToggleGroupButton value="temporary">Temporary</ToggleGroupButton>
        <ToggleGroupButton value="contract">Contract</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Preferred Location"
        field="preferred_locations"
        value={preferred_locations}
        onChange={(v) => setField("preferred_locations", v)}
        placeholder={locationPlaceholder}
      />

      <FormField
        label="Available From"
        field="available_from"
        type="date"
        value={available_from}
        onChange={(v) => setField("available_from", v)}
      />

      <FormField
        label={`Expected Salary (${currency})`}
        field="salary"
        type="number"
        value={salary}
        onChange={(v) => setField("salary", v)}
        placeholder={config.salaryPlaceholder}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Skills</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="e.g. React, Node.js, Marketing"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          onBlur={commitSkills}
        />
        <p className="text-xs text-gray-500">Comma-separate skills — they will be saved as a list.</p>
      </div>

      <FormField
        label="Experience"
        field="experience"
        value={experience}
        onChange={(v) => setField("experience", v)}
        placeholder="e.g. 2 years in Marketing"
      />

      <FormField
        label="Additional Info / Career Objective"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        placeholder="Share your goals, strengths, or career objectives"
      />

      {/* Contact Details */}
      <div className="space-y-3 border-t pt-5">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              name="sellerInfo.name"
              className="border rounded w-full py-2 px-3"
              placeholder="Your Name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => updateSeller("name", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="sellerInfo.email"
              type="email"
              className="border rounded w-full py-2 px-3"
              placeholder="you@email.com"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => updateSeller("email", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <input
              name="sellerInfo.phone"
              className="border rounded w-full py-2 px-3"
              placeholder="+1 555 555 5555"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => updateSeller("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
