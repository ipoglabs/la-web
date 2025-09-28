"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function TutoringForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Tutoring
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Tutoring");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested fields
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Tutoring Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Tutoring" required />
        </div>

        {/* Title */}
        <FormField
          label="Title"
          field="name"
          placeholder="e.g., Mathematics Tutor for Classes 8–10"
          required
        />

        {/* Subject */}
        <FormField
          label="Subject"
          field="subject"
          placeholder="e.g., Mathematics, English, Physics"
          required
        />

        {/* Level */}
        <SelectField
          label="Level"
          field="level"
          placeholder="Select level"
          options={[
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
            { value: "higher-secondary", label: "Higher Secondary" },
            { value: "college", label: "College / University" },
            { value: "competitive", label: "Competitive Exams" },
          ]}
        />

        {/* Mode */}
        <SelectField
          label="Mode"
          field="mode"
          placeholder="Select mode"
          options={[
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline (In-person)" },
            { value: "both", label: "Both" },
          ]}
        />

        {/* Qualification */}
        <FormField
          label="Qualification"
          field="qualification"
          placeholder="e.g., MSc Mathematics, B.Ed"
        />

        {/* Experience / Availability / Hourly Rate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Experience (years)"
            field="experience"
            type="number"
            placeholder="e.g., 5"
          />
          <FormField
            label="Availability"
            field="availability"
            placeholder="e.g., Weekdays evenings, Weekends"
          />
          <FormField
            label="Hourly Rate (INR)"
            field="hourlyRate"
            type="number"
            placeholder="e.g., 500"
          />
        </div>

        {/* Location (only if offline/both) */}
        <FormField
          label="Location (if offline)"
          field="__ignore_location__"
          placeholder="City / Area"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Additional Information */}
        <FormField
          label="Additional Information"
          field="description"
          type="textarea"
          placeholder="Briefly describe your teaching approach, syllabus coverage, demo class, etc."
        />

        {/* Contact Info (sellerInfo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Tutor's Name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="tutor@example.com"
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

        {/* No local submit — use global Preview → Submit flow */}
      </CardContent>
    </Card>
  );
}
