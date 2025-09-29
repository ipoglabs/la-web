"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function EquipmentSuppliesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory (For Sale → Equipment & Supplies)
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Equipment & Supplies");
  }, [store.category, store.subcategory, setField]);

  // Nested helpers
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Equipment & Supplies Listing</h2>

          {/* Category/Subcategory (read-only-ish fields bound to store) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" field="category" placeholder="For Sale" required />
            <FormField
              label="Subcategory"
              field="subcategory"
              placeholder="Equipment & Supplies"
              required
            />
          </div>

          {/* Title → name */}
          <FormField
            label="Title"
            field="name"
            placeholder="e.g., Industrial Generator for Sale"
            required
          />

          {/* Category (item type) */}
          <SelectField
            label="Item Category"
            field="itemCategory"
            placeholder="Select Category"
            options={[
              { value: "machinery", label: "Machinery" },
              { value: "tools", label: "Tools" },
              { value: "office_supplies", label: "Office Supplies" },
              { value: "construction_equipment", label: "Construction Equipment" },
              { value: "other", label: "Other" },
            ]}
          />

          {/* Condition */}
          <SelectField
            label="Condition"
            field="condition"
            placeholder="Select Condition"
            options={[
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
              { value: "refurbished", label: "Refurbished" },
            ]}
          />

          {/* Price / Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Price (₹)"
              field="salePrice"
              type="number"
              inputMode="decimal"
              placeholder="Enter price"
              required
            />
            <FormField
              label="Quantity"
              field="quantity"
              type="number"
              inputMode="numeric"
              placeholder="Enter available units"
            />
          </div>

          {/* Location (nested) */}
          <FormField
            label="Location"
            field="__ignore_location__"
            placeholder="e.g., Chennai, Tamil Nadu"
            value={store.location?.address ?? ""}
            onChange={(v) => setLoc((v as string) || "")}
            required
          />

          {/* Seller Type (kept as a free field; add to schema if you want to persist) */}
          <SelectField
            label="Seller Type"
            field="sellerType"
            placeholder="Select Seller Type"
            options={[
              { value: "individual", label: "Individual" },
              { value: "business", label: "Business" },
              { value: "dealer", label: "Dealer" },
            ]}
          />

          {/* Brand / Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Brand" field="brand" placeholder="e.g., Caterpillar, Bosch" />
            <FormField label="Model" field="model" placeholder="e.g., X200 Heavy Duty" />
          </div>

          {/* Description */}
          <FormField
            label="Description"
            field="description"
            type="textarea"
            placeholder="Provide details about the equipment/supplies"
            required
          />

          {/* Contact Info (nested seller_info) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Contact Name"
              field="__ignore_seller_name__"
              placeholder="Contact person"
              value={store.sellerInfo?.name ?? ""}
              onChange={(v) => setSeller("name", (v as string) || "")}
              required
            />
            <FormField
              label="Contact Phone"
              field="__ignore_seller_phone__"
              type="tel"
              placeholder="Phone number"
              value={store.sellerInfo?.phone ?? ""}
              onChange={(v) => setSeller("phone", (v as string) || "")}
              required
            />
            <FormField
              label="Contact Email"
              field="__ignore_seller_email__"
              type="email"
              placeholder="Email address"
              value={store.sellerInfo?.email ?? ""}
              onChange={(v) => setSeller("email", (v as string) || "")}
            />
          </div>

          {/* No submit button here—use your Preview page flow to submit */}
        </CardContent>
      </Card>
    </div>
  );
}
