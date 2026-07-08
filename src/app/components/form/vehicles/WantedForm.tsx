"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useVehicleConfig } from "@/hooks/useVehicleConfig";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function VehicleWantedForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const config  = useVehicleConfig();
  const { currency, locationPlaceholder } = useCountryConfig();

  const setField = usePostFormStore((s) => s.setField);

  const name                = usePostFormStore((s) => s.name) ?? "";
  const description         = usePostFormStore((s) => s.description) ?? "";
  const vehicleType         = usePostFormStore((s) => (s as any).vehicleType) ?? "";
  const make                = usePostFormStore((s) => (s as any).make) ?? "";
  const model               = usePostFormStore((s) => (s as any).model) ?? "";
  const year                = usePostFormStore((s) => (s as any).year) ?? "";
  const fuelType            = usePostFormStore((s) => (s as any).fuelType) ?? "";
  const transmission        = usePostFormStore((s) => (s as any).transmission) ?? "";
  const maxBudget           = usePostFormStore((s) => (s as any).maxBudget) ?? "";
  const preferred_locations = usePostFormStore((s) => (s as any).preferred_locations);
  const sellerInfo          = usePostFormStore((s) => s.sellerInfo);

  const [locText, setLocText] = useState(
    Array.isArray(preferred_locations) ? preferred_locations.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commitLocations = () => {
    const arr = locText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("preferred_locations", arr);
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("vehiclewantedform:validated", { detail: { ok } }));
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

    if (!vehicleType)               mapped.vehicleType = "Select a vehicle category.";
    if (!sellerInfo?.name?.trim())  mapped["sellerInfo.name"]  = "Contact name is required.";
    if (!sellerInfo?.email?.trim()) mapped["sellerInfo.email"] = "Email is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    commitLocations();
    dispatchValidated(true);
  };

  return (
    <form
      id="vehicleWantedForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold text-center">Post Vehicle Wanted</h2>

      <FormField
        label="Ad Title (optional)"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Looking for a 2018+ Toyota Corolla"
      />

      <ToggleButtonGroup title="Vehicle Category" singleSelect value={vehicleType ? [vehicleType] : []} onChange={(v) => setField("vehicleType", v[0] ?? "")}>
        <ToggleGroupButton value="car">Car</ToggleGroupButton>
        <ToggleGroupButton value="motorcycle">Motorcycle</ToggleGroupButton>
        <ToggleGroupButton value="van">Van</ToggleGroupButton>
        <ToggleGroupButton value="truck">Truck</ToggleGroupButton>
        <ToggleGroupButton value="parts">Parts</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Preferred Make" field="make" value={make} onChange={(v) => setField("make", v)} placeholder="e.g. Toyota" />
        <FormField label="Preferred Model" field="model" value={model} onChange={(v) => setField("model", v)} placeholder="e.g. Corolla" />
      </div>

      <FormField label="Preferred Year (min)" field="year" type="number" value={year} onChange={(v) => setField("year", v)} placeholder="e.g. 2018" />

      <ToggleButtonGroup title="Fuel Type" singleSelect value={fuelType ? [fuelType] : []} onChange={(v) => setField("fuelType", v[0] ?? "")}>
        {config.carFuelTypes.map((ft) => (
          <ToggleGroupButton key={ft.value} value={ft.value}>{ft.label}</ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Transmission" singleSelect value={transmission ? [transmission] : []} onChange={(v) => setField("transmission", v[0] ?? "")}>
        <ToggleGroupButton value="manual">Manual</ToggleGroupButton>
        <ToggleGroupButton value="automatic">Automatic</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label={`Budget Max (${currency})`}
        field="maxBudget"
        type="number"
        value={maxBudget}
        onChange={(v) => setField("maxBudget", v)}
        placeholder={config.budgetPlaceholder}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Preferred Locations (comma-separated)</label>
        <input
          className="border rounded w-full py-2 px-3"
          placeholder={locationPlaceholder}
          value={locText}
          onChange={(e) => setLocText(e.target.value)}
          onBlur={commitLocations}
        />
        <p className="text-xs text-gray-500">Saved as a list of locations.</p>
      </div>

      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        placeholder="Any specific requirements or constraints…"
      />

      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Contact Name</label>
            <input
              name="sellerInfo.name"
              className="w-full border rounded px-3 py-2"
              placeholder="Your name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="sellerInfo.email"
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="Email address"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <input
              name="sellerInfo.phone"
              type="tel"
              className="w-full border rounded px-3 py-2"
              placeholder="Phone number"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
