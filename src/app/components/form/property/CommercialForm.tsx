"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { usePropertyConfig } from "@/hooks/usePropertyConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function CommercialForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { currency } = useCountryConfig();
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
      <FormFieldContainer label="Title" htmlFor="name" error={errors.name}>
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
