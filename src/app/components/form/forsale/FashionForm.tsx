"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FashionAccessoriesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Fashion & Accessories");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Fashion & Accessories</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Fashion & Accessories"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Ad Title"
          field="title"
          placeholder="e.g., Designer Handbag, Men's Sneakers"
          required
        />

        {/* Brand */}
        <FormField label="Brand" field="brand" placeholder="e.g., Nike, Zara, Fossil" />

        {/* Size */}
        <FormField label="Size" field="size" placeholder="e.g., M, L, 42, Free Size" />

        {/* Color */}
        <FormField label="Color" field="color" placeholder="e.g., Black, Red, Gold" />

        {/* Material */}
        <FormField label="Material" field="material" placeholder="e.g., Cotton, Leather, Metal" />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select Condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
          ]}
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          field="gender"
          placeholder="Select Gender"
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "unisex", label: "Unisex" },
          ]}
        />

        {/* Price */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Add details about the fashion item..."
        />

        {/* Seller Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Seller Name"
            field="__ignore_seller_name__"
            placeholder="Enter your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Info"
            field="__ignore_seller_phone__"
            placeholder="Phone number or email"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
