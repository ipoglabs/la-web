// src/app/components/form/pets/LostFoundForm.tsx
"use client";

import { useEffect } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PetLostFoundForm() {
  const setField = usePostFormStore((s) => s.setField);

  // Controlled values from the store
  const subcategory = usePostFormStore((s) => s.subcategory); // keep as "Lost & Found"
  const name = usePostFormStore((s) => s.name);
  const description = usePostFormStore((s) => s.description);
  const location = usePostFormStore((s) => s.location);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  // Pet-specific
  const reportType = usePostFormStore((s) => (s as any).reportType); // "lost" | "found"
  const petType = usePostFormStore((s) => (s as any).petType);
  const breed = usePostFormStore((s) => (s as any).breed);
  const color = usePostFormStore((s) => (s as any).color);
  const age = usePostFormStore((s) => (s as any).age);
  const lastSeenDate = usePostFormStore((s) => (s as any).lastSeenDate);

  // Ensure category/subcategory are set for this form
  useEffect(() => {
    setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Lost & Found");
    if (!reportType) setField("reportType", "lost");
  }, [setField, subcategory, reportType]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Pet Lost &amp; Found</h2>

      {/* Report Type + Subcategory (fixed to Lost & Found) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Report Type"
          field="reportType"
          value={reportType ?? "lost"}
          onChange={(v) => setField("reportType", v)}
          options={[
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ]}
          required
        />
        <SelectField
          label="Post Type"
          field="subcategory"
          value={subcategory ?? "Lost & Found"}
          onChange={(v) => setField("subcategory", v)}
          options={[{ value: "Lost & Found", label: "Lost & Found" }]}
          required
        />
      </div>

      {/* Title / Description */}
      <FormField
        label="Title"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder='e.g. "Lost Golden Retriever near City Park"'
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Special markings, collar details, microchip, behavior…"
      />

      {/* Pet details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Pet Type"
          field="petType"
          value={petType ?? ""}
          onChange={(v) => setField("petType", v)}
          placeholder="Dog / Cat / Bird…"
          required
        />
        <FormField
          label="Breed"
          field="breed"
          value={breed ?? ""}
          onChange={(v) => setField("breed", v)}
          placeholder="Breed (if known)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Color"
          field="color"
          value={color ?? ""}
          onChange={(v) => setField("color", v)}
          placeholder="e.g. Brown with white patch"
        />
        <FormField
          label="Age"
          field="age"
          value={age ?? ""}
          onChange={(v) => setField("age", v)}
          placeholder="e.g. ~2 years"
        />
      </div>

      {/* When & Where */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Last Seen / Found Date"
          field="lastSeenDate"
          type="date"
          value={lastSeenDate ?? ""}
          onChange={(v) => setField("lastSeenDate", v)}
        />
        <FormField
          label="Location"
          field="location.address"
          value={location?.address ?? ""}
          onChange={(v) => setField("location", { ...(location || {}), address: v })}
          placeholder="Street / Area, City"
          required
        />
      </div>

      {/* Contact Details (nested sellerInfo like the rest of the app) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
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
            label="Phone Number"
            field="sellerInfo.phone"
            type="tel"
            value={sellerInfo?.phone ?? ""}
            onChange={(v) => setField("sellerInfo", { ...sellerInfo, phone: v })}
            placeholder="Phone number"
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
        </div>
      </div>

      {/* Images: use your shared uploader (writes to `images` in the store) */}
    </div>
  );
}
