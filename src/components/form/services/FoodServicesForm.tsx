"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function FoodServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);
  const store = usePostFormStore();

  const name = store.name ?? "";
  const serviceType = (store as any).serviceType ?? "";
  const cuisineType = (store as any).cuisineType ?? "";
  const deliveryAvailable = (store as any).deliveryAvailable ?? "";
  const price = (store as any).price ?? "";
  const description = store.description ?? "";
  const sellerInfo = store.sellerInfo ?? {};
  const location = store.location ?? {};
  const dietaryVal = (store as any).dietaryOptions ?? [];

  const [dietaryText, setDietaryText] = useState(
    Array.isArray(dietaryVal) ? dietaryVal.join(", ") : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
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

  const commitDietary = () => {
    const arr = dietaryText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("dietaryOptions", arr);
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v); // sync with backend model
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

    if (!name.trim()) mapped.name = "Service title required";
    if (!cuisineType) mapped.cuisineType = "Cuisine type required";
    if (!isPositive(price)) mapped.price = "Valid price required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    commitDietary();

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto my-6 space-y-6"
    >
      <h2 className="text-2xl font-bold">Post Food Service</h2>

      <FormField
        label="Service Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="home-cooked">Home Cooked</ToggleGroupButton>
        <ToggleGroupButton value="tiffin">Tiffin</ToggleGroupButton>
        <ToggleGroupButton value="catering">Catering</ToggleGroupButton>
        <ToggleGroupButton value="restaurant">Restaurant</ToggleGroupButton>
        <ToggleGroupButton value="cloud-kitchen">Cloud Kitchen</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Cuisine Type"
        field="cuisineType"
        value={cuisineType}
        onChange={(v) => setField("cuisineType", v)}
      />

      {/* Dietary Options */}
      <div>
        <label className="text-sm font-medium">
          Dietary Options (comma-separated)
        </label>
        <input
          className="border rounded w-full py-2 px-3"
          value={dietaryText}
          onChange={(e) => setDietaryText(e.target.value)}
          onBlur={commitDietary}
          placeholder="Vegetarian, Vegan, Gluten-Free"
        />
      </div>

      <FormField
        label={`Price (${currency})`}
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      <ToggleButtonGroup title="Delivery Available" singleSelect value={deliveryAvailable ? [deliveryAvailable] : []} onChange={(v) => setField("deliveryAvailable", v[0] ?? "")}>
        <ToggleGroupButton value="yes">Yes</ToggleGroupButton>
        <ToggleGroupButton value="no">No</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
        <input
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
