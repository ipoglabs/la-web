// src/app/components/form/property/BuyForm.tsx
"use client";

import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";

export default function BuyForm() {
  const setField = usePostFormStore((s) => s.setField);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {
    name: "",
    email: "",
    phone: "",
  };

  const facilitiesOptions = ["Parking", "Gym", "Swimming Pool", "Garden"];

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="eg. 2BHK Apartment in Anna Nagar"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the property…"
      />
      <FormField
        label="Sale Price (₹)"
        field="salePrice"
        type="number"
        placeholder="e.g. 6500000"
      />
      <FormField
        label="Built-up Area (sq ft)"
        field="builtup_area"
        type="number"
      />
      <FormField
        label="Carpet Area (sq ft)"
        field="carpet_area"
        type="number"
      />

      <CheckboxGroupField
        label="Facilities"
        field="facilities"
        options={facilitiesOptions}
        cols={3}
      />

      {/* ✅ Contact Details */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Owner / Agent Name"
              value={sellerInfo.name || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              placeholder="Email address"
              value={sellerInfo.email || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="tel"
              placeholder="Phone number"
              value={sellerInfo.phone || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
