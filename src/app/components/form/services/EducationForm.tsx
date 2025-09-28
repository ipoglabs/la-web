"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function EducationForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Education
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Education");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested fields
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto my-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post Education Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Education" required />
        </div>

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name"
          placeholder="e.g., Mathematics Tutoring, IELTS Coaching"
          required
        />

        <SelectField
          label="Education Type"
          field="educationType"
          placeholder="Select type"
          options={[
            { value: "tutoring", label: "Tutoring" },
            { value: "coaching", label: "Coaching/Training Center" },
            { value: "online", label: "Online Courses" },
            { value: "school", label: "School/College Classes" },
            { value: "language", label: "Language Classes" },
            { value: "professional", label: "Professional Certification" },
          ]}
        />

        <FormField
          label="Subject / Course"
          field="subject"
          placeholder="e.g., Physics, IELTS, Graphic Design"
        />

        <SelectField
          label="Mode of Study"
          field="mode"
          placeholder="Select mode"
          options={[
            { value: "offline", label: "Offline (In-person)" },
            { value: "online", label: "Online" },
            { value: "both", label: "Both" },
          ]}
        />

        <FormField
          label="Required Qualification (if any)"
          field="qualification"
          placeholder="e.g., B.Sc., High School, Open for All"
        />

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Experience (years)"
            field="experience"
            type="number"
            placeholder="e.g., 5"
          />
          <FormField
            label="Availability / Schedule"
            field="availability"
            placeholder="e.g., Weekdays evenings, Weekends"
          />
          <FormField
            label="Fees / Price"
            field="price" // mapped to numeric price
            type="number"
            placeholder="e.g., 500 per hour / 5000 per course"
          />
        </div>

        {/* Additional Info */}
        <FormField
          label="Additional Information"
          field="description"
          type="textarea"
          placeholder="Provide details about the service, topics covered, teaching method..."
        />

        {/* Contact Info */}
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
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="example@email.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
