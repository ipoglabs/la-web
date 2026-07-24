"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function PartsForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  const setField = usePostFormStore((s) => s.setField);

  const name           = usePostFormStore((s) => s.name) ?? "";
  const description    = usePostFormStore((s) => s.description) ?? "";
  const partsCategory  = usePostFormStore((s) => (s as any).partsCategory) ?? "";
  const brand          = usePostFormStore((s) => (s as any).brand) ?? "";
  const condition      = usePostFormStore((s) => (s as any).condition) ?? "";
  const salePrice      = usePostFormStore((s) => (s as any).salePrice) ?? "";
  const sellerInfo     = usePostFormStore((s) => s.sellerInfo) ?? {};
  const compatibilityVal  = usePostFormStore((s) => (s as any).compatibility) ?? [];
  const featuresVal       = usePostFormStore((s) => (s as any).features) ?? [];
  const deliveryOptionsVal = usePostFormStore((s) => (s as any).deliveryOptions) ?? [];

  const [compatibilityText, setCompatibilityText] = useState(
    Array.isArray(compatibilityVal) ? compatibilityVal.join(", ") : ""
  );
  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresVal) ? featuresVal.join(", ") : ""
  );
  const [deliveryText, setDeliveryText] = useState(
    Array.isArray(deliveryOptionsVal) ? deliveryOptionsVal.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("partsform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const commitCompatibility = () => {
    setField("compatibility", compatibilityText.split(",").map((s) => s.trim()).filter(Boolean));
  };
  const commitFeatures = () => {
    setField("features", featuresText.split(",").map((s) => s.trim()).filter(Boolean));
  };
  const commitDelivery = () => {
    setField("deliveryOptions", deliveryText.split(",").map((s) => s.trim()).filter(Boolean));
  };

  const handlePrice = (v: string) => {
    setField("salePrice", v);
    setField("price", v);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())       mapped.name          = "Part name is required.";
    if (!partsCategory)     mapped.partsCategory = "Parts category is required.";
    if (!isPositive(salePrice)) mapped.salePrice = "Valid price required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    commitCompatibility();
    commitFeatures();
    commitDelivery();
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="partsForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold text-center">Post Vehicle Parts & Accessories</h2>

      <FormField label="Part Name" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <ToggleButtonGroup title="Parts Category" singleSelect value={partsCategory ? [partsCategory] : []} onChange={(v) => setField("partsCategory", v[0] ?? "")}>
        <ToggleGroupButton value="engine">Engine Parts</ToggleGroupButton>
        <ToggleGroupButton value="electrical">Electrical &amp; Lighting</ToggleGroupButton>
        <ToggleGroupButton value="interior">Interior Accessories</ToggleGroupButton>
        <ToggleGroupButton value="exterior">Exterior Accessories</ToggleGroupButton>
        <ToggleGroupButton value="tyres">Tyres &amp; Wheels</ToggleGroupButton>
        <ToggleGroupButton value="others">Others</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
        <ToggleGroupButton value="refurbished">Refurbished</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label={`Selling Price (${currency})`}
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Compatibility (comma-separated)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={compatibilityText}
          onChange={(e) => setCompatibilityText(e.target.value)}
          onBlur={commitCompatibility}
          placeholder="e.g. Toyota Corolla 2018-2022"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Key Features (comma-separated)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Delivery Options (comma-separated)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={deliveryText}
          onChange={(e) => setDeliveryText(e.target.value)}
          onBlur={commitDelivery}
          placeholder="e.g. Nationwide, Local Pickup"
        />
      </div>

      <div className="space-y-2 border-t pt-6">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={sellerInfo?.name ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            value={sellerInfo?.email ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Phone"
            value={sellerInfo?.phone ?? ""}
            onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
