"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { toast } from "sonner";
import { usePropertyConfig } from "@/hooks/usePropertyConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const RULE_OPTIONS = [
  "Smoking Allowed",
  "Pets Allowed",
  "Parties Allowed",
  "Children Friendly",
];

export default function HolidayRentalForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { currency } = useCountryConfig();
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const holidayType = usePostFormStore((s) => (s as any).holidayType) ?? "";
  const guests      = usePostFormStore((s) => (s as any).guests) ?? "";
  const beds        = usePostFormStore((s) => (s as any).beds) ?? "";
  const baths       = usePostFormStore((s) => (s as any).baths) ?? "";
  const rateNightly = usePostFormStore((s) => (s as any).rateNightly) ?? "";
  const rateWeekly  = usePostFormStore((s) => (s as any).rateWeekly) ?? "";
  const rateMonthly  = usePostFormStore((s) => (s as any).rateMonthly) ?? "";
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];
  const house_rules  = (usePostFormStore((s) => (s as any).house_rules) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("holidayrentalform:validated", { detail: { ok } }));
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
    if (!holidayType)        mapped.holidayType = "Select property type.";
    if (!isPositive(guests)) mapped.guests      = "Guests must be greater than 0.";
    if (!isPositive(beds))   mapped.beds        = "Beds must be greater than 0.";
    if (!isPositive(baths))  mapped.baths       = "Baths must be greater than 0.";
    if (!isPositive(rateNightly)) mapped.rateNightly = "Nightly rate must be greater than 0.";

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
      id="holidayRentalForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Add Holiday Rental</h2>

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

      {/* Holiday Type */}
      <ToggleButtonGroup
        title="Holiday Property Type"
        isMandatory
        singleSelect
        showError={!!errors.holidayType}
        errorMessage={errors.holidayType}
        value={holidayType ? [holidayType] : []}
        onChange={(v) => setField("holidayType", v[0] ?? "")}
      >
        {config.holiday.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Capacity */}
      <FormFieldWrapper className="grid grid-cols-3 gap-4">
        <FormFieldContainer label="Guests" htmlFor="guests" error={errors.guests}>
          <Input
            id="guests"
            name="guests"
            type="number"
            value={guests as any}
            onChange={(e) => setField("guests", e.target.value)}
            className={cx(errors.guests && "border-red-500")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Beds" htmlFor="beds" error={errors.beds}>
          <Input
            id="beds"
            name="beds"
            type="number"
            value={beds as any}
            onChange={(e) => setField("beds", e.target.value)}
            className={cx(errors.beds && "border-red-500")}
          />
        </FormFieldContainer>

        <FormFieldContainer label="Baths" htmlFor="baths" error={errors.baths}>
          <Input
            id="baths"
            name="baths"
            type="number"
            value={baths as any}
            onChange={(e) => setField("baths", e.target.value)}
            className={cx(errors.baths && "border-red-500")}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Rates */}
      <FormFieldWrapper className="grid grid-cols-3 gap-4">
        <FormFieldContainer label={`Nightly (${currency})`} htmlFor="rateNightly" error={errors.rateNightly}>
          <Input
            id="rateNightly"
            name="rateNightly"
            type="number"
            value={rateNightly as any}
            onChange={(e) => setField("rateNightly", e.target.value)}
            className={cx(errors.rateNightly && "border-red-500")}
          />
        </FormFieldContainer>

        <FormFieldContainer label={`Weekly (${currency})`} htmlFor="rateWeekly">
          <Input
            id="rateWeekly"
            name="rateWeekly"
            type="number"
            value={rateWeekly as any}
            onChange={(e) => setField("rateWeekly", e.target.value)}
          />
        </FormFieldContainer>

        <FormFieldContainer label={`Monthly (${currency})`} htmlFor="rateMonthly">
          <Input
            id="rateMonthly"
            name="rateMonthly"
            type="number"
            value={rateMonthly as any}
            onChange={(e) => setField("rateMonthly", e.target.value)}
          />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.holiday.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* House Rules */}
      <ToggleButtonGroup
        title="House Rules"
        value={house_rules}
        onChange={(v) => setField("house_rules", v)}
      >
        {RULE_OPTIONS.map((r) => (
          <ToggleGroupButton key={r} value={r}>{r}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
