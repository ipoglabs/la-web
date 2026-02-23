"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function MiscellaneousForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const condition = store.condition ?? "";
  const brand = store.brand ?? "";
  const model = store.model ?? "";
  const usageDuration = store.usageDuration ?? "";
  const age = store.age ?? "";
  const exchangeOption = store.exchangeOption ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const deliveryOption = store.deliveryOption ?? "";
  const mediaUrl = store.mediaUrl ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory) setField("subcategory", "Miscellaneous");
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

  const setLoc = (k: "city" | "state" | "zipcode", v?: string) => {
    setField("location", { ...location, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Title required";
    if (!condition) mapped.condition = "Condition required";
    if (!isPositive(price)) mapped.price = "Invalid price";
    if (!description.trim()) mapped.description = "Description required";
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
      <h2 className="text-2xl font-bold">Miscellaneous</h2>

      <FormField
        label="Title"
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
          { value: "used", label: "Used" },
          { value: "refurbished", label: "Refurbished" },
        ]}
        required
      />

      <FormField label="Brand" field="brand" value={brand} onChange={(v) => setField("brand", v)} />
      <FormField label="Model" field="model" value={model} onChange={(v) => setField("model", v)} />
      <FormField label="Usage Duration" field="usageDuration" value={usageDuration} onChange={(v) => setField("usageDuration", v)} />
      <FormField label="Age" field="age" value={age} onChange={(v) => setField("age", v)} />

      <SelectField
        label="Exchange Option"
        field="exchangeOption"
        value={exchangeOption}
        onChange={(v) => setField("exchangeOption", v)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
      />

      <FormField
        label="Price"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <SelectField
        label="Delivery Option"
        field="deliveryOption"
        value={deliveryOption}
        onChange={(v) => setField("deliveryOption", v)}
        options={[
          { value: "pickup", label: "Pickup Only" },
          { value: "delivery", label: "Delivery Available" },
          { value: "both", label: "Pickup & Delivery" },
        ]}
      />

      <FormField label="Media URL" field="mediaUrl" value={mediaUrl} onChange={(v) => setField("mediaUrl", v)} />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* Location */}
      {/* <h3 className="text-lg font-semibold">Location</h3>
      <FormField label="City" field="city" value={location?.city ?? ""} onChange={(v) => setLoc("city", v as string)} />
      <FormField label="State" field="state" value={location?.state ?? ""} onChange={(v) => setLoc("state", v as string)} />
      <FormField label="Zipcode" field="zipcode" value={location?.zipcode ?? ""} onChange={(v) => setLoc("zipcode", v as string)} /> */}

      {/* Seller Info */}
      {/* <h3 className="text-lg font-semibold">Seller Information</h3>
      <FormField
        label="Name"
        field="sellerName"
        value={sellerInfo?.name ?? ""}
        onChange={(v) => setSeller("name", v as string)}
        required
      />
      <FormField
        label="Email"
        field="sellerEmail"
        type="email"
        value={sellerInfo?.email ?? ""}
        onChange={(v) => setSeller("email", v as string)}
      />
      <FormField
        label="Phone"
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