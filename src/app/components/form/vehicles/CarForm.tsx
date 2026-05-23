"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useVehicleConfig } from "@/hooks/useVehicleConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function CarSaleForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = useVehicleConfig();
  const { currency } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name               = usePostFormStore((s) => s.name) ?? "";
  const description        = usePostFormStore((s) => s.description) ?? "";
  const make               = usePostFormStore((s) => (s as any).make) ?? "";
  const model              = usePostFormStore((s) => (s as any).model) ?? "";
  const year               = usePostFormStore((s) => (s as any).year) ?? "";
  const kms                = usePostFormStore((s) => (s as any).kms) ?? "";
  const fuelType           = usePostFormStore((s) => (s as any).fuelType) ?? "";
  const transmission       = usePostFormStore((s) => (s as any).transmission) ?? "";
  const bodyType           = usePostFormStore((s) => (s as any).bodyType) ?? "";
  const color              = usePostFormStore((s) => (s as any).color) ?? "";
  const ownerType          = usePostFormStore((s) => (s as any).ownerType) ?? "";
  const registrationNumber = usePostFormStore((s) => (s as any).registrationNumber) ?? "";
  const insuranceValidTill = usePostFormStore((s) => (s as any).insuranceValidTill) ?? "";
  const serviceHistory     = usePostFormStore((s) => (s as any).serviceHistory) ?? "";
  const salePrice          = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const featuresVal        = usePostFormStore((s) => (s as any).features) ?? [];

  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresVal) ? featuresVal.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("carform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const commitFeatures = () => {
    const arr = featuresText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("features", arr);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())       mapped.name      = "Title is required.";
    if (!make)              mapped.make      = "Make is required.";
    if (!model)             mapped.model     = "Model is required.";
    if (!isPositive(year))  mapped.year      = "Valid year required.";
    if (!isPositive(salePrice)) mapped.salePrice = "Price must be greater than 0.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    commitFeatures();
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="carForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-center">Post a Car for Sale</h2>

      <FormField label="Ad Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <FormField
        label={`Price (${currency})`}
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => setField("salePrice", v)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Make" field="make" value={make} onChange={(v) => setField("make", v)} required />
        <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} required />
        <FormField label="Year" field="year" type="number" value={year} onChange={(v) => setField("year", v)} />
        <FormField label="Mileage (km)" field="kms" type="number" value={kms} onChange={(v) => setField("kms", v)} />
      </div>

      <ToggleButtonGroup title="Fuel Type" singleSelect value={fuelType ? [fuelType] : []} onChange={(v) => setField("fuelType", v[0] ?? "")}>
        {config.carFuelTypes.map((ft) => (
          <ToggleGroupButton key={ft.value} value={ft.value}>{ft.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Transmission" singleSelect value={transmission ? [transmission] : []} onChange={(v) => setField("transmission", v[0] ?? "")}>
        <ToggleGroupButton value="Manual">Manual</ToggleGroupButton>
        <ToggleGroupButton value="Automatic">Automatic</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Body Type" singleSelect value={bodyType ? [bodyType] : []} onChange={(v) => setField("bodyType", v[0] ?? "")}>
        <ToggleGroupButton value="SUV">SUV</ToggleGroupButton>
        <ToggleGroupButton value="Sedan">Sedan</ToggleGroupButton>
        <ToggleGroupButton value="Hatchback">Hatchback</ToggleGroupButton>
        <ToggleGroupButton value="Coupe">Coupe</ToggleGroupButton>
        <ToggleGroupButton value="MPV">MPV</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
        <FormField label="Owner Type" field="ownerType" value={ownerType} onChange={(v) => setField("ownerType", v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Registration Number" field="registrationNumber" value={registrationNumber} onChange={(v) => setField("registrationNumber", v)} />
        <FormField label="Insurance Valid Till" field="insuranceValidTill" type="date" value={insuranceValidTill} onChange={(v) => setField("insuranceValidTill", v)} />
      </div>

      <ToggleButtonGroup title="Service History" singleSelect value={serviceHistory ? [serviceHistory] : []} onChange={(v) => setField("serviceHistory", v[0] ?? "")}>
        <ToggleGroupButton value="Full">Full</ToggleGroupButton>
        <ToggleGroupButton value="Partial">Partial</ToggleGroupButton>
        <ToggleGroupButton value="None">None</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="space-y-1">
        <label className="text-sm font-medium">Features</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
          placeholder="e.g. Sunroof, ABS, Alloy Wheels"
        />
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
