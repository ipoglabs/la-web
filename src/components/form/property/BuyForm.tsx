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

const FACILITY_OPTIONS = ["Lift", "Security", "Power Backup", "Water Supply", "Fire Safety"];
const NEGOTIABLE_OPTIONS = ["Yes", "No"];

export default function BuyForm() {
  const config   = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const salePrice   = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const builtup_area = usePostFormStore((s) => (s as any).builtup_area) ?? "";
  const carpet_area  = usePostFormStore((s) => (s as any).carpet_area) ?? "";
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];
  const beds         = usePostFormStore((s) => (s as any).beds) ?? "";
  const baths        = usePostFormStore((s) => (s as any).baths) ?? "";
  const facilities   = (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];
  const negotiable   = usePostFormStore((s) => (s as any).negotiable) ?? "";
  const ownership    = usePostFormStore((s) => (s as any).ownership) ?? "";
  const age          = usePostFormStore((s) => (s as any).age) ?? "";

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
          placeholder="Describe the property…"
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

      {/* Beds / Baths / Age */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
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

        <FormFieldContainer label="Property Age" htmlFor="age">
          <Input
            id="age"
            name="age"
            placeholder="e.g. 5 years / New Construction"
            value={age}
            onChange={(e) => setField("age", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Negotiable / Ownership */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <ToggleButtonGroup
          title="Negotiable"
          singleSelect
          value={negotiable ? [negotiable] : []}
          onChange={(v) => setField("negotiable", v[0] ?? "")}
        >
          {NEGOTIABLE_OPTIONS.map((o) => (
            <ToggleGroupButton key={o} value={o}>{o}</ToggleGroupButton>
          ))}
        </ToggleButtonGroup>

        <ToggleButtonGroup
          title="Ownership"
          singleSelect
          value={ownership ? [ownership] : []}
          onChange={(v) => setField("ownership", v[0] ?? "")}
        >
          {config.sale.ownershipTypes.map((o) => (
            <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
          ))}
        </ToggleButtonGroup>
      </FormFieldWrapper>

      {/* Facilities */}
      <ToggleButtonGroup
        title="Facilities"
        value={facilities}
        onChange={(v) => setField("facilities", v)}
      >
        {FACILITY_OPTIONS.map((f) => (
          <ToggleGroupButton key={f} value={f}>{f}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

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
