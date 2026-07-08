"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { usePropertyConfig } from "@/hooks/usePropertyConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";

export default function BuyForm() {
  const config   = usePropertyConfig();
  const { currency } = useCountryConfig();
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const salePrice   = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const builtup_area = usePostFormStore((s) => (s as any).builtup_area) ?? "";
  const carpet_area  = usePostFormStore((s) => (s as any).carpet_area) ?? "";
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  return (
    <div className="w-full max-w-xl space-y-6">

      {/* Property Type */}
      <ToggleButtonGroup
        title="Property Type"
        singleSelect
        value={propertyType ? [propertyType] : []}
        onChange={(v) => setField("propertyType", v[0] ?? "")}
      >
        {config.buy.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Title */}
      <FormFieldContainer label="Listing Title" htmlFor="name">
        <Input
          id="name"
          name="name"
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
        <FormFieldContainer label={`Sale Price (${currency})`} htmlFor="salePrice">
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            value={salePrice as any}
            onChange={(e) => setField("salePrice", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label={`Built-up Area (${config.areaUnit})`} htmlFor="builtup_area">
          <Input
            id="builtup_area"
            name="builtup_area"
            type="number"
            value={builtup_area as any}
            onChange={(e) => setField("builtup_area", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label={`Carpet Area (${config.areaUnit})`} htmlFor="carpet_area">
          <Input
            id="carpet_area"
            name="carpet_area"
            type="number"
            value={carpet_area as any}
            onChange={(e) => setField("carpet_area", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.buy.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
