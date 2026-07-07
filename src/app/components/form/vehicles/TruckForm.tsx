"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useVehicleConfig } from "@/hooks/useVehicleConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function TruckForm() {
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
  const condition          = usePostFormStore((s) => (s as any).condition) ?? "";
  const ownerType          = usePostFormStore((s) => (s as any).ownerType) ?? "";
  const registrationNumber = usePostFormStore((s) => (s as any).registrationNumber) ?? "";
  const insuranceValidTill = usePostFormStore((s) => (s as any).insuranceValidTill) ?? "";
  const serviceHistory     = usePostFormStore((s) => (s as any).serviceHistory) ?? "";
  const payloadCapacity    = usePostFormStore((s) => (s as any).payloadCapacity) ?? "";
  const axleConfig         = usePostFormStore((s) => (s as any).axleConfig) ?? "";
  const gvwr               = usePostFormStore((s) => (s as any).gvwr) ?? "";
  const salePrice          = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const featuresVal        = usePostFormStore((s) => (s as any).features) ?? [];
  const sellerInfo         = usePostFormStore((s) => s.sellerInfo) ?? {};

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
    window.dispatchEvent(new CustomEvent("truckform:validated", { detail: { ok } }));
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

  const handlePrice = (v: string) => {
    setField("salePrice", v);
    setField("price", v);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())        mapped.name      = "Title is required.";
    if (!make)               mapped.make      = "Make is required.";
    if (!model)              mapped.model     = "Model is required.";
    if (!isPositive(year))   mapped.year      = "Valid year required.";
    if (!isPositive(kms))    mapped.kms       = "Mileage is required.";
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
      id="truckForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold text-center">Post a Truck for Sale</h2>

      <FormField label="Ad Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Make" field="make" value={make} onChange={(v) => setField("make", v)} required />
        <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Year" field="year" type="number" value={year} onChange={(v) => setField("year", v)} required />
        <FormField label="Mileage (km)" field="kms" type="number" value={kms} onChange={(v) => setField("kms", v)} required />
      </div>

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="refurbished">Refurbished</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Fuel Type" singleSelect value={fuelType ? [fuelType] : []} onChange={(v) => setField("fuelType", v[0] ?? "")}>
        {config.carFuelTypes.map((ft) => (
          <ToggleGroupButton key={ft.value} value={ft.value}>{ft.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Transmission" singleSelect value={transmission ? [transmission] : []} onChange={(v) => setField("transmission", v[0] ?? "")}>
        <ToggleGroupButton value="manual">Manual</ToggleGroupButton>
        <ToggleGroupButton value="amt">AMT</ToggleGroupButton>
        <ToggleGroupButton value="automatic">Automatic</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Body Type" singleSelect value={bodyType ? [bodyType] : []} onChange={(v) => setField("bodyType", v[0] ?? "")}>
        <ToggleGroupButton value="tipper">Tipper</ToggleGroupButton>
        <ToggleGroupButton value="box">Box</ToggleGroupButton>
        <ToggleGroupButton value="flatbed">Flatbed</ToggleGroupButton>
        <ToggleGroupButton value="tanker">Tanker</ToggleGroupButton>
        <ToggleGroupButton value="trailer">Trailer</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Payload (tons)" field="payloadCapacity" type="number" value={payloadCapacity} onChange={(v) => setField("payloadCapacity", v)} />
        <FormField label="GVWR (kg)" field="gvwr" type="number" value={gvwr} onChange={(v) => setField("gvwr", v)} />
      </div>

      <ToggleButtonGroup title="Axle Config" singleSelect value={axleConfig ? [axleConfig] : []} onChange={(v) => setField("axleConfig", v[0] ?? "")}>
        <ToggleGroupButton value="4x2">4x2</ToggleGroupButton>
        <ToggleGroupButton value="6x2">6x2</ToggleGroupButton>
        <ToggleGroupButton value="6x4">6x4</ToggleGroupButton>
        <ToggleGroupButton value="8x2">8x2</ToggleGroupButton>
        <ToggleGroupButton value="8x4">8x4</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Owner Type" field="ownerType" value={ownerType} onChange={(v) => setField("ownerType", v)} />
        <FormField label="Registration No" field="registrationNumber" value={registrationNumber} onChange={(v) => setField("registrationNumber", v)} />
        <FormField label="Insurance Valid Till" field="insuranceValidTill" type="date" value={insuranceValidTill} onChange={(v) => setField("insuranceValidTill", v)} />
      </div>

      <ToggleButtonGroup title="Service History" singleSelect value={serviceHistory ? [serviceHistory] : []} onChange={(v) => setField("serviceHistory", v[0] ?? "")}>
        <ToggleGroupButton value="full">Full</ToggleGroupButton>
        <ToggleGroupButton value="partial">Partial</ToggleGroupButton>
        <ToggleGroupButton value="none">None</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="space-y-1">
        <label className="text-sm font-medium">Key Features (comma-separated)</label>
        <input
          className="border rounded w-full py-2 px-3"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
          placeholder="e.g. GPS Tracking, Air Suspension"
        />
      </div>

      <FormField
        label={`Price (${currency})`}
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
        />
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
