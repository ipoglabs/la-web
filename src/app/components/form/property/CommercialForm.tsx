// src/app/components/form/property/CommercialForm.tsx
"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function CommercialForm() {
  const facilitiesOptions = [
    "Parking",
    "Lift",
    "Power Backup",
    "Security/CCTV",
    "Fire Safety",
    "Visitor Parking",
  ];

  const sellerInfo = usePostFormStore((s) => s.sellerInfo);
  const setField = usePostFormStore((s) => s.setField);

  return (
    <div className="space-y-6">
      {/* Basic */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="e.g. Commercial Office Space in T. Nagar"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the space, highlights, connectivity, etc."
      />

      {/* Commercial-specific */}
      <SelectField
        label="Property Type"
        field="propertyType"
        options={[
          { value: "office", label: "Office" },
          { value: "shop", label: "Shop" },
          { value: "warehouse", label: "Warehouse" },
          { value: "showroom", label: "Showroom" },
          { value: "industrial", label: "Industrial" },
          { value: "coworking", label: "Co-working" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Built-up Area (sq ft)" field="builtup_area" type="number" />
        <FormField label="Carpet Area (sq ft)" field="carpet_area" type="number" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Floor" field="floor" type="number" placeholder="e.g. 4" />
        <FormField label="Total Floors" field="totalFloors" type="number" placeholder="e.g. 10" />
        <SelectField
          label="Furnishing"
          field="furnishing"
          options={[
            { value: "unfurnished", label: "Unfurnished" },
            { value: "semi", label: "Semi-furnished" },
            { value: "furnished", label: "Furnished" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Washrooms" field="washrooms" type="number" />
        <SelectField
          label="Pantry"
          field="pantry"
          options={[
            { value: "none", label: "None" },
            { value: "dry", label: "Dry Pantry" },
            { value: "wet", label: "Wet Pantry" },
          ]}
        />
        <FormField label="Parking Spaces" field="parkingSpaces" type="number" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Monthly Rent (₹)" field="rentPrice" type="number" />
        <FormField label="Security Deposit (₹)" field="deposit" type="number" />
        <FormField label="Maintenance (₹)" field="maintenance" type="number" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Available From" field="available_from" type="date" />
        <FormField label="Lease Term (months)" field="leaseTerm" type="number" />
        <SelectField
          label="Power Backup"
          field="powerBackup"
          options={[
            { value: "none", label: "None" },
            { value: "partial", label: "Partial" },
            { value: "full", label: "Full" },
          ]}
        />
      </div>

      <CheckboxGroupField
        label="Facilities"
        field="facilities"
        options={facilitiesOptions}
        cols={3}
      />

      {/* ✅ Contact Info (same as ForStudentForm) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Owner/Manager Name"
          value={sellerInfo.name}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, name: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email address"
          value={sellerInfo.email}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, email: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="tel"
          placeholder="Phone number"
          value={sellerInfo.phone}
          onChange={(e) =>
            setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
          }
        />
      </div>
    </div>
  );
}
