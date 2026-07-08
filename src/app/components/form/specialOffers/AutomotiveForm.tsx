"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function AutomotiveForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const make = store.make ?? "";
  const model = store.model ?? "";
  const year = store.year ?? "";
  const condition = store.condition ?? "";
  const kms = store.kms ?? "";
  const fuelType = store.fuelType ?? "";
  const transmission = store.transmission ?? "";
  const bodyType = store.bodyType ?? "";
  const color = store.color ?? "";
  const ownerType = store.ownerType ?? "";
  const registrationNumber = store.registrationNumber ?? "";
  const insuranceValidTill = store.insuranceValidTill ?? "";
  const serviceHistory = store.serviceHistory ?? "";
  const price = store.salePrice ?? store.price ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category
  useEffect(() => {
    if (!category) setField("category", "Vehicles");
  }, [category, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(
      new CustomEvent("postform:validated", { detail: { ok } })
    );
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;

    const el =
      formRef.current?.querySelector<HTMLElement>(
        `[name="${first}"]`
      );

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("salePrice", v);
    setField("price", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!make.trim()) mapped.make = "Make required";
    if (!model.trim()) mapped.model = "Model required";
    if (!isPositive(price)) mapped.salePrice = "Invalid price";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // clean persist
    setField("make", make.trim());
    setField("model", model.trim());
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">Post a Vehicle</h2>

      <ToggleButtonGroup title="Vehicle Type" singleSelect value={subcategory ? [subcategory] : []} onChange={(v) => setField("subcategory", v[0] ?? "")}>
        <ToggleGroupButton value="car">Car</ToggleGroupButton>
        <ToggleGroupButton value="motorcycle">Motorcycle</ToggleGroupButton>
        <ToggleGroupButton value="truck">Truck</ToggleGroupButton>
        <ToggleGroupButton value="van">Van</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Make / Model / Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Make"
          field="make"
          value={make}
          onChange={(v) => setField("make", v)}
          required
        />
        <FormField
          label="Model"
          field="model"
          value={model}
          onChange={(v) => setField("model", v)}
          required
        />
        <FormField
          label="Year"
          field="year"
          type="number"
          value={year}
          onChange={(v) => setField("year", v)}
        />
      </div>

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="New">New</ToggleGroupButton>
        <ToggleGroupButton value="Used">Used</ToggleGroupButton>
        <ToggleGroupButton value="Certified Pre-Owned">Certified Pre-Owned</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Mileage (km)"
        field="kms"
        type="number"
        value={kms}
        onChange={(v) => setField("kms", v)}
      />

      <ToggleButtonGroup title="Fuel Type" singleSelect value={fuelType ? [fuelType] : []} onChange={(v) => setField("fuelType", v[0] ?? "")}>
        <ToggleGroupButton value="Petrol">Petrol</ToggleGroupButton>
        <ToggleGroupButton value="Diesel">Diesel</ToggleGroupButton>
        <ToggleGroupButton value="Electric">Electric</ToggleGroupButton>
        <ToggleGroupButton value="Hybrid">Hybrid</ToggleGroupButton>
        <ToggleGroupButton value="Other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Transmission" singleSelect value={transmission ? [transmission] : []} onChange={(v) => setField("transmission", v[0] ?? "")}>
        <ToggleGroupButton value="Manual">Manual</ToggleGroupButton>
        <ToggleGroupButton value="Automatic">Automatic</ToggleGroupButton>
        <ToggleGroupButton value="AMT">AMT</ToggleGroupButton>
        <ToggleGroupButton value="CVT">CVT</ToggleGroupButton>
        <ToggleGroupButton value="DCT">DCT</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Body Type"
          field="bodyType"
          value={bodyType}
          onChange={(v) => setField("bodyType", v)}
        />
        <FormField
          label="Color"
          field="color"
          value={color}
          onChange={(v) => setField("color", v)}
        />
      </div>

      {/* Owner / Reg / Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Owner Type"
          field="ownerType"
          value={ownerType}
          onChange={(v) => setField("ownerType", v)}
        />
        <FormField
          label="Registration Number"
          field="registrationNumber"
          value={registrationNumber}
          onChange={(v) => setField("registrationNumber", v)}
        />
        <FormField
          label="Insurance Valid Till"
          field="insuranceValidTill"
          type="date"
          value={insuranceValidTill}
          onChange={(v) => setField("insuranceValidTill", v)}
        />
      </div>

      {/* Service / Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Service History"
          field="serviceHistory"
          value={serviceHistory}
          onChange={(v) => setField("serviceHistory", v)}
        />
        <FormField
          label={`Price (${currency})`}
          field="salePrice"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
      </div>

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}