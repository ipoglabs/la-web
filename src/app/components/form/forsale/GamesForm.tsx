"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ToysGamesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Toys & Games");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Toys & Games</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Toys & Games" required />
        </div>

        {/* Title */}
        <FormField label="Ad Title" field="title" placeholder="E.g., LEGO Star Wars Set" required />

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

        {/* Brand */}
        <FormField label="Brand" field="brand" placeholder="E.g., LEGO, Hot Wheels, Barbie" />

        {/* Age Group */}
        <SelectField
          label="Suitable Age Group"
          field="ageGroup"
          placeholder="Select age group"
          options={[
            { value: "0-2", label: "0 - 2 years" },
            { value: "3-5", label: "3 - 5 years" },
            { value: "6-8", label: "6 - 8 years" },
            { value: "9-12", label: "9 - 12 years" },
            { value: "13+", label: "13 years and above" },
          ]}
        />

        {/* Material */}
        <FormField label="Material" field="material" placeholder="E.g., Plastic, Wood, Fabric" />

        {/* Price */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" />

        {/* Description */}
        <FormField label="Description" field="description" type="textarea" placeholder="Provide details about the toy/game..." />

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
