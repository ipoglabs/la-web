"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function BuyForm() {
  const setField = usePostFormStore((s) => s.setField);

  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const salePrice = usePostFormStore((s) => s.salePrice) ?? "";
  const builtup_area = usePostFormStore((s) => s.builtup_area) ?? "";
  const carpet_area = usePostFormStore((s) => s.carpet_area) ?? "";
  const facilities =
    (usePostFormStore((s) => s.facilities) as string[]) ?? [];

  const facilitiesOptions = useMemo(
    () => ["Parking", "Gym", "Swimming Pool", "Garden"],
    []
  );

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Title */}
      <FormFieldContainer label="Listing Title" htmlFor="name">
        <Input
          id="name"
          name="name"
          placeholder="e.g. 2BHK Apartment in Anna Nagar"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the property…"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
        />
      </FormFieldContainer>

      {/* Price + Areas */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
        <FormFieldContainer label="Sale Price (₹)" htmlFor="salePrice">
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            placeholder="e.g. 6500000"
            value={salePrice as any}
            onChange={(e) => setField("salePrice", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Built-up Area (sq ft)" htmlFor="builtup_area">
          <Input
            id="builtup_area"
            name="builtup_area"
            type="number"
            value={builtup_area as any}
            onChange={(e) => setField("builtup_area", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Carpet Area (sq ft)" htmlFor="carpet_area">
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
        helperLabel="Select all that apply"
      >
        <CheckboxGroupField
          label=""
          field="facilities"
          options={facilitiesOptions}
          cols={3}
        />
      </FormFieldContainer>
    </div>
  );
}
