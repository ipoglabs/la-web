"use client";

import React, { useRef, useState } from "react";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { usePropertyConfig } from "@/hooks/usePropertyConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function WantedPropertyForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = usePropertyConfig();
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const minBudget   = usePostFormStore((s) => (s as any).minBudget) ?? "";
  const maxBudget   = usePostFormStore((s) => (s as any).maxBudget) ?? "";
  const minArea     = usePostFormStore((s) => (s as any).minArea) ?? "";
  const beds        = usePostFormStore((s) => (s as any).beds) ?? "";
  const baths       = usePostFormStore((s) => (s as any).baths) ?? "";
  const amenities   = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  const preferred_locations =
    (usePostFormStore((s) => (s as any).preferred_locations) ?? []) as string[];

  const [preferredLocationsString, setPreferredLocationsString] = useState(
    preferred_locations.join(", ")
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("wantedform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePreferredLocationsChange = (v: string) => {
    setPreferredLocationsString(v);
    const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
    setField("preferred_locations", arr);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    const title = name.trim();
    const desc  = description.trim();

    if (!title)         mapped.name        = "Requirement title is required.";
    if (!desc)          mapped.description = "Description is required.";
    if (!propertyType)  mapped.propertyType = "Please select property type.";
    if (!isPositive(minBudget)) mapped.minBudget = "Min budget must be greater than 0.";
    if (!isPositive(maxBudget)) mapped.maxBudget = "Max budget must be greater than 0.";

    if (isPositive(minBudget) && isPositive(maxBudget) && Number(maxBudget) < Number(minBudget)) {
      mapped.maxBudget = "Max budget should be greater than min budget.";
    }

    if (minArea && !isPositive(minArea)) mapped.minArea = "Area must be positive.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
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
      id="wantedForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post Wanted Property</h2>

      {/* Property Type */}
      <ToggleButtonGroup
        title="Looking For"
        singleSelect
        showError={!!errors.propertyType}
        errorMessage={errors.propertyType}
        value={propertyType ? [propertyType] : []}
        onChange={(v) => setField("propertyType", v[0] ?? "")}
      >
        {config.wanted.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Title */}
      <FormField
        label="Requirement Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Description */}
      <FormField
        label="Additional Requirements"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Preferred Locations */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Locations</label>
        <input
          name="preferred_locations"
          className="w-full border rounded px-3 py-2"
          placeholder="Comma-separated locations"
          value={preferredLocationsString}
          onChange={(e) => handlePreferredLocationsChange(e.target.value)}
        />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={`Min Budget (${currency})`}
          field="minBudget"
          type="number"
          value={minBudget}
          onChange={(v) => setField("minBudget", v)}
        />
        <FormField
          label={`Max Budget (${currency})`}
          field="maxBudget"
          type="number"
          value={maxBudget}
          onChange={(v) => setField("maxBudget", v)}
        />
      </div>

      {/* Area + Rooms */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          label={`Min Area (${config.areaUnit})`}
          field="minArea"
          type="number"
          value={minArea}
          onChange={(v) => setField("minArea", v)}
        />
        <FormField
          label="Beds"
          field="beds"
          type="number"
          value={beds}
          onChange={(v) => setField("beds", v)}
        />
        <FormField
          label="Baths"
          field="baths"
          type="number"
          value={baths}
          onChange={(v) => setField("baths", v)}
        />
      </div>

      {/* Amenities */}
      <ToggleButtonGroup
        title="Preferred Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.wanted.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
