"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "food",     label: "Food" },
  { value: "toys",     label: "Toys" },
  { value: "bedding",  label: "Bedding" },
  { value: "grooming", label: "Grooming" },
  { value: "cage",     label: "Cage / Carrier" },
  { value: "others",   label: "Others" },
];

const CONDITIONS = [
  { value: "new",        label: "New" },
  { value: "used",       label: "Used" },
  { value: "gentlyUsed", label: "Gently Used" },
];

export default function PetAccessoriesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  const store    = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  useEffect(() => {
    setField("category", "Pets");
    setField("subcategory", "Accessories");
  }, [setField]);

  const accessoryName = (store as any).accessoryName ?? "";
  const partsCategory = (store as any).partsCategory ?? "";
  const brand         = (store as any).brand ?? "";
  const condition     = (store as any).condition ?? "";
  const price         = (store as any).price ?? (store as any).salePrice ?? "";
  const description   = store.description ?? "";
  const location      = store.location ?? {};
  const sellerInfo    = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petaccessoriesform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!accessoryName.trim()) mapped.accessoryName = "Accessory name is required.";
    if (!partsCategory)        mapped.partsCategory = "Category is required.";
    if (!condition)            mapped.condition     = "Condition is required.";
    if (!isPositive(price))    mapped.price         = "Valid price is required.";
    if (!sellerInfo?.name?.trim())  mapped.sellerName  = "Contact name is required.";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone is required.";
    if (!location?.address?.trim()) mapped.location    = "Location is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("accessoryName", accessoryName.trim());
    setField("name", accessoryName.trim());
    setField("description", description.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="petAccessoriesForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Post Pet Accessories</h2>

      <FormField label="Accessory Name" field="accessoryName" value={accessoryName} onChange={(v) => setField("accessoryName", v)} required />

      <ToggleButtonGroup title="Category" singleSelect value={partsCategory ? [partsCategory] : []} onChange={(v) => setField("partsCategory", v[0] ?? "")}>
        <ToggleGroupButton value="food">Food</ToggleGroupButton>
        <ToggleGroupButton value="toys">Toys</ToggleGroupButton>
        <ToggleGroupButton value="bedding">Bedding</ToggleGroupButton>
        <ToggleGroupButton value="grooming">Grooming</ToggleGroupButton>
        <ToggleGroupButton value="cage">Cage / Carrier</ToggleGroupButton>
        <ToggleGroupButton value="others">Others</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
        <ToggleGroupButton value="gentlyUsed">Gently Used</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label={`Price (${currency})`}
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <div className="space-y-1">
        <label className="text-sm font-medium">Location *</label>
        <input
          name="location"
          className="border rounded px-3 py-2 w-full"
          placeholder="City / Area"
          value={location?.address ?? ""}
          onChange={(e) => setField("location", { ...location, address: e.target.value })}
        />
      </div>

      <div className="space-y-3 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Contact Name *</label>
            <input
              name="sellerName"
              className="border rounded px-3 py-2 w-full"
              placeholder="Your name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => setSeller("name", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="sellerEmail"
              type="email"
              className="border rounded px-3 py-2 w-full"
              placeholder="Email address"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => setSeller("email", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone *</label>
            <input
              name="sellerPhone"
              type="tel"
              className="border rounded px-3 py-2 w-full"
              placeholder="Phone number"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => setSeller("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
