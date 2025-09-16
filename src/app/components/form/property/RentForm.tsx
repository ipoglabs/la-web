"use client";

import { useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";

export default function RentPropertyForm() {
  const setField = usePostFormStore((s) => s.setField);

  // If you want to auto-set category/subcategory, do it here (optional):
  // useEffect(() => {
  //   setField("category", "Property");
  //   setField("subcategory", "For Rent");
  // }, [setField]);

  const amenityOptions = [
    "Parking",
    "Lift",
    "Power Backup",
    "Gym",
    "Swimming Pool",
    "Garden",
    "Security",
    "Water Supply",
    "Club House",
    "Balcony",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post a Rental Property</h2>

      {/* Property Type */}
      <SelectField
        label="Property Type"
        field="propertyType"
        options={[
          { value: "Apartment" },
          { value: "IndependentHouse", label: "Independent House" },
          { value: "Villa" },
          { value: "House" },
          { value: "Studio" },
          { value: "Other" },
        ]}
        required
      />

      {/* Title & Description */}
      <FormField
        label="Listing Title"
        field="name"
        placeholder="e.g. Spacious 2BHK for rent in Anna Nagar"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the property, highlights, nearby amenities…"
      />

      {/* Rent / Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Monthly Rent (₹)"
          field="rentPrice"
          type="number"
          placeholder="15000"
          required
        />
        <FormField
          label="Deposit / Advance (₹)"
          field="deposit"
          type="number"
          placeholder="50000"
        />
      </div>

      {/* Beds / Baths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Bedrooms" field="beds" type="number" placeholder="2" />
        <FormField label="Bathrooms" field="baths" type="number" placeholder="2" />
      </div>

      {/* Furnishing / Lease Term / Available From */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          label="Furnishing"
          field="furnishing"
          options={[
            { value: "Furnished" },
            { value: "Semi-furnished", label: "Semi-furnished" },
            { value: "Unfurnished" },
          ]}
        />
        <FormField
          label="Lease Term (months)"
          field="leaseTerm"
          type="number"
          placeholder="11"
        />
        <FormField
          label="Available From"
          field="available_from"
          type="date"
        />
      </div>

      {/* (Optional) Occupancy / Gender Preference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Occupancy"
          field="occupancy"
          options={[
            { value: "Any" },
            { value: "Family" },
            { value: "Bachelors" },
            { value: "Company Lease" },
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
      </div>

      {/* Amenities (array) */}
      <CheckboxGroupField
        label="Amenities"
        field="amenities"
        options={amenityOptions}
        cols={3}
      />

      {/* Contact Details (writes to sellerInfo.* expected by server & preview/details) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="sellerInfo.name"
            placeholder="Owner / Agent Name"
            required
          />
          <FormField
            label="Contact Email"
            field="sellerInfo.email"
            type="email"
            placeholder="email@example.com"
            required
          />
          <FormField
            label="Contact Phone"
            field="sellerInfo.phone"
            placeholder="+91 9XXXXXXXXX"
            required
          />
        </div>
      </div>

      {/* Location: rely on your global location picker (writes to location.address/lat/lng)
          If you want a simple fallback input, uncomment below and map it to location.address:

      <FormField
        label="Address"
        field="location.address"
        placeholder="City, Area, Pincode"
      />
      */}
    </div>
  );
}
