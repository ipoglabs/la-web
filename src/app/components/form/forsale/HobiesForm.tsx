"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function HobbiesCollectionsForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const itemType = (store as any).itemType ?? "";
  const condition = (store as any).condition ?? "";
  const negotiable = (store as any).negotiable ?? false;
  const price = (store as any).price ?? store.salePrice ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory)
      setField("subcategory", "Hobbies & Collections");
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
    if (!itemType) mapped.itemType = "Item type required";
    if (!condition) mapped.condition = "Condition required";
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
        Post Hobbies & Collections Item
      </h2>

      {/* Title */}
      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Item Type */}
      <SelectField
        label="Item Type"
        field="itemType"
        value={itemType}
        onChange={(v) => setField("itemType", v)}
        options={[
          { value: "art", label: "Art" },
          { value: "antiques", label: "Antiques" },
          { value: "books", label: "Books & Comics" },
          { value: "musical", label: "Musical Instruments" },
          { value: "stamps", label: "Stamps & Coins" },
          { value: "sports", label: "Sports Memorabilia" },
          { value: "other", label: "Other Collectibles" },
        ]}
        required
      />

      {/* Condition */}
      <SelectField
        label="Condition"
        field="condition"
        value={condition}
        onChange={(v) => setField("condition", v)}
        options={[
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "used", label: "Used" },
          { value: "vintage", label: "Vintage" },
        ]}
        required
      />

      {/* Price */}
      <FormField
        label="Price (₹)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      {/* Negotiable */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={negotiable}
          onChange={(e) => setField("negotiable", e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm">Negotiable</span>
      </div>

      {/* Location */}
      <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

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
      </div>

      <input
        name="sellerEmail"
        className="border rounded px-3 py-2 w-full"
        placeholder="Email"
        type="email"
        value={sellerInfo?.email ?? ""}
        onChange={(e) => setSeller("email", e.target.value)}
      /> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}