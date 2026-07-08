"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function HomeLivingForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? store.itemName ?? "";
  const brandName = store.brandName ?? "";
  const categoryType = store.categoryType ?? "";
  const condition = store.condition ?? "";
  const material = store.material ?? "";
  const dimensions = store.dimensions ?? "";
  const color = store.color ?? "";
  const weight = store.weight ?? "";
  const warranty = store.warranty ?? "";
  const usageDuration = store.usageDuration ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const deliveryOption = store.deliveryOption ?? "";
  const mediaUrl = store.mediaUrl ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) setField("category", "For Sale");
    if (!subcategory) setField("subcategory", "Home & Living");
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

    if (!name.trim()) mapped.name = "Item name required";
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
      <h2 className="text-2xl font-bold">Home & Living</h2>

      <FormField
        label="Item Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Brand Name"
        field="brandName"
        value={brandName}
        onChange={(v) => setField("brandName", v)}
      />

      <ToggleButtonGroup title="Category Type" singleSelect value={categoryType ? [categoryType] : []} onChange={(v) => setField("categoryType", v[0] ?? "")}>
        <ToggleGroupButton value="furniture">Furniture</ToggleGroupButton>
        <ToggleGroupButton value="home-decor">Home Decor</ToggleGroupButton>
        <ToggleGroupButton value="appliances">Appliances</ToggleGroupButton>
        <ToggleGroupButton value="kitchenware">Kitchenware</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Condition" singleSelect value={condition ? [condition] : []} onChange={(v) => setField("condition", v[0] ?? "")}>
        <ToggleGroupButton value="new">New</ToggleGroupButton>
        <ToggleGroupButton value="used">Used</ToggleGroupButton>
        <ToggleGroupButton value="refurbished">Refurbished</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Material" field="material" value={material} onChange={(v) => setField("material", v)} />
      <FormField label="Dimensions" field="dimensions" value={dimensions} onChange={(v) => setField("dimensions", v)} />
      <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
      <FormField label="Weight" field="weight" value={weight} onChange={(v) => setField("weight", v)} />
      <FormField label="Warranty" field="warranty" value={warranty} onChange={(v) => setField("warranty", v)} />
      <FormField label="Usage Duration" field="usageDuration" value={usageDuration} onChange={(v) => setField("usageDuration", v)} />

      <FormField
        label="Price"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <ToggleButtonGroup title="Delivery Option" singleSelect value={deliveryOption ? [deliveryOption] : []} onChange={(v) => setField("deliveryOption", v[0] ?? "")}>
        <ToggleGroupButton value="pickup">Pickup Only</ToggleGroupButton>
        <ToggleGroupButton value="delivery">Home Delivery Available</ToggleGroupButton>
        <ToggleGroupButton value="both">Pickup &amp; Delivery</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Media URL" field="mediaUrl" value={mediaUrl} onChange={(v) => setField("mediaUrl", v)} />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Location */}
      {/* <h3 className="text-lg font-semibold">Location</h3>
      <FormField
        label="City"
        field="city"
        value={location?.city ?? ""}
        onChange={(v) => setLoc("city", v as string)}
      />
      <FormField
        label="State"
        field="state"
        value={location?.state ?? ""}
        onChange={(v) => setLoc("state", v as string)}
      />
      <FormField
        label="Zipcode"
        field="zipcode"
        value={location?.zipcode ?? ""}
        onChange={(v) => setLoc("zipcode", v as string)}
      /> */}

      {/* Seller */}
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