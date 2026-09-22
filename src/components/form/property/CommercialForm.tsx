"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { usePropertyConfig } from "@/lib/hooks/usePropertyConfig";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const YES_NO_OPTIONS = ["Yes", "No"];

export default function CommercialForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const rentPrice   = usePostFormStore((s) => (s as any).rentPrice) ?? "";
  const deposit     = usePostFormStore((s) => (s as any).deposit) ?? "";
  const maintenance = usePostFormStore((s) => (s as any).maintenance) ?? "";
  const builtup_area = usePostFormStore((s) => (s as any).builtup_area) ?? "";
  const carpet_area  = usePostFormStore((s) => (s as any).carpet_area) ?? "";
  const facilities   = (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];
  const floor          = usePostFormStore((s) => (s as any).floor) ?? "";
  const totalFloors    = usePostFormStore((s) => (s as any).totalFloors) ?? "";
  const furnishing     = usePostFormStore((s) => (s as any).furnishing) ?? "";
  const washrooms      = usePostFormStore((s) => (s as any).washrooms) ?? "";
  const pantry         = usePostFormStore((s) => (s as any).pantry) ?? "";
  const parkingSpaces  = usePostFormStore((s) => (s as any).parkingSpaces) ?? "";
  const available_from = usePostFormStore((s) => (s as any).available_from) ?? "";
  const leaseTerm      = usePostFormStore((s) => (s as any).leaseTerm) ?? "";
  const powerBackup    = usePostFormStore((s) => (s as any).powerBackup) ?? "";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive    = (v: unknown) => Number.isFinite(Number(v)) && Number(v) > 0;
  const isNonNegative = (v: unknown) => Number.isFinite(Number(v)) && Number(v) >= 0;

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("commercialform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())        mapped.name        = "Title is required.";
    if (!description.trim()) mapped.description = "Description is required.";
    if (!propertyType)       mapped.propertyType = "Select property type.";
    if (!isPositive(rentPrice)) mapped.rentPrice = "Rent must be greater than 0.";
    if (deposit     && !isNonNegative(deposit))     mapped.deposit     = "Deposit must be 0 or more.";
    if (maintenance && !isNonNegative(maintenance)) mapped.maintenance = "Maintenance must be 0 or more.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="commercialForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Add Commercial Property</h2>

      {/* Title */}
      <FormFieldContainer label="Adv Title" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setField("name", sanitizeAdTitle(e.target.value))}
          className={cx(errors.name && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Adv Details" htmlFor="description" error={errors.description} required>
        <RichTextEditor
          value={description}
          onChange={(html) => setField("description", html)}
          className={cx(errors.description && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Property Type */}
      <ToggleButtonGroup
        title="Property Type"
        isMandatory
        singleSelect
        showError={!!errors.propertyType}
        errorMessage={errors.propertyType}
        value={propertyType ? [propertyType] : []}
        onChange={(v) => setField("propertyType", v[0] ?? "")}
      >
        {config.commercial.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Rent */}
      <FormFieldContainer label={`Rent (${currency})`} htmlFor="rentPrice" error={errors.rentPrice}>
        <Input
          id="rentPrice"
          name="rentPrice"
          type="number"
          value={rentPrice as any}
          onChange={(e) => setField("rentPrice", e.target.value)}
          className={cx(errors.rentPrice && "border-red-500")}
        />
      </FormFieldContainer>

      {/* Deposit / Maintenance */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
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

      {/* Areas */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
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

      {/* Floor / Washrooms / Parking */}
      <FormFieldWrapper className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormFieldContainer label="Floor" htmlFor="floor">
          <Input
            id="floor"
            name="floor"
            type="number"
            value={floor as any}
            onChange={(e) => setField("floor", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Total Floors" htmlFor="totalFloors">
          <Input
            id="totalFloors"
            name="totalFloors"
            type="number"
            value={totalFloors as any}
            onChange={(e) => setField("totalFloors", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Washrooms" htmlFor="washrooms">
          <Input
            id="washrooms"
            name="washrooms"
            type="number"
            value={washrooms as any}
            onChange={(e) => setField("washrooms", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Parking Spaces" htmlFor="parkingSpaces">
          <Input
            id="parkingSpaces"
            name="parkingSpaces"
            type="number"
            value={parkingSpaces as any}
            onChange={(e) => setField("parkingSpaces", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Available From / Lease Term */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Available From" htmlFor="available_from">
          <Input
            id="available_from"
            name="available_from"
            type="date"
            value={available_from as any}
            onChange={(e) => setField("available_from", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Lease Term (months)" htmlFor="leaseTerm">
          <Input
            id="leaseTerm"
            name="leaseTerm"
            type="number"
            value={leaseTerm as any}
            onChange={(e) => setField("leaseTerm", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Furnishing */}
      <ToggleButtonGroup
        title="Furnishing"
        singleSelect
        value={furnishing ? [furnishing] : []}
        onChange={(v) => setField("furnishing", v[0] ?? "")}
      >
        {FURNISHING_OPTIONS.map((o) => (
          <ToggleGroupButton key={o} value={o}>{o}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Pantry / Power Backup */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <ToggleButtonGroup
          title="Pantry"
          singleSelect
          value={pantry ? [pantry] : []}
          onChange={(v) => setField("pantry", v[0] ?? "")}
        >
          {YES_NO_OPTIONS.map((o) => (
            <ToggleGroupButton key={o} value={o}>{o}</ToggleGroupButton>
          ))}
        </ToggleButtonGroup>

        <ToggleButtonGroup
          title="Power Backup"
          singleSelect
          value={powerBackup ? [powerBackup] : []}
          onChange={(v) => setField("powerBackup", v[0] ?? "")}
        >
          {YES_NO_OPTIONS.map((o) => (
            <ToggleGroupButton key={o} value={o}>{o}</ToggleGroupButton>
          ))}
        </ToggleButtonGroup>
      </FormFieldWrapper>

      {/* Facilities */}
      <ToggleButtonGroup
        title="Facilities"
        value={facilities}
        onChange={(v) => setField("facilities", v)}
      >
        {config.commercial.facilities.map((f) => (
          <ToggleGroupButton key={f} value={f}>{f}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.commercial.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
