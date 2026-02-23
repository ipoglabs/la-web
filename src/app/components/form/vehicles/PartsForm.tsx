"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PartsForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const setField = usePostFormStore((s) => s.setField);

  // Core values
  const name = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const partsCategory = usePostFormStore((s) => (s as any).partsCategory) ?? "";
  const brand = usePostFormStore((s) => (s as any).brand) ?? "";
  const condition = usePostFormStore((s) => (s as any).condition) ?? "";
  const salePrice = usePostFormStore((s) => (s as any).salePrice) ?? "";

  const sellerInfo = usePostFormStore((s) => s.sellerInfo) ?? {};

  const compatibilityVal = usePostFormStore((s) => (s as any).compatibility) ?? [];
  const featuresVal = usePostFormStore((s) => (s as any).features) ?? [];
  const deliveryOptions = usePostFormStore((s) => (s as any).deliveryOptions) ?? [];

  const [compatibilityText, setCompatibilityText] = useState(
    Array.isArray(compatibilityVal) ? compatibilityVal.join(", ") : ""
  );

  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresVal) ? featuresVal.join(", ") : ""
  );

  const [deliveryText, setDeliveryText] = useState(
    Array.isArray(deliveryOptions) ? deliveryOptions.join(", ") : ""
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

  const commitCompatibility = () => {
    const arr = compatibilityText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("compatibility", arr);
  };

  const commitFeatures = () => {
    const arr = featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("features", arr);
  };

  const commitDelivery = () => {
    const arr = deliveryText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("deliveryOptions", arr);
  };

  const handlePrice = (v: string) => {
    setField("salePrice", v);
    setField("price", v); // legacy compatibility
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Part name is required";
    if (!partsCategory) mapped.partsCategory = "Parts category is required";
    if (!isPositive(salePrice)) mapped.salePrice = "Valid price required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // persist cleaned values
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
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Vehicle Parts & Accessories
      </h2>

      {/* Basic Info */}
      <FormField
        label="Part Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField
          label="Parts Category"
          field="partsCategory"
          value={partsCategory}
          onChange={(v) => setField("partsCategory", v)}
          options={[
            { value: "engine", label: "Engine Parts" },
            { value: "electrical", label: "Electrical & Lighting" },
            { value: "interior", label: "Interior Accessories" },
            { value: "exterior", label: "Exterior Accessories" },
            { value: "tyres", label: "Tyres & Wheels" },
            { value: "others", label: "Others" },
          ]}
        />

        <FormField
          label="Brand"
          field="brand"
          value={brand}
          onChange={(v) => setField("brand", v)}
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
        />
      </div>

      {/* Price */}
      <FormField
        label="Selling Price (₹)"
        field="salePrice"
        type="number"
        value={salePrice}
        onChange={(v) => handlePrice(String(v))}
        required
      />

      {/* Compatibility */}
      <div>
        <label className="text-sm font-medium">
          Compatibility (comma-separated)
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={compatibilityText}
          onChange={(e) => setCompatibilityText(e.target.value)}
          onBlur={commitCompatibility}
        />
      </div>

      {/* Features */}
      <div>
        <label className="text-sm font-medium">
          Key Features (comma-separated)
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
        />
      </div>

      {/* Delivery */}
      <div>
        <label className="text-sm font-medium">
          Delivery Options (comma-separated)
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={deliveryText}
          onChange={(e) => setDeliveryText(e.target.value)}
          onBlur={commitDelivery}
        />
      </div>

      {/* Contact */}
      <div className="space-y-2 border-t pt-6">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={sellerInfo?.name ?? ""}
            onChange={(e) =>
              setField("sellerInfo", { ...sellerInfo, name: e.target.value })
            }
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            value={sellerInfo?.email ?? ""}
            onChange={(e) =>
              setField("sellerInfo", { ...sellerInfo, email: e.target.value })
            }
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Phone"
            value={sellerInfo?.phone ?? ""}
            onChange={(e) =>
              setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
            }
            required
          />
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
