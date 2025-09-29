'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function GardenOutdoorForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Garden & Outdoor");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Garden & Outdoor Item</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Garden & Outdoor" required />
        </div>

        {/* Title */}
        <FormField label="Title" field="title" placeholder="E.g., Outdoor Swing Chair" required />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
          ]}
        />

        {/* Material */}
        <FormField label="Material" field="material" placeholder="E.g., Wood, Metal, Plastic" />

        {/* Price */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" required />

        {/* Location */}
        <FormField label="Location" field="location" placeholder="City / Area" required />

        {/* Description */}
        <FormField label="Description" field="description" type="textarea" placeholder="Provide details about the item" />

        {/* Seller Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Seller Name"
            field="__ignore_seller_name__"
            placeholder="Enter your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", v as string)}
            required
          />
          <FormField
            label="Seller Phone"
            field="__ignore_seller_phone__"
            placeholder="Phone number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", v as string)}
            required
          />
        </div>

        <FormField
          label="Seller Email"
          field="__ignore_seller_email__"
          type="email"
          placeholder="Email address"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
        />
      </CardContent>
    </Card>
  );
}
