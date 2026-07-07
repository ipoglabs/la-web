"use client";

import * as React from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";

export default function BusinessServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory are set
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Services");
  }, [store.category, store.subcategory, setField]);

  // Helpers for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Business Service</h2>

        {/* Category/Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Business" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Services" required />
        </div>

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name"
          placeholder="e.g., Accounting, Marketing, IT Support"
          required
        />
        <FormField
          label="Business Type"
          field="businessType"
          placeholder="e.g., Consultancy, Repair, Freelance"
        />
        <FormField
          label="Service Description"
          field="description"
          type="textarea"
          placeholder="Describe your business service in detail..."
          required
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
            label="Availability"
            field="availability"
            placeholder="e.g., Weekdays 9–6, Flexible"
          />
          <FormField
            label="Price (per hour / session)"
            field="price"
            type="number"
            placeholder="e.g., 1500"
          />
        </div>

        {/* Seller Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your full name"
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
