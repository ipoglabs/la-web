// src/app/components/form/pets/PetAdoptionForm.tsx
"use client";

import { useEffect, useMemo } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PetAdoptionForm() {
  const setField = usePostFormStore((s) => s.setField);

  // Optional: preset category/subcategory for this form
  useEffect(() => {
    setField("category", "Pets");
    setField("subcategory", "Adoption");
  }, [setField]);

  // read from store (controlled)
  const name = usePostFormStore((s) => s.name); // Pet name as "Title"
  const description = usePostFormStore((s) => s.description);

  const petType = usePostFormStore((s) => (s as any).petType);
  const breed = usePostFormStore((s) => (s as any).breed);
  const age = usePostFormStore((s) => (s as any).age);
  const gender = usePostFormStore((s) => (s as any).gender);
  const vaccination = usePostFormStore((s) => (s as any).vaccination);

  // Use salePrice for “Adoption Fee” to reuse currency formatting & preview
  const salePrice = usePostFormStore((s) => s.salePrice);

  const location = usePostFormStore((s) => s.location);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  const petTypeOptions = useMemo(
    () => [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "bird", label: "Bird" },
      { value: "rabbit", label: "Rabbit" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const genderOptions = useMemo(
    () => [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    []
  );

  const vaccinationOptions = useMemo(
    () => [
      { value: "vaccinated", label: "Vaccinated" },
      { value: "partially_vaccinated", label: "Partially Vaccinated" },
      { value: "not_vaccinated", label: "Not Vaccinated" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post Pet for Adoption</h2>

      {/* Title (Pet Name) */}
      <FormField
        label="Pet Name"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Bella"
        required
      />

      {/* Type / Breed */}
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
          placeholder="e.g. Labrador / Persian"
        />
      </div>

      {/* Age / Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Vaccination / Adoption Fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Vaccination Status"
          field="vaccination"
          value={vaccination ?? ""}
          onChange={(v) => setField("vaccination", v)}
          options={vaccinationOptions}
        />
        <FormField
          label="Adoption Fee (₹)"
          field="salePrice"
          type="number"
          value={salePrice ?? ""}
          onChange={(v) => setField("salePrice", v)}
          placeholder="Enter fee or leave blank"
        />
      </div>

      {/* Description */}
      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Behavior, health, special needs, etc."
      />

      {/* Location (works with your global map picker; this is a simple fallback) */}
      <FormField
        label="Location"
        field="location.address"
        value={location?.address ?? ""}
        onChange={(v) =>
          setField("location", { ...(location || {}), address: v })
        }
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

      {/* Images: rely on your shared uploader elsewhere that writes to `images` */}
      {/* If you need a quick input here, add a component that sets `images` in the store. */}
    </div>
  );
}
