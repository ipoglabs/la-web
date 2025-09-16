// src/app/components/form/property/RoomRentalForm.tsx
"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function RoomRentalForm() {
  // for contact section (same pattern you used elsewhere)
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);
  const setField = usePostFormStore((s) => s.setField);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Add Room for Rent</h2>

      {/* Room Type */}
      <SelectField
        label="Room Type"
        field="type"
        options={[
          { value: "SingleRoom", label: "Single Room" },
          { value: "SharedRoom", label: "Shared Room" },
          { value: "PG" },
          { value: "Hostel" },
          { value: "Other" },
        ]}
      />

      {/* Title & Description */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="e.g. Furnished Single Room near University"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the room…"
      />

      {/* Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Monthly Rent (₹)"
          field="rent"
          type="number"
          required
        />
        <FormField
          label="Deposit / Advance (₹)"
          field="deposit"
          type="number"
        />
      </div>

      {/* Availability */}
      <FormField
        label="Available From"
        field="available_from"
        type="date"
        required
      />

      {/* Preferences */}
      <SelectField
        label="Tenant Preferences"
        field="preferred_tenants"
        options={[
          { value: "Any" },
          { value: "Students" },
          { value: "Working Professionals" },
          { value: "Family" },
        ]}
      />

      <SelectField
        label="Gender Preference"
        field="gender_pref"
        options={[
          { value: "Any" },
          { value: "Male" },
          { value: "Female" },
        ]}
      />

      {/* Amenities & Rules */}
      <CheckboxGroupField
        label="Amenities"
        field="amenities"
        options={[
          "WiFi",
          "Attached Bathroom",
          "Air Conditioning",
          "Kitchen Access",
          "Washing Machine",
          "TV/Smart TV",
          "Balcony",
          "Parking",
          "Housekeeping",
          "Meals Included",
        ]}
        cols={3}
      />

      <CheckboxGroupField
        label="Rules"
        field="rules"
        options={["Smoking Allowed", "Pets Allowed", "Guests Allowed"]}
        cols={2}
      />

      {/* Contact Details (wired to Zustand.sellerInfo) */}
      <div className="bg-blue-50 p-4 rounded-xl space-y-3">
        <h4 className="font-medium">Contact Details</h4>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Owner/Manager Name"
            value={sellerInfo?.name || ""}
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
            value={sellerInfo?.email || ""}
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
            value={sellerInfo?.phone || ""}
            onChange={(e) =>
              setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
