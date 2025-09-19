// src/app/components/form/pets/PetAccessoriesForm.tsx
"use client";

import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { useMemo } from "react";

export default function PetAccessoriesForm() {
  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name);
  const description = usePostFormStore((s) => s.description);
  const category = usePostFormStore((s) => (s as any).petCategory);
  const brand = usePostFormStore((s) => (s as any).brand);
  const condition = usePostFormStore((s) => (s as any).condition);
  const salePrice = usePostFormStore((s) => s.salePrice);
  const location = usePostFormStore((s) => s.location?.address ?? "");
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  // Predefined options
  const categories = useMemo(
    () => [
      { value: "food", label: "Food" },
      { value: "toys", label: "Toys" },
      { value: "bedding", label: "Bedding" },
      { value: "grooming", label: "Grooming" },
      { value: "cage", label: "Cage / Carrier" },
      { value: "others", label: "Others" },
    ],
    []
  );

  const conditions = useMemo(
    () => [
      { value: "new", label: "New" },
      { value: "used", label: "Used" },
      { value: "gentlyUsed", label: "Gently Used" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Pet Accessories</h2>

      {/* Accessory Name */}
      <FormField
        label="Accessory Name"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g., Dog Leash, Cat Scratching Post"
        required
      />

      {/* Category / Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Category"
          field="petCategory"
          value={category ?? ""}
          onChange={(v) => setField("petCategory", v)}
          options={categories}
          required
        />
        <FormField
          label="Brand"
          field="brand"
          value={brand ?? ""}
          onChange={(v) => setField("brand", v)}
          placeholder="e.g., Pedigree, Royal Canin, Whiskas"
        />
      </div>

      {/* Condition / Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Condition"
          field="condition"
          value={condition ?? ""}
          onChange={(v) => setField("condition", v)}
          options={conditions}
          required
        />
        <FormField
          label="Price (₹)"
          field="salePrice"
          type="number"
          value={salePrice ?? ""}
          onChange={(v) => setField("salePrice", v)}
          placeholder="Enter price"
          required
        />
      </div>

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Describe size, usage, condition, etc."
      />

      {/* Location */}
      <FormField
        label="Location"
        field="location.address"
        value={location}
        onChange={(v) => setField("location", { ...(usePostFormStore.getState().location || {}), address: v })}
        placeholder="City / Area"
        required
      />

      {/* Seller Info */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="sellerInfo.name"
            value={sellerInfo?.name ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, name: v })}
            placeholder="Your Name"
            required
          />
          <FormField
            label="Email"
            field="sellerInfo.email"
            type="email"
            value={sellerInfo?.email ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, email: v })}
            placeholder="Email address"
          />
          <FormField
            label="Phone"
            field="sellerInfo.phone"
            type="tel"
            value={sellerInfo?.phone ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, phone: v })}
            placeholder="Phone number"
            required
          />
        </div>
      </div>
    </div>
  );
}
