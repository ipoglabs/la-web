"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function OtherServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Other
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Other");
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

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Post Other Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Other" required />
        </div>

        {/* Service Type */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select service type"
          options={[
            { value: "repair", label: "Repair" },
            { value: "consultancy", label: "Consultancy" },
            { value: "misc", label: "Miscellaneous" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name" // maps serviceTitle → name
          placeholder="Enter service title"
          required
        />
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the service offered"
          required
        />

        {/* Pricing & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Price (₹)"
            field="price"       // numeric for INR formatting in preview
            type="number"
            placeholder="Enter price or rate"
          />
          <FormField
            label="Availability"
            field="availability"
            placeholder="e.g., Weekdays, Weekends, Anytime"
          />
        </div>

        {/* Location (stored in location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="Enter service location"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
          required
        />

        {/* Contact Information → sellerInfo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Enter your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Number"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Enter contact number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Enter email address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
          />
        </div>

        {/* No local submit — proceed via your global Preview flow */}
      </CardContent>
    </Card>
  );
}
