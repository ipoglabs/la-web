"use client";

import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePropertyConfig } from "@/lib/hooks/usePropertyConfig";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { sanitizeAdTitle } from "@/posting/validation/sanitizeAdTitle";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const FACILITY_OPTIONS = ["Lift", "Security", "Power Backup", "Water Supply", "Fire Safety"];

export default function RentPropertyForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

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
  const facilities =
    (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const amenityOptions = config.rent.amenities;

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
        {config.rent.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Rent */}
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormFieldContainer label={`Rent (${currency})`} htmlFor="rentPrice" error={errors.rentPrice}>
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

      {/* Furnishing */}
      <ToggleButtonGroup
        title="Furnishing"
        singleSelect
        value={furnishing ? [furnishing] : []}
        onChange={(v) => setField("furnishing", v[0] ?? "")}
      >
        {config.rent.furnishingOptions.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Available From / Lease Term */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label="Available From" htmlFor="available_from" error={errors.available_from}>
          <Input
            id="available_from"
            name="available_from"
            type="date"
            value={available_from as any}
            onChange={(e) => setField("available_from", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Lease Term (months)" htmlFor="leaseTerm" error={errors.leaseTerm}>
          <Input
            id="leaseTerm"
            name="leaseTerm"
            type="number"
            value={leaseTerm as any}
            onChange={(e) => setField("leaseTerm", e.target.value)}
            className={cx(errors.leaseTerm && "border-red-500")}
          />
        </FormFieldContainer>
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
        {amenityOptions.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
