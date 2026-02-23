"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePostFormStore } from "@/app/post/store/postFormStore";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** ---------- OPTIONS ---------- */

const PROPERTY_TYPES = [
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "showroom", label: "Showroom" },
  { value: "industrial", label: "Industrial" },
  { value: "coworking", label: "Co-working" },
];

const FURNISHING = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi", label: "Semi-furnished" },
  { value: "furnished", label: "Furnished" },
];

const PANTRY = [
  { value: "none", label: "None" },
  { value: "dry", label: "Dry Pantry" },
  { value: "wet", label: "Wet Pantry" },
];

const POWER_BACKUP = [
  { value: "none", label: "None" },
  { value: "partial", label: "Partial" },
  { value: "full", label: "Full" },
];

export default function CommercialForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = usePostFormStore((s) => s.setField);

  /** ---------- STORE ---------- */
  const store = usePostFormStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  /** ---------- OPTIONS ---------- */

  const facilitiesOptions = useMemo(
    () => [
      "Parking",
      "Lift",
      "Power Backup",
      "Security/CCTV",
      "Fire Safety",
      "Visitor Parking",
    ],
    []
  );

  const amenitiesOptions = useMemo(
    () => [
      "WiFi",
      "Air Conditioning",
      "Cafeteria",
      "Conference Room",
      "Reception",
      "24x7 Access",
    ],
    []
  );

  /** ---------- HELPERS ---------- */

  const setAndClear = (key: string, value: any) => {
    setField(key, value);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const isPositive = (v: any) => Number(v) > 0;
  const isNonNegative = (v: any) => Number(v) >= 0;

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el = formRef.current?.querySelector(`[name="${first}"]`);
    (el as HTMLElement)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /** ---------- SUBMIT ---------- */

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!store.name) mapped.name = "Title required";
    if (!store.description) mapped.description = "Description required";
    if (!store.propertyType) mapped.propertyType = "Select property type";
    if (!isPositive(store.rentPrice)) mapped.rentPrice = "Invalid rent";

    if (store.deposit && !isNonNegative(store.deposit))
      mapped.deposit = "Invalid deposit";

    if (store.maintenance && !isNonNegative(store.maintenance))
      mapped.maintenance = "Invalid maintenance";

    if (Object.keys(mapped).length > 0) {
      setErrors(mapped);
      scrollToFirstError(mapped);
      toast.error("Fix highlighted fields");
      return;
    }

    setErrors({});
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok: true } }));
  };

  /** ---------- UI ---------- */

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">

      {/* Title */}
      <FormFieldContainer label="Title" error={errors.name}>
        <Input
          name="name"
          value={store.name || ""}
          onChange={(e) => setAndClear("name", e.target.value)}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" error={errors.description}>
        <Textarea
          name="description"
          value={store.description || ""}
          onChange={(e) => setAndClear("description", e.target.value)}
        />
      </FormFieldContainer>

      {/* Property Type */}
      <FormFieldContainer label="Property Type" error={errors.propertyType}>
        <select
          name="propertyType"
          value={store.propertyType || ""}
          onChange={(e) => setAndClear("propertyType", e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select</option>
          {PROPERTY_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormFieldContainer>

      {/* Rent */}
      <FormFieldContainer label="Rent (₹)" error={errors.rentPrice}>
        <Input
          type="number"
          name="rentPrice"
          value={store.rentPrice || ""}
          onChange={(e) => setAndClear("rentPrice", e.target.value)}
        />
      </FormFieldContainer>

      {/* Deposit / Maintenance */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Deposit">
          <Input
            type="number"
            value={store.deposit || ""}
            onChange={(e) => setAndClear("deposit", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Maintenance">
          <Input
            type="number"
            value={store.maintenance || ""}
            onChange={(e) => setAndClear("maintenance", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Areas */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Built-up Area">
        <Input
          placeholder="Built-up Area"
          value={store.builtup_area || ""}
          onChange={(e) => setAndClear("builtup_area", e.target.value)}
        /></FormFieldContainer>
        <FormFieldContainer label="Carpet Area">
        <Input
          placeholder="Carpet Area"
          value={store.carpet_area || ""}
          onChange={(e) => setAndClear("carpet_area", e.target.value)}
        /></FormFieldContainer>
      </FormFieldWrapper>

      {/* Facilities */}
      <FormFieldContainer label="Facilities">
        <CheckboxGroupField
          field="facilities"
          options={facilitiesOptions}
          cols={3}
        />
      </FormFieldContainer>

      {/* ✅ NEW: Amenities */}
      <FormFieldContainer label="Amenities">
        <CheckboxGroupField
          field="amenities"
          options={amenitiesOptions}
          cols={3}
        />
      </FormFieldContainer>

      <button type="submit" className="hidden" />
    </form>
  );
}
