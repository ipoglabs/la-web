"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function OfficeSuppliesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

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

  // preset category/subcategory
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
    setField("price", v);
    setField("salePrice", v);
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

    if (!name.trim()) mapped.name = "Title required";
    if (!condition) mapped.condition = "Condition required";
    if (!supplyType) mapped.supplyType = "Supply type required";
    if (!isPositive(price)) mapped.price = "Invalid price";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Seller name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Seller phone required";

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
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">
        Office Supplies Details
      </h2>

      <FormField
        label="Item Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <SelectField
        label="Condition"
        field="condition"
        value={condition}
        onChange={(v) => setField("condition", v)}
        options={[
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "used", label: "Used" },
        ]}
        required
      />

      <SelectField
        label="Type of Supply"
        field="supplyType"
        value={supplyType}
        onChange={(v) => setField("supplyType", v)}
        options={[
          { value: "stationery", label: "Stationery" },
          { value: "printer", label: "Printers & Scanners" },
          { value: "furniture", label: "Office Furniture" },
          { value: "storage", label: "Filing & Storage" },
          { value: "other", label: "Other" },
        ]}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />
        <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Quantity" field="quantity" type="number" value={quantity} onChange={(v) => setField("quantity", v)} />
        <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
        <FormField label="Material" field="material" value={material} onChange={(v) => setField("material", v)} />
      </div>

      <FormField
        label="Features"
        field="features"
        type="textarea"
        value={features}
        onChange={(v) => setField("features", v)}
      />

      <FormField
        label="Price (₹)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <SelectField
        label="Negotiable"
        field="negotiable"
        value={negotiable}
        onChange={(v) => setField("negotiable", v)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />

      <FormField
        label="Business / Individual"
        field="businessType"
        value={businessType}
        onChange={(v) => setField("businessType", v)}
      />

      <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Seller Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          placeholder="Seller Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Seller Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}