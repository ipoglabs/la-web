// src/app/components/form/pets/PetsForm.tsx
"use client";

import { useEffect, useMemo } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PetsForm() {
  const setField = usePostFormStore((s) => s.setField);

  // Optional: preset top-level category
  useEffect(() => {
    setField("category", "Pets");
  }, [setField]);

  // Controlled values from the store
  const subcategory = usePostFormStore((s) => s.subcategory); // "For Sale" | "Adoption" | etc.
  const name = usePostFormStore((s) => s.name);               // Pet / listing title
  const description = usePostFormStore((s) => s.description);

  const petType = usePostFormStore((s) => (s as any).petType);
  const breed = usePostFormStore((s) => (s as any).breed);
  const age = usePostFormStore((s) => (s as any).age);
  const gender = usePostFormStore((s) => (s as any).gender);
  const size = usePostFormStore((s) => (s as any).size);
  const vaccination = usePostFormStore((s) => (s as any).vaccination);

  // Use salePrice for price/adoption fee to reuse currency formatting everywhere
  const salePrice = usePostFormStore((s) => s.salePrice);

  const location = usePostFormStore((s) => s.location);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  // Label changes if user selects Adoption
  const priceLabel = useMemo(
    () => (String(subcategory).toLowerCase().includes("adopt") ? "Adoption Fee (₹)" : "Price (₹)"),
    [subcategory]
  );

  const petTypeOptions = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "fish", label: "Fish" },
    { value: "other", label: "Other" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const sizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const vaccinationOptions = [
    { value: "vaccinated", label: "Vaccinated" },
    { value: "partially_vaccinated", label: "Partially Vaccinated" },
    { value: "not_vaccinated", label: "Not Vaccinated" },
  ];

  const petSubcategoryOptions = [
    { value: "For Sale", label: "For Sale" },
    { value: "Adoption", label: "Adoption" },
    { value: "Mating", label: "Mating" },
    { value: "Lost & Found", label: "Lost & Found" },
    { value: "Accessories", label: "Accessories" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post a Pet</h2>

      {/* Subcategory (let this be controlled here; parent can also set it) */}
      <SelectField
        label="Post Type"
        field="subcategory"
        value={subcategory ?? ""}
        onChange={(v) => setField("subcategory", v)}
        options={petSubcategoryOptions}
        required
      />

      {/* Title / Description */}
      <FormField
        label="Title"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Friendly Labrador Puppy"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Temperament, health, diet, special needs, etc."
      />

      {/* Pet Basics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Pet Type"
          field="petType"
          value={petType ?? ""}
          onChange={(v) => setField("petType", v)}
          options={petTypeOptions}
          required
        />
        <FormField
          label="Breed"
          field="breed"
          value={breed ?? ""}
          onChange={(v) => setField("breed", v)}
          placeholder="e.g. Labrador / Persian / Macaw"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Age"
          field="age"
          value={age ?? ""}
          onChange={(v) => setField("age", v)}
          placeholder="e.g. 2 years"
        />
        <SelectField
          label="Gender"
          field="gender"
          value={gender ?? ""}
          onChange={(v) => setField("gender", v)}
          options={genderOptions}
        />
        <SelectField
          label="Size"
          field="size"
          value={size ?? ""}
          onChange={(v) => setField("size", v)}
          options={sizeOptions}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Vaccination Status"
          field="vaccination"
          value={vaccination ?? ""}
          onChange={(v) => setField("vaccination", v)}
          options={vaccinationOptions}
        />
        <FormField
          label={priceLabel}
          field="salePrice"
          type="number"
          value={salePrice ?? ""}
          onChange={(v) => setField("salePrice", v)}
          placeholder="Enter amount or leave blank"
        />
      </div>

      {/* Location (works with your global map picker; this is a simple fallback input) */}
      <FormField
        label="Location"
        field="location.address"
        value={location?.address ?? ""}
        onChange={(v) => setField("location", { ...(location || {}), address: v })}
        placeholder="City, State"
        required
      />

      {/* Contact Details (nested sellerInfo) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="sellerInfo.name"
            value={sellerInfo?.name ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, name: v })}
            placeholder="Owner / Foster Name"
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

      {/* Images: keep using your shared uploader that writes to `images` in the store */}
    </div>
  );
}
