"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function B2BServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "B2B");
    if (!store.subcategory) setField("subcategory", "Services");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };


  return (
    <Card className="max-w-3xl mx-auto mt-8 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post a B2B Service</h2>

        {/* Category/Subcategory (bound to store) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="B2B" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Services" required />
        </div>

        <FormField
          label="Service Title"
          field="name"
          placeholder="e.g. Bulk Manufacturing Service"
          required
        />

        <SelectField
          label="Category (Industry)"
          field="industry"
          placeholder="Select industry"
          options={[
            { value: "manufacturing", label: "Manufacturing" },
            { value: "logistics", label: "Logistics & Supply Chain" },
            { value: "wholesale", label: "Wholesale Trade" },
            { value: "consulting", label: "Consulting" },
            { value: "it-services", label: "IT & Tech Services" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Business Name"
          field="company"
          placeholder="Enter your company name"
          required
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about your service..."
          required
        />

        <FormField
          label="Price / Rate (₹)"
          field="salePrice"
          type="number"
          inputMode="decimal"
          placeholder="e.g. Starting from 5000"
        />

        <FormField
          label="Website (optional)"
          field="website"
          type="text"
          placeholder="https://example.com"
        />

        {/* Location */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Area"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
          required
        />

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Person"
            field="__ignore_seller_name__"
            placeholder="Full Name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
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
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="you@example.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
        </div>

      </CardContent>
    </Card>
  );
}
