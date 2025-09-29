"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function RetailShoppingForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default the main category/subcategory for this form
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Retail & Shopping");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Retail & Shopping</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Retail & Shopping"
            required
          />
        </div>

        {/* Product Name */}
        <FormField
          label="Product Name"
          field="name"
          placeholder="e.g., T-shirt, Sofa, Shoes"
          required
        />

        {/* Brand */}
        <FormField label="Brand" field="brand" placeholder="e.g., Nike, Samsung" />

        {/* Model */}
        <FormField label="Model" field="model" placeholder="Model name or number" />

        {/* Size */}
        <FormField label="Size / Dimensions" field="size" placeholder="e.g., M, 42-inch" />

        {/* Color */}
        <FormField label="Color" field="color" placeholder="e.g., Red, Black" />

        {/* Material */}
        <FormField label="Material" field="material" placeholder="e.g., Cotton, Leather" />

        {/* Warranty */}
        <FormField label="Warranty / Guarantee" field="warranty" placeholder="e.g., 1 year" />

        {/* Return Policy */}
        <FormField label="Return Policy" field="returnPolicy" placeholder="e.g., 7 days return" />

        {/* Offers */}
        <FormField label="Available Offers" field="offers" placeholder="e.g., 10% off" />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select Condition"
          options={[
            { value: "new", label: "New" },
            { value: "used", label: "Used" },
          ]}
        />

        {/* Delivery Option */}
        <SelectField
          label="Delivery / Pickup Option"
          field="deliveryOption"
          placeholder="Select Option"
          options={[
            { value: "pickup", label: "Pickup Only" },
            { value: "delivery", label: "Delivery Available" },
            { value: "both", label: "Pickup & Delivery" },
          ]}
        />

        {/* Price */}
        <FormField
          label="Price (INR)"
          field="salePrice"
          type="number"
          placeholder="e.g., 1500"
        />

        {/* Quantity */}
        <FormField label="Quantity" field="quantity" type="number" placeholder="Available stock" />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Details about the product"
        />

        {/* Contact Info (sellerInfo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Contact Person"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Email Address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Phone Number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
