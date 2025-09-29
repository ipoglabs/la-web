"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function B2CServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "B2C");
    if (!store.subcategory) setField("subcategory", "Services");
  }, [store.category, store.subcategory, setField]);

  // helpers for nested fields
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post Your B2C Service</h2>

        <FormField
          label="Service Name"
          field="name"
          placeholder="e.g., Home Cleaning, Catering, Fitness Coaching"
          required
        />

        <FormField
          label="Category"
          field="subcategory"
          placeholder="e.g., Home Service, Food Service"
          required
        />

        <FormField
          label="Target Audience"
          field="targetAudience"
          placeholder="e.g., Families, Students, Professionals"
        />

        <FormField
          label="Price / Rate (₹)"
          field="salePrice"
          type="number"
          inputMode="decimal"
          placeholder="e.g., 500 per session"
        />

        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="e.g., Chennai, Remote"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
          required
        />

        <FormField
          label="Availability"
          field="availability"
          placeholder="e.g., Weekdays, Weekends, 24/7"
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe your service in detail"
          required
        />

        {/* Contact Details */}
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
            label="Phone Number"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Enter phone number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Enter email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
        </div>

        <FormField
          label="Website / Social Link"
          field="website"
          placeholder="https://example.com"
        />
      </CardContent>
    </Card>
  );
}
