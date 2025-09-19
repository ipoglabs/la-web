// src/app/components/form/pets/PetWantedForm.tsx
"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PetWantedForm() {
  const setField = usePostFormStore((s) => s.setField);

  // core controlled values
  const category     = usePostFormStore((s) => s.category);
  const subcategory  = usePostFormStore((s) => s.subcategory);
  const name         = usePostFormStore((s) => s.name);
  const description  = usePostFormStore((s) => s.description);
  const budgetAmount = usePostFormStore((s) => (s as any).budgetAmount);
  const location     = usePostFormStore((s) => s.location);
  const sellerInfo   = usePostFormStore((s) => s.sellerInfo);

  // wanted-specific fields
  const wantedPetType     = usePostFormStore((s) => (s as any).wantedPetType);
  const breedPreference   = usePostFormStore((s) => (s as any).breedPreference);
  const agePreference     = usePostFormStore((s) => (s as any).agePreference);
  const genderPreference  = usePostFormStore((s) => (s as any).genderPreference);
  const sizePreference    = usePostFormStore((s) => (s as any).sizePreference);
  const preferredLocations= usePostFormStore((s) => (s as any).preferred_locations);

  // preset cat/subcat once
  useEffect(() => {
    if (!category) setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Wanted");
  }, [category, subcategory, setField]);

  // local text ↔ array for preferred_locations
  const [locationsText, setLocationsText] = useState(
    Array.isArray(preferredLocations) ? preferredLocations.join(", ") : ""
  );
  const commitPreferredLocations = () => {
    const arr = locationsText.split(",").map(s => s.trim()).filter(Boolean);
    setField("preferred_locations", arr);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">🐾 Pet Wanted</h2>

      {/* Title / Description */}
      <FormField
        label="Title"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Looking for a Labrador puppy"
        required
      />
      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Temperament, apartment friendly, good with kids, etc."
      />

      {/* Wanted specifics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Type of Pet Wanted"
          field="wantedPetType"
          value={wantedPetType ?? ""}
          onChange={(v) => setField("wantedPetType", v)}
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "rabbit", label: "Rabbit" },
            { value: "others", label: "Others" },
          ]}
          required
        />
        <FormField
          label="Breed Preference"
          field="breedPreference"
          value={breedPreference ?? ""}
          onChange={(v) => setField("breedPreference", v)}
          placeholder="e.g. Labrador, Persian, Indie"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Preferred Age"
          field="agePreference"
          value={agePreference ?? ""}
          onChange={(v) => setField("agePreference", v)}
          placeholder="Puppy/Kitten, 1–2 years, Senior"
        />
        <SelectField
          label="Gender Preference"
          field="genderPreference"
          value={genderPreference ?? ""}
          onChange={(v) => setField("genderPreference", v)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "any", label: "Any" },
          ]}
        />
        <SelectField
          label="Size Preference"
          field="sizePreference"
          value={sizePreference ?? ""}
          onChange={(v) => setField("sizePreference", v)}
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "any", label: "Any" },
          ]}
        />
      </div>

      {/* Locations / Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Preferred Locations</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Comma-separated: Anna Nagar, T Nagar"
            value={locationsText}
            onChange={(e) => setLocationsText(e.target.value)}
            onBlur={commitPreferredLocations}
          />
          <p className="text-xs text-gray-500">Saved as a list for filtering.</p>
        </div>
        <FormField
          label="Budget (₹, optional)"
          field="budgetAmount"
          type="number"
          value={budgetAmount ?? ""}
          onChange={(v) => setField("budgetAmount", v)}
          placeholder="Max budget"
        />
      </div>

      {/* Location (single primary address to match your model) */}
      <FormField
        label="Primary Location"
        field="location.address"
        value={location?.address ?? ""}
        onChange={(v) => setField("location", { ...(location || {}), address: v })}
        placeholder="City / Area"
      />

      {/* Contact Details */}
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
            label="Phone"
            field="sellerInfo.phone"
            type="tel"
            value={sellerInfo?.phone ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, phone: v })}
            placeholder="+91 9XXXXXXXXX"
            required
          />
          <FormField
            label="Email"
            field="sellerInfo.email"
            type="email"
            value={sellerInfo?.email ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, email: v })}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      {/* Images not required for Wanted posts; your shared uploader can still be used if desired */}
    </div>
  );
}
