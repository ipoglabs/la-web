"use client";

import React, { useRef, useState } from "react";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { usePropertyConfig } from "@/lib/hooks/usePropertyConfig";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function PropertySaleForm() {
  const formRef  = useRef<HTMLFormElement | null>(null);
  const config   = usePropertyConfig();
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);

  const name        = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const salePrice   = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const plot_area   = usePostFormStore((s) => (s as any).plot_area) ?? "";
  const negotiable  = usePostFormStore((s) => (s as any).negotiable) ?? "";
  const propertyType = usePostFormStore((s) => (s as any).propertyType) ?? "";
  const ownership    = usePostFormStore((s) => (s as any).ownership) ?? "";
  const amenities    = (usePostFormStore((s) => (s as any).amenities) as string[]) ?? [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("propertysaleform:validated", { detail: { ok } }));
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

    if (!name.trim())        mapped.name        = "Listing title is required.";
    if (!description.trim()) mapped.description = "Description is required.";
    if (!isPositive(salePrice)) mapped.salePrice = "Price must be greater than 0.";
    if (plot_area && !isPositive(plot_area)) mapped.plot_area = "Plot area must be positive.";

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
      id="propertySaleForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Add Property for Sale</h2>

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
        {config.sale.propertyTypes.map((o) => (
          <ToggleGroupButton key={o.value} value={o.value}>{o.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      {/* Basic */}
      <FormField
        label="Listing Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Pricing */}
      <FormField
        label={`Expected Price (${currency})`}
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => setField("salePrice", v)}
        required
      />

      <ToggleButtonGroup
        title="Negotiable"
        singleSelect
        value={negotiable ? [negotiable] : []}
        onChange={(v) => setField("negotiable", v[0] ?? "")}
      >
        <ToggleGroupButton value="Yes">Yes</ToggleGroupButton>
        <ToggleGroupButton value="No">No</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Plot area */}
      <FormField
        label={`Plot Area (${config.areaUnit})`}
        field="plot_area"
        type="number"
        value={plot_area}
        onChange={(v) => setField("plot_area", v)}
      />

      {/* Ownership */}
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

      {/* Amenities */}
      <ToggleButtonGroup
        title="Amenities"
        value={amenities}
        onChange={(v) => setField("amenities", v)}
      >
        {config.sale.amenities.map((a) => (
          <ToggleGroupButton key={a} value={a}>{a}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <button type="submit" className="sr-only" />
    </form>
  );
}
