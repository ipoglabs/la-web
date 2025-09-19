// src/app/components/form/pets/PetServiceForm.tsx
"use client";

import { useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PetServiceForm() {
  const setField = usePostFormStore((s) => s.setField);

  // read controlled values
  const category     = usePostFormStore((s) => s.category);
  const subcategory  = usePostFormStore((s) => s.subcategory);
  const name         = usePostFormStore((s) => s.name);
  const description  = usePostFormStore((s) => s.description);
  const salePrice    = usePostFormStore((s) => s.salePrice);
  const location     = usePostFormStore((s) => s.location);
  const sellerInfo   = usePostFormStore((s) => s.sellerInfo);

  // service-specific (stored in the same post store so Preview can show them)
  const serviceType  = usePostFormStore((s) => (s as any).serviceType);
  const petType      = usePostFormStore((s) => (s as any).petType);
  const experience   = usePostFormStore((s) => (s as any).experience);
  const availability = usePostFormStore((s) => (s as any).availability);
  const providerName = usePostFormStore((s) => (s as any).serviceProviderName);

  // ensure cat/subcat
  useEffect(() => {
    if (!category) setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Services");
  }, [category, subcategory, setField]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post a Pet Service</h2>

      {/* Category/Subcategory (hidden presets via effect). If you want visible selects, add them here. */}

      {/* Title / Description */}
      <FormField
        label="Service Title"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Dog Grooming at Home"
        required
      />
      <FormField
        label="Service Description"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Describe what’s included, duration, specialties…"
      />

      {/* Service Type / Pet Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Service Type"
          field="serviceType"
          value={serviceType ?? ""}
          onChange={(v) => setField("serviceType", v)}
          options={[
            { value: "grooming", label: "Grooming" },
            { value: "training", label: "Training" },
            { value: "boarding", label: "Boarding" },
            { value: "walking",  label: "Walking" },
            { value: "vet",      label: "Veterinary" },
            { value: "other",    label: "Other" },
          ]}
          required
        />
        <SelectField
          label="Pet Type"
          field="petType"
          value={petType ?? ""}
          onChange={(v) => setField("petType", v)}
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "rabbit", label: "Rabbit" },
            { value: "other", label: "Other" },
          ]}
          required
        />
      </div>

      {/* Provider name / Experience / Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Service Provider Name"
          field="serviceProviderName"
          value={providerName ?? ""}
          onChange={(v) => setField("serviceProviderName", v)}
          placeholder="Your/Business name"
        />
        <FormField
          label="Experience (years)"
          field="experience"
          type="number"
          value={experience ?? ""}
          onChange={(v) => setField("experience", v)}
          placeholder="e.g. 3"
        />
        <FormField
          label="Availability"
          field="availability"
          value={availability ?? ""}
          onChange={(v) => setField("availability", v)}
          placeholder="e.g. Weekdays 9am–6pm"
        />
      </div>

      {/* Price (store as salePrice so it renders nicely as currency) / Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Price (per session / hour) ₹"
          field="salePrice"
          type="number"
          value={salePrice ?? ""}
          onChange={(v) => setField("salePrice", v)}
          placeholder="e.g. 800"
        />
        <FormField
          label="Location"
          field="location.address"
          value={location?.address ?? ""}
          onChange={(v) => setField("location", { ...(location || {}), address: v })}
          placeholder="Area / City"
          required
        />
      </div>

      {/* Contact Details (nested sellerInfo used across the app) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="sellerInfo.name"
            value={sellerInfo?.name ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, name: v })}
            placeholder="Your name"
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

      {/* Images: use your shared uploader (writes to `images` in store) */}
    </div>
  );
}
