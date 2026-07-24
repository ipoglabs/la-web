"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/components/form/fields/FormFieldContainer";
import { toast } from "sonner";
import { usePropertyConfig } from "@/lib/hooks/usePropertyConfig";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const GENDER_OPTIONS = [
  { value: "Boys",  label: "Boys" },
  { value: "Girls", label: "Girls" },
  { value: "CoEd",  label: "Co-ed" },
];

export default function ForStudentForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const occupancy   = usePostFormStore((s) => (s as any).occupancy) ?? "";
  const gender_pref = usePostFormStore((s) => (s as any).gender_pref) ?? "";
  const rentPrice   = usePostFormStore((s) => (s as any).rentPrice) ?? "";
  const deposit     = usePostFormStore((s) => (s as any).deposit) ?? "";
  const beds        = usePostFormStore((s) => (s as any).beds) ?? "";
  const baths        = usePostFormStore((s) => (s as any).baths) ?? "";
  const facilities   = (usePostFormStore((s) => (s as any).facilities) as string[]) ?? [];
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("forstudentform:validated", { detail: { ok } }));
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

    if (!name.trim())        mapped.name        = "Please enter title.";
    if (!description.trim()) mapped.description = "Please enter description.";
    if (!propertyType)       mapped.propertyType = "Select property type.";
    if (!occupancy)          mapped.occupancy    = "Select occupancy type.";
    if (!isPositive(rentPrice)) mapped.rentPrice = "Enter valid rent.";

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
      id="forStudentForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Add Student Accommodation</h2>

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
        {config.student.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Occupancy */}
      <ToggleButtonGroup
        title="Occupancy"
        isMandatory
        singleSelect
        showError={!!errors.occupancy}
        errorMessage={errors.occupancy}
        value={occupancy ? [occupancy] : []}
        onChange={(v) => setField("occupancy", v[0] ?? "")}
      >
        {config.student.occupancyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Beds / Baths */}
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

      {/* Gender Preference */}
      <ToggleButtonGroup
        title="Gender Preference"
        singleSelect
        value={gender_pref ? [gender_pref] : []}
        onChange={(v) => setField("gender_pref", v[0] ?? "")}
      >
        {GENDER_OPTIONS.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Facilities */}
      <ToggleButtonGroup
        title="Facilities"
        value={facilities}
        onChange={(v) => setField("facilities", v)}
      >
        {config.student.facilities.map((f) => (
          <ToggleGroupButton key={f} value={f}>{f}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.student.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Pricing */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
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

        <FormFieldContainer label="Deposit" htmlFor="deposit">
          <Input
            id="deposit"
            name="deposit"
            type="number"
            value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      <button type="submit" className="sr-only" />
    </form>
  );
}
