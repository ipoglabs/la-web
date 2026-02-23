"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function FashionAccessoriesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const brand = (store as any).brand ?? "";
  const size = (store as any).size ?? "";
  const color = (store as any).color ?? "";
  const material = (store as any).material ?? "";
  const condition = (store as any).condition ?? "";
  const gender = (store as any).gender ?? "";
  const price = (store as any).price ?? store.salePrice ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory)
      setField("subcategory", "Fashion & Accessories");
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

    if (!name.trim()) mapped.name = "Ad title required";
    if (!condition) mapped.condition = "Condition required";
    if (!isPositive(price)) mapped.price = "Invalid price";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Seller name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Contact info required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // clean persist
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
      className="space-y-6 max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">
        Post Fashion & Accessories
      </h2>

      {/* Title */}
      <FormField
        label="Ad Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Brand / Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Brand"
          field="brand"
          value={brand}
          onChange={(v) => setField("brand", v)}
        />
        <FormField
          label="Size"
          field="size"
          value={size}
          onChange={(v) => setField("size", v)}
        />
      </div>

      {/* Color / Material */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Color"
          field="color"
          value={color}
          onChange={(v) => setField("color", v)}
        />
        <FormField
          label="Material"
          field="material"
          value={material}
          onChange={(v) => setField("material", v)}
        />
      </div>

      {/* Condition / Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label="Gender"
          field="gender"
          value={gender}
          onChange={(v) => setField("gender", v)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "unisex", label: "Unisex" },
          ]}
        />
      </div>

      {/* Price */}
      <FormField
        label="Price (₹)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Location */}
      {/* <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      /> */}

      {/* Seller Info */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
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