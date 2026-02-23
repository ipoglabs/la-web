"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { toast } from "sonner";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const PROPERTY_TYPES = [
  { value: "Apartment", label: "Apartment" },
  { value: "IndependentHouse", label: "Independent House" },
  { value: "Villa", label: "Villa" },
  { value: "Studio", label: "Studio" },
  { value: "Other", label: "Other" },
];

const FURNISHING = [
  { value: "Furnished", label: "Furnished" },
  { value: "Semi-furnished", label: "Semi-furnished" },
  { value: "Unfurnished", label: "Unfurnished" },
];

export default function RentPropertyForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";

  const rentPrice = usePostFormStore((s) => (s as any).rentPrice) ?? "";
  const deposit = usePostFormStore((s) => (s as any).deposit) ?? "";
  const maintenance = usePostFormStore((s) => (s as any).maintenance) ?? "";

  const beds = usePostFormStore((s) => (s as any).beds) ?? "";
  const baths = usePostFormStore((s) => (s as any).baths) ?? "";

  const furnishing = usePostFormStore((s) => (s as any).furnishing) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";

  const leaseTerm = usePostFormStore((s) => (s as any).leaseTerm) ?? "";
  const available_from = usePostFormStore((s) => (s as any).available_from) ?? "";

  const amenities =
    (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amenityOptions = useMemo(
    () => [
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
    ],
    []
  );

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const isNonNegative = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
    window.dispatchEvent(
      new CustomEvent("rentpropertyform:validated", { detail: { ok } })
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

    const title = name.trim();
    const desc = description.trim();

    const mapped: Record<string, string> = {};

    if (!title) mapped.name = "Please enter a listing title.";
    if (!desc) mapped.description = "Please add description.";
    if (!propertyType) mapped.propertyType = "Select property type.";
    if (!isPositive(rentPrice))
      mapped.rentPrice = "Rent must be greater than 0.";

    if (deposit && !isNonNegative(deposit))
      mapped.deposit = "Deposit must be 0 or more.";

    if (maintenance && !isNonNegative(maintenance))
      mapped.maintenance = "Maintenance must be 0 or more.";

    if (beds && !isPositive(beds))
      mapped.beds = "Beds must be greater than 0.";

    if (baths && !isPositive(baths))
      mapped.baths = "Baths must be greater than 0.";

    if (leaseTerm && !isPositive(leaseTerm))
      mapped.leaseTerm = "Lease term must be greater than 0.";

    if (Object.keys(mapped).length > 0) {
      setErrors(mapped);
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", title);
    setField("description", desc);

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="rentPropertyForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      {/* Title */}
      <FormFieldContainer label="Listing Title" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          className={cx(errors.name && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" htmlFor="description" error={errors.description}>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </FormFieldContainer>

      {/* Property Type */}
      <FormFieldContainer label="Property Type" htmlFor="propertyType" error={errors.propertyType}>
        <select
          id="propertyType"
          name="propertyType"
          value={propertyType}
          onChange={(e) => setField("propertyType", e.target.value)}
          className="w-full border px-3 py-2 rounded"
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
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormFieldContainer label="Rent (₹)" htmlFor="rentPrice" error={errors.rentPrice}>
          <Input
            id="rentPrice"
            name="rentPrice"
            type="number"
            value={rentPrice as any}
            onChange={(e) => setField("rentPrice", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Deposit" htmlFor="deposit">
          <Input
            id="deposit"
            name="deposit"
            type="number"
            value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Maintenance" htmlFor="maintenance">
          <Input
            id="maintenance"
            name="maintenance"
            type="number"
            value={maintenance as any}
            onChange={(e) => setField("maintenance", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Beds/Baths */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Beds" htmlFor="beds">
          <Input
            id="beds"
            name="beds"
            type="number"
            value={beds as any}
            onChange={(e) => setField("beds", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Baths" htmlFor="baths">
          <Input
            id="baths"
            name="baths"
            type="number"
            value={baths as any}
            onChange={(e) => setField("baths", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Amenities */}
      <FormFieldContainer label="Amenities">
        <CheckboxGroupField field="amenities" options={amenityOptions} cols={3} />
      </FormFieldContainer>

      <button type="submit" className="sr-only" />
    </form>
  );
}
