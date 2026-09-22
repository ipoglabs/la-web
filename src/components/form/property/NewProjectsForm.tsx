"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/components/form/fields/FormFieldContainer";
import { usePropertyConfig } from "@/lib/hooks/usePropertyConfig";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";

export default function NewProjectsForm() {
  const config   = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const name          = usePostFormStore((s) => s.name) ?? "";
  const description   = usePostFormStore((s) => s.description) ?? "";
  const propertyType  = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const developerName = usePostFormStore((s) => (s as any).developerName) ?? "";
  const possessionDate = usePostFormStore((s) => (s as any).possessionDate) ?? "";
  const salePrice     = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const builtup_area  = usePostFormStore((s) => (s as any).builtup_area) ?? "";
  const amenities     = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

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
      <FormFieldContainer label="Adv Title" htmlFor="name" required>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setField("name", sanitizeAdTitle(e.target.value))}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Adv Details" htmlFor="description" required>
        <RichTextEditor
          value={description}
          onChange={(html) => setField("description", html)}
          placeholder="Describe the project…"
        />
      </FormFieldContainer>

      {/* Developer + Possession */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <FormFieldContainer label="Developer Name" htmlFor="developerName">
          <Input
            id="developerName"
            name="developerName"
            value={developerName}
            onChange={(e) => setField("developerName", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Possession Date" htmlFor="possessionDate">
          <Input
            id="possessionDate"
            name="possessionDate"
            type="date"
            value={possessionDate}
            onChange={(e) => setField("possessionDate", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Price + Area */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <FormFieldContainer label={`Starting Price (${currency})`} htmlFor="salePrice">
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
