"use client";

import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HolidayRentalForm() {
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);
  const setField = usePostFormStore((s) => s.setField);

  // keep "amenities" consistent with your other forms
  const amenityOptions = [
    "WiFi",
    "Swimming Pool",
    "Air Conditioning",
    "Free Parking",
    "BBQ Grill",
    "Outdoor Dining Area",
    "Private Beach Access",
    "Kitchen",
    "Washing Machine",
    "TV/Smart TV",
    "Garden/Patio",
    "Fireplace",
    "Pet Friendly",
  ];

  // separate "house_rules" array
  const ruleOptions = ["Smoking Allowed", "Pets Allowed", "Parties Allowed", "Children Friendly"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Add Holiday Property</h2>

      {/* Holiday Property Type */}
      <SelectField
        label="Holiday Property Type"
        field="holidayType"
        options={[
          { value: "Villa" },
          { value: "BeachHouse", label: "Beach House" },
          { value: "Cottage" },
          { value: "Resort" },
          { value: "GuestHouse", label: "Guest House" },
          { value: "FarmStay", label: "Farm Stay" },
          { value: "Treehouse" },
          { value: "Other" },
        ]}
        required
      />

      {/* Basic info */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="e.g. Beachfront Villa in Goa"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the holiday property, highlights, and experiences offered"
      />

      {/* Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Guests" field="guests" type="number" required />
        <FormField label="Bedrooms" field="beds" type="number" required />
        <FormField label="Bathrooms" field="baths" type="number" required />
      </div>

      {/* Amenities */}
      <CheckboxGroupField
        label="Amenities"
        field="amenities"
        options={amenityOptions}
        cols={3}
      />

      {/* House Rules */}
      <CheckboxGroupField
        label="House Rules"
        field="house_rules"
        options={ruleOptions}
        cols={2}
      />

      {/* Rates */}
      <div className="bg-blue-50 p-4 rounded-xl space-y-4">
        <h4 className="font-medium">Rates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Nightly" field="rateNightly" type="number" required />
          <FormField label="Weekly" field="rateWeekly" type="number" />
          <FormField label="Monthly" field="rateMonthly" type="number" />
        </div>
      </div>

      {/* Contact (reuse your sellerInfo pattern) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Host/Owner Name"
          value={sellerInfo.name}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email address"
          value={sellerInfo.email}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="tel"
          placeholder="Phone number"
          value={sellerInfo.phone}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
        />
      </div>
    </div>
  );
}
