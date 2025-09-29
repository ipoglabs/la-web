'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FreelanceContractorForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set category/subcategory defaults
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Freelance / Contractor");
  }, [store.category, store.subcategory, setField]);

  // Seller info helper
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Freelance / Contractor Details</h2>

        {/* Category/Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Business" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Freelance / Contractor" required />
        </div>

        {/* Service Info */}
        <FormField label="Service Title" field="title" placeholder="e.g., Web Developer, Graphic Designer" />
        <FormField label="Service Type" field="serviceType" placeholder="e.g., Web Development, Content Writing" />
        <FormField label="Skills" field="skills" placeholder="e.g., React, Photoshop, SEO" />
        <FormField label="Description" field="description" type="textarea" placeholder="Describe your services..." />

        {/* Rates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Hourly Rate (₹)" field="hourlyRate" placeholder="e.g., 500/hr" />
          <FormField label="Project Rate (₹)" field="projectRate" placeholder="e.g., 15000/project" />
        </div>

        {/* Availability & Location */}
        <FormField label="Availability" field="availability" placeholder="e.g., Part-time, Full-time, Flexible" />
        <FormField label="Location" field="location" placeholder="e.g., Remote, Chennai, Bangalore" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", v as string)}
            placeholder="Enter contact name"
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", v as string)}
            placeholder="Enter contact email"
          />
        </div>
        <FormField
          label="Contact Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          placeholder="+91 9876543210"
        />
      </CardContent>
    </Card>
  );
}
