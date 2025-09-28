"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function TechnologyServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Technology
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Technology");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  // Controlled “skills” text ↔ array mapping (comma-separated)
  const skillsText =
    Array.isArray(store.skills) ? store.skills.join(", ") : (store.skills as string) || "";
  const onSkillsChange = (v?: string | number) => {
    const raw = String(v ?? "");
    const arr = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("skills", arr);
  };

  return (
    <Card className="max-w-3xl mx-auto p-0 shadow-md rounded-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Technology Service</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category / Subcategory (read-only-ish fields still in store) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Technology" required />
        </div>

        {/* Service Type */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select Service Type"
          options={[
            { value: "it-support", label: "IT Support" },
            { value: "software-development", label: "Software Development" },
            { value: "web-design", label: "Web Design & Development" },
            { value: "networking", label: "Networking & Security" },
            { value: "repair", label: "Hardware/Device Repair" },
            { value: "consulting", label: "Tech Consulting" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Title → name */}
        <FormField
          label="Title"
          field="name"
          placeholder="e.g., Professional Web Developer"
          required
        />

        {/* Description */}
        <FormField
          label="Service Description"
          field="description"
          type="textarea"
          placeholder="Describe your service in detail..."
          required
        />

        {/* Skills (comma-separated -> array) */}
        <FormField
          label="Skills / Expertise"
          field="__ignore_skills__"
          placeholder="e.g., JavaScript, React, Networking, AWS"
          value={skillsText}
          onChange={onSkillsChange}
        />

        {/* Experience */}
        <FormField
          label="Experience (years)"
          field="experience"
          type="number"
          placeholder="e.g., 5"
        />

        {/* Availability */}
        <SelectField
          label="Availability"
          field="availability"
          placeholder="Select Availability"
          options={[
            { value: "full-time", label: "Full-Time" },
            { value: "part-time", label: "Part-Time" },
            { value: "contract", label: "Contract" },
            { value: "freelance", label: "Freelance" },
            { value: "remote", label: "Remote" },
          ]}
        />

        {/* Location (stored in location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Rate: map to budgetType + budgetAmount (used across app) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Rate Type"
            field="budgetType"
            placeholder="Select"
            options={[
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
              { value: "monthly", label: "Monthly" },
              { value: "project", label: "Per Project" },
              { value: "negotiable", label: "Negotiable" },
            ]}
          />
          <FormField
            label="Rate"
            field="__ignore_budgetAmount__"
            type="number"
            placeholder="Enter rate"
            value={store.budgetAmount ?? ""}
            onChange={(v) => setField("budgetAmount", typeof v === "number" ? v : Number(v))}
          />
        </div>

        {/* Contact Info → sellerInfo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your Name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="you@example.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>

        {/* No local submit — user proceeds via your Preview → Submit flow */}
      </CardContent>
    </Card>
  );
}
