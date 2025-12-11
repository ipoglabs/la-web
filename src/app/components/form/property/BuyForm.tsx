// /src/app/components/form/property/BuyForm.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { cn as cx } from "@/lib/utils";
import { toast } from "sonner";

export default function BuyForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const salePrice = usePostFormStore((s) => s.salePrice) ?? "";
  const builtup_area = usePostFormStore((s) => s.builtup_area) ?? "";
  const carpet_area = usePostFormStore((s) => s.carpet_area) ?? "";
  const facilities = (usePostFormStore((s) => s.facilities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const facilitiesOptions = useMemo(
    () => ["Parking", "Gym", "Swimming Pool", "Garden"],
    []
  );

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  // let parent page know validation status
  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("buyform:validated", { detail: { ok } })
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    // basic ad validations
    if (!name.trim()) mapped.name = "Listing title is required.";
    if (!isPositive(salePrice))
      mapped.salePrice = "Please enter a valid sale price greater than 0.";

    if (String(builtup_area).trim() && !isPositive(builtup_area)) {
      mapped.builtup_area = "Built-up area must be a positive number.";
    }

    if (String(carpet_area).trim() && !isPositive(carpet_area)) {
      mapped.carpet_area = "Carpet area must be a positive number.";
    }

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    dispatchValidated(true);
  };

  return (
    <form
      id="buyForm"
      onSubmit={onSubmit}
      ref={formRef}
      className="w-full max-w-xl space-y-6"
    >
      {/* Basic Info */}
      <FormFieldContainer label="Listing Title" htmlFor="name" error={errors.name} showFocusWithin={false}>
        <Input
          id="name"
          name="name"
          placeholder="e.g. 2BHK Apartment in Anna Nagar"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          className={cx(
            !!errors.name && "border-red-500 focus-visible:ring-red-500/20"
          )}
        />
      </FormFieldContainer>

      <FormFieldContainer
        label="Description"
        htmlFor="description"
        error={errors.description}
        showFocusWithin={false}
      >
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the property…"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          className={cx(
            !!errors.description && "border-red-500 focus-visible:ring-red-500/20"
          )}
        />
      </FormFieldContainer>

      {/* Pricing & Area */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4" showFocusWithin={false}>
        <FormFieldContainer
          label="Sale Price (₹)"
          htmlFor="salePrice"
          error={errors.salePrice}
          showFocusWithin={false}
        >
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            placeholder="e.g. 6500000"
            value={salePrice as any}
            onChange={(e) => setField("salePrice", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Built-up Area (sq ft)"
          htmlFor="builtup_area"
          error={errors.builtup_area}
          showFocusWithin={false}
        >
          <Input
            id="builtup_area"
            name="builtup_area"
            type="number"
            value={builtup_area as any}
            onChange={(e) => setField("builtup_area", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer
          label="Carpet Area (sq ft)"
          htmlFor="carpet_area"
          error={errors.carpet_area}
          showFocusWithin={false}
        >
          <Input
            id="carpet_area"
            name="carpet_area"
            type="number"
            value={carpet_area as any}
            onChange={(e) => setField("carpet_area", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Facilities */}
      <FormFieldContainer
        label="Facilities"
        htmlFor="facilities"
        helperLabel="Select all that apply"
        showFocusWithin={false}
      >
        <CheckboxGroupField
          label=""
          field="facilities"
          options={facilitiesOptions}
          cols={3}
        />
      </FormFieldContainer>

      {/* Hidden submit so requestSubmit works */}
      <button type="submit" className="sr-only" aria-hidden />
    </form>
  );
}
