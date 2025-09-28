"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ServiceWantedForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Wanted
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Wanted");
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
        <h2 className="text-2xl font-bold">Request a Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Wanted" required />
        </div>

        {/* Title (optional) */}
        <FormField
          label="Title"
          field="name"
          placeholder="e.g., Need plumber for kitchen sink repair"
        />

        {/* Service Type */}
        <FormField
          label="Service Type"
          field="serviceType"
          placeholder="e.g., Plumbing, Tutoring, Moving Help"
          required
        />

        {/* Description */}
        <FormField
          label="Description of Service Needed"
          field="description"
          type="textarea"
          placeholder="Provide details of what you need, timing, any constraints…"
          required
        />

        {/* Location (stored under location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Area"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
          required
        />

        {/* Budget + Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Budget (if applicable, INR)"
            field="budgetAmount"
            type="number"
            placeholder="e.g., 5000"
          />
          <SelectField
            label="Urgency"
            field="urgency"
            placeholder="Select urgency"
            options={[
              { value: "immediate", label: "Immediate" },
              { value: "within-a-week", label: "Within a week" },
              { value: "flexible", label: "Flexible" },
            ]}
          />
        </div>

        {/* Contact Info (sellerInfo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Your Name"
            field="__ignore_seller_name__"
            placeholder="Enter your name"
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

        {/* No local submit — use your global Preview → Submit flow */}
      </CardContent>
    </Card>
  );
}
