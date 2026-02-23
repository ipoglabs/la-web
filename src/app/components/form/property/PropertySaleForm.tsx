//PropertySaleForm.tsx

"use client";

import React, { useRef, useState } from "react";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { toast } from "sonner";

export default function PropertySaleForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";

  const plot_area = usePostFormStore((s) => (s as any).plot_area) ?? "";
  const salePrice = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const negotiable = usePostFormStore((s) => (s as any).negotiable) ?? "";
  const ownership = usePostFormStore((s) => (s as any).ownership) ?? "";
  const preferred_locations =
    (usePostFormStore((s) => (s as any).preferred_locations) ?? []) as string[];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amenitiesOptions = [
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

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
    window.dispatchEvent(
      new CustomEvent("propertysaleform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    const title = name.trim();
    const desc = description.trim();

    if (!title) mapped.name = "Listing title is required.";
    if (!desc) mapped.description = "Description is required.";

    if (!isPositive(salePrice))
      mapped.salePrice = "Price must be greater than 0.";

    if (plot_area && !isPositive(plot_area))
      mapped.plot_area = "Plot area must be positive.";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    // ✅ persist cleaned values
    setField("name", title);
    setField("description", desc);

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="propertySaleForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">
        Add Property for Sale
      </h2>

      {/* Property Type */}
      <SelectField
        label="Property Type"
        field="propertyType"
        options={[
          { value: "Apartment" },
          { value: "IndependentHouse", label: "Independent House" },
          { value: "Villa" },
          { value: "Plot", label: "Plot / Land" },
          { value: "Commercial" },
          { value: "Other" },
        ]}
        required
      />

      {/* Basic */}
      <FormField
        label="Listing Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Pricing */}
      <FormField
        label="Expected Price (₹)"
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => setField("salePrice", v)}
        required
      />

      <SelectField
        label="Negotiable"
        field="negotiable"
        options={[{ value: "Yes" }, { value: "No" }]}
      />

      {/* Plot */}
      <FormField
        label="Plot Area (sq ft)"
        field="plot_area"
        type="number"
        value={plot_area}
        onChange={(v) => setField("plot_area", v)}
      />

      {/* Ownership */}
      <SelectField
        label="Ownership"
        field="ownership"
        options={[
          { value: "Freehold" },
          { value: "Leasehold" },
          { value: "PowerOfAttorney", label: "Power of Attorney" },
        ]}
      />

      {/* Preferred Locations */}
      <CheckboxGroupField
        label="Preferred Locations"
        field="preferred_locations"
        options={[
          "Anna Nagar",
          "Velachery",
          "T Nagar",
          "OMR",
          "Porur",
        ]}
        cols={2}
      />

      {/* Amenities */}
      <CheckboxGroupField
        label="Amenities"
        field="amenities"
        options={amenitiesOptions}
        cols={3}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}
