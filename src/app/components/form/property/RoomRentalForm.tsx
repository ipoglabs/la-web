"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { FormFieldWrapper } from "@/app/components/form/fields/FormFieldWrapper";
import { FormField as FormFieldContainer } from "@/app/components/form/fields/FormFieldContainer";
import { cn as cx } from "@/lib/utils";
import { usePropertyConfig } from "@/hooks/usePropertyConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function RoomRentalForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { currency } = useCountryConfig();
  const setField = usePostFormStore((s) => s.setField);

  const roomType        = usePostFormStore((s) => (s as any).type) ?? "";
  const name            = usePostFormStore((s) => s.name) ?? "";
  const description     = usePostFormStore((s) => s.description) ?? "";
  const rent            = usePostFormStore((s) => (s as any).rent) ?? "";
  const deposit         = usePostFormStore((s) => (s as any).deposit) ?? "";
  const available_from  = usePostFormStore((s) => (s as any).available_from) ?? "";
  const preferred_tenants = usePostFormStore((s) => (s as any).preferred_tenants) ?? "";
  const gender_pref  = usePostFormStore((s) => (s as any).gender_pref) ?? "";
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const tenantPreferenceOptions = ["Any", "Students", "Working Professionals", "Family"];
  const genderPreferenceOptions = ["Any", "Male", "Female"];

  const isPositive = (v: unknown) => {
    if (v === null || v === undefined || v === "") return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("roomrentalform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!roomType)            mapped.type        = "Please select a room type.";
    if (!name.trim())         mapped.name        = "Listing title is required.";
    if (!description.trim())  mapped.description = "Description is required.";
    if (!isPositive(rent))    mapped.rent        = "Rent must be greater than 0.";
    if (!available_from)      mapped.available_from = "Select available date.";
    if (deposit && !isPositive(deposit)) mapped.deposit = "Deposit must be positive.";

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
      id="roomRentalForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Add Room for Rent</h2>

      {/* Room Type */}
      <ToggleButtonGroup
        title="Room Type"
        isMandatory
        singleSelect
        showError={!!errors.type}
        errorMessage={errors.type}
        value={roomType ? [roomType] : []}
        onChange={(v) => setField("type", v[0] ?? "")}
      >
        {config.roomRental.roomTypes.map((opt) => (
          <ToggleGroupButton key={opt} value={opt}>{opt}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Title */}
      <FormFieldContainer label="Listing Title" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </FormFieldContainer>

      {/* Description */}
      <FormFieldContainer label="Description" htmlFor="description" error={errors.description}>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </FormFieldContainer>

      {/* Rent / Deposit */}
      <FormFieldWrapper className="grid grid-cols-2 gap-4">
        <FormFieldContainer label={`Rent (${currency})`} htmlFor="rent" error={errors.rent}>
          <Input id="rent" name="rent" type="number" value={rent as any}
            onChange={(e) => setField("rent", e.target.value)} />
        </FormFieldContainer>

        <FormFieldContainer label="Deposit" htmlFor="deposit">
          <Input id="deposit" name="deposit" type="number" value={deposit as any}
            onChange={(e) => setField("deposit", e.target.value)} />
        </FormFieldContainer>
      </FormFieldWrapper>

      {/* Available From */}
      <FormFieldContainer label="Available From" htmlFor="available_from" error={errors.available_from}>
        <Input id="available_from" name="available_from" type="date" value={available_from as any}
          onChange={(e) => setField("available_from", e.target.value)} />
      </FormFieldContainer>

      {/* Preferences */}
      <ToggleButtonGroup
        title="Preferred Tenants"
        singleSelect
        value={preferred_tenants ? [preferred_tenants] : []}
        onChange={(v) => setField("preferred_tenants", v[0] ?? "")}
      >
        {tenantPreferenceOptions.map((opt) => (
          <ToggleGroupButton key={opt} value={opt}>{opt}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup
        title="Gender Preference"
        singleSelect
        value={gender_pref ? [gender_pref] : []}
        onChange={(v) => setField("gender_pref", v[0] ?? "")}
      >
        {genderPreferenceOptions.map((opt) => (
          <ToggleGroupButton key={opt} value={opt}>{opt}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.roomRental.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
