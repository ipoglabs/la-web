"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ElectronicsSaleForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Electronics & Gadgets");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Sell Electronics</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Electronics & Gadgets"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Ad Title"
          field="title"
          placeholder="e.g., iPhone 14 Pro Max for Sale"
          required
        />

        {/* Brand */}
        <FormField
          label="Brand"
          field="brand"
          placeholder="e.g., Apple, Samsung, Sony"
        />

        {/* Model */}
        <FormField
          label="Model"
          field="model"
          placeholder="e.g., Galaxy S23, PlayStation 5"
        />

        {/* Condition */}
        <SelectField
          label="Condition"
          field="condition"
          placeholder="Select Condition"
          options={[
            { value: "new", label: "New" },
            { value: "like-new", label: "Like New" },
            { value: "used", label: "Used" },
            { value: "for-parts", label: "For Parts" },
          ]}
        />

        {/* Price */}
        <FormField
          label="Price (INR)"
          field="price"
          type="number"
          placeholder="Enter price"
        />

        {/* Warranty */}
        <SelectField
          label="Warranty"
          field="warranty"
          placeholder="Select Warranty"
          options={[
            { value: "no", label: "No Warranty" },
            { value: "under-warranty", label: "Under Warranty" },
            { value: "extended", label: "Extended Warranty" },
          ]}
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the item..."
        />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your Name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
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
