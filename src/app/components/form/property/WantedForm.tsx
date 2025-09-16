"use client";

import { useState } from "react";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";
// If you have the shared contact section component, you can use it instead of the inline contact fields below.
// import ContactDetailsSection from "@/app/components/form/ContactDetailsSection";

export default function WantedPropertyForm() {
  const { setField, sellerInfo } = usePostFormStore();

  const amenityChoices = [
    "Parking",
    "Lift",
    "Power Backup",
    "Security",
    "Water Supply",
    "Balcony",
    "Garden",
    "Gym",
    "Swimming Pool",
    "Club House",
  ];

  // A tiny local helper to edit preferred_locations as a comma-separated string
  // while storing it in the store as a string[] (so buildPostFormData sends JSON array)
  const [preferredLocationsString, setPreferredLocationsString] = useState("");

  const handlePreferredLocationsChange = (v: string) => {
    setPreferredLocationsString(v);
    const arr = v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("preferred_locations", arr);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Wanted Property</h2>

      {/* Looking For (property type) */}
      <SelectField
        label="Looking For"
        field="propertyType"
        options={[
          { value: "Apartment" },
          { value: "IndependentHouse", label: "Independent House" },
          { value: "Villa" },
          { value: "Room/PG", label: "Room / PG" },
          { value: "Commercial" },
          { value: "Plot", label: "Plot / Land" },
          { value: "Other" },
        ]}
        required
      />

      {/* Requirement Title & Description */}
      <FormField
        label="Requirement Title"
        field="name"
        placeholder="e.g. 2BHK Flat near IT Park"
        required
      />
      <FormField
        label="Additional Requirements"
        field="description"
        type="textarea"
        placeholder="Facing, pet-friendly, near metro, furnished, etc."
      />

      {/* Preferred Location(s) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Locations</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Comma-separated (e.g. Andheri East, Powai, Marol)"
          value={preferredLocationsString}
          onChange={(e) => handlePreferredLocationsChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          We store these as an array and send JSON to the API.
        </p>
      </div>

      {/* Budget (Min & Max) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Min Budget (₹)" field="minBudget" type="number" required />
        <FormField label="Max Budget (₹)" field="maxBudget" type="number" required />
      </div>

      {/* Size & Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Min Area (sq.ft.)" field="minArea" type="number" />
        <FormField label="Bedrooms" field="beds" type="number" />
        <FormField label="Bathrooms" field="baths" type="number" />
      </div>

      {/* Preferred Amenities */}
      <CheckboxGroupField
        label="Preferred Amenities"
        field="amenities"
        options={amenityChoices}
        cols={3}
      />

      {/* Contact (inline). If you already use a shared contact section, replace with <ContactDetailsSection /> */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Your Full Name"
          value={sellerInfo.name}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
          required
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
          required
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
          required
        />
      </div>
    </div>
  );
}
