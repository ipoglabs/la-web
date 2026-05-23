"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function OfficeSuppliesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const condition = (store as any).condition ?? "";
  const supplyType = (store as any).supplyType ?? "";
  const brand = (store as any).brand ?? "";
  const model = (store as any).model ?? "";
  const quantity = (store as any).quantity ?? "";
  const color = (store as any).color ?? "";
  const material = (store as any).material ?? "";
  const features = (store as any).features ?? "";
  const price = (store as any).price ?? store.salePrice ?? "";
  const negotiable = (store as any).negotiable ?? "";
  const businessType = (store as any).businessType ?? "";
  const description = store.description ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory) setField("subcategory", "Office Supplies");
  }, [category, subcategory, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("officesuppliesform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Title required";
    if (!condition) mapped.condition = "Condition required";
    if (!supplyType) mapped.supplyType = "Supply type required";
    if (!isPositive(price)) mapped.price = "Invalid price";
    if (!sellerInfo?.name?.trim()) mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone required";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
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
      id="officeSuppliesForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">Office Supplies Details</h2>

      <FormField label="Item Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="like-new">Like New</ToggleGroupButton>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Type of Supply" singleSelect value={supplyType ? [supplyType] : []} onChange={(v) => setField("supplyType", v[0] ?? "")}>
        <ToggleGroupButton value="stationery">Stationery</ToggleGroupButton>
        <ToggleGroupButton value="printer">Printers &amp; Scanners</ToggleGroupButton>
        <ToggleGroupButton value="furniture">Office Furniture</ToggleGroupButton>
        <ToggleGroupButton value="storage">Filing &amp; Storage</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />
        <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Quantity" field="quantity" type="number" value={quantity} onChange={(v) => setField("quantity", v)} />
        <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
        <FormField label="Material" field="material" value={material} onChange={(v) => setField("material", v)} />
      </div>

      <FormField label="Features" field="features" type="textarea" value={features} onChange={(v) => setField("features", v)} />

      <FormField
        label={`Price (${currency})`}
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <ToggleButtonGroup title="Negotiable" singleSelect value={negotiable ? [negotiable] : []} onChange={(v) => setField("negotiable", v[0] ?? "")}>
        <ToggleGroupButton value="yes">Yes</ToggleGroupButton>
        <ToggleGroupButton value="no">No</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Business / Individual" field="businessType" value={businessType} onChange={(v) => setField("businessType", v)} />

      <div className="space-y-1">
        <label className="text-sm font-medium">Location</label>
        <input
          name="location"
          className="border rounded px-3 py-2 w-full"
          placeholder="City / Area"
          value={location?.address ?? ""}
          onChange={(e) => setField("location", { ...location, address: e.target.value })}
        />
      </div>

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

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
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
