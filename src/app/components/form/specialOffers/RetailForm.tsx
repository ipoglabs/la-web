"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function RetailShoppingForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const brand = store.brand ?? "";
  const model = store.model ?? "";
  const size = store.size ?? "";
  const color = store.color ?? "";
  const material = store.material ?? "";
  const warranty = store.warranty ?? "";
  const returnPolicy = store.returnPolicy ?? "";
  const offers = store.offers ?? "";
  const condition = store.condition ?? "";
  const deliveryOption = store.deliveryOption ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const quantity = store.quantity ?? "";
  const description = store.description ?? "";
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory) setField("subcategory", "Retail & Shopping");
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
    setField("sellerInfo", { ...sellerInfo, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Product name required";
    if (!condition) mapped.condition = "Condition required";
    if (!isPositive(price)) mapped.price = "Invalid price";
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
      <h2 className="text-2xl font-bold">Retail & Shopping</h2>

      <FormField
        label="Product Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />
      <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} />
      <FormField label="Size / Dimensions" field="size" value={size} onChange={(v) => setField("size", v)} />
      <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
      <FormField label="Material" field="material" value={material} onChange={(v) => setField("material", v)} />
      <FormField label="Warranty" field="warranty" value={warranty} onChange={(v) => setField("warranty", v)} />
      <FormField label="Return Policy" field="returnPolicy" value={returnPolicy} onChange={(v) => setField("returnPolicy", v)} />
      <FormField label="Available Offers" field="offers" value={offers} onChange={(v) => setField("offers", v)} />

      <SelectField
        label="Condition"
        field="condition"
        value={condition}
        onChange={(v) => setField("condition", v)}
        options={[
          { value: "new", label: "New" },
          { value: "used", label: "Used" },
        ]}
        required
      />

      <SelectField
        label="Delivery / Pickup Option"
        field="deliveryOption"
        value={deliveryOption}
        onChange={(v) => setField("deliveryOption", v)}
        options={[
          { value: "pickup", label: "Pickup Only" },
          { value: "delivery", label: "Delivery Available" },
          { value: "both", label: "Pickup & Delivery" },
        ]}
      />

      <FormField
        label="Price (INR)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <FormField
        label="Quantity"
        field="quantity"
        type="number"
        value={quantity}
        onChange={(v) => setField("quantity", v)}
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* <h3 className="text-lg font-semibold">Seller Information</h3>

      <FormField
        label="Contact Name"
        field="sellerName"
        value={sellerInfo?.name ?? ""}
        onChange={(v) => setSeller("name", v as string)}
        required
      />

      <FormField
        label="Contact Email"
        field="sellerEmail"
        type="email"
        value={sellerInfo?.email ?? ""}
        onChange={(v) => setSeller("email", v as string)}
      />

      <FormField
        label="Contact Phone"
        field="sellerPhone"
        type="tel"
        value={sellerInfo?.phone ?? ""}
        onChange={(v) => setSeller("phone", v as string)}
        required
      /> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}