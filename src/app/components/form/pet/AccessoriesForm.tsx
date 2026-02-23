// src/app/components/form/pets/AccessoriesForm.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PetAccessoriesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // preset category/subcategory
  useEffect(() => {
    setField("category", "Pets");
    setField("subcategory", "Accessories");
  }, [setField]);

  const accessoryName = (store as any).accessoryName ?? "";
  const partsCategory = (store as any).partsCategory ?? "";
  const brand = (store as any).brand ?? "";
  const condition = (store as any).condition ?? "";
  const price = (store as any).price ?? store.salePrice ?? "";
  const description = store.description ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v); // backend safe
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

    if (!accessoryName.trim())
      mapped.accessoryName = "Accessory name required";

    if (!partsCategory)
      mapped.partsCategory = "Category required";

    if (!condition)
      mapped.condition = "Condition required";

    if (!isPositive(price))
      mapped.price = "Invalid price";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";

    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    if (!location?.address?.trim())
      mapped.location = "Location required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // persist cleaned values
    setField("accessoryName", accessoryName.trim());
    setField("name", accessoryName.trim()); // for preview title reuse
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  // Options
  const categories = useMemo(
    () => [
      { value: "food", label: "Food" },
      { value: "toys", label: "Toys" },
      { value: "bedding", label: "Bedding" },
      { value: "grooming", label: "Grooming" },
      { value: "cage", label: "Cage / Carrier" },
      { value: "others", label: "Others" },
    ],
    []
  );

  const conditions = useMemo(
    () => [
      { value: "new", label: "New" },
      { value: "used", label: "Used" },
      { value: "gentlyUsed", label: "Gently Used" },
    ],
    []
  );

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Pet Accessories
      </h2>

      {/* Accessory Name */}
      <FormField
        label="Accessory Name"
        field="accessoryName"
        value={accessoryName}
        onChange={(v) => setField("accessoryName", v)}
        required
      />

      {/* Category / Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Category"
          field="partsCategory"
          value={partsCategory}
          onChange={(v) => setField("partsCategory", v)}
          options={categories}
          required
        />
        <FormField
          label="Brand"
          field="brand"
          value={brand}
          onChange={(v) => setField("brand", v)}
        />
      </div>

      {/* Condition / Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Condition"
          field="condition"
          value={condition}
          onChange={(v) => setField("condition", v)}
          options={conditions}
          required
        />
        <FormField
          label="Price (₹)"
          field="price"
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

      {/* Location */}
      <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      {/* Seller Info */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
        />
        <input
          name="sellerPhone"
          className="border rounded px-3 py-2"
          type="tel"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}