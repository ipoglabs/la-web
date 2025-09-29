'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HealthBeautyForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Health & Beauty");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Health & Beauty Item</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Health & Beauty" required />
        </div>

        {/* Product Type */}
        <FormField label="Product Type" field="productType" placeholder="E.g., Skincare, Haircare, Makeup" required />

        {/* Brand */}
        <FormField label="Brand" field="brand" placeholder="E.g., L'Oréal, Himalaya, Lakmé" />

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

        {/* Price */}
        <FormField label="Price (INR)" field="price" type="number" placeholder="Enter price" required />

        {/* Description */}
        <FormField label="Description" field="description" type="textarea" placeholder="Describe the product (features, expiry date, etc.)"  />

        {/* Seller Info */}
        <h3 className="text-xl font-semibold mt-6">Seller Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            field="__ignore_seller_name__"
            placeholder="Your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", v as string)}
            required
          />
          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            placeholder="Contact number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", v as string)}
            required
          />
        </div>

        <FormField
          label="Email"
          field="__ignore_seller_email__"
          type="email"
          placeholder="Your email"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
        />
      </CardContent>
    </Card>
  );
}
