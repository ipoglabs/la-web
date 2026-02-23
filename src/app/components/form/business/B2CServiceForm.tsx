"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { toast } from "sonner";

export default function B2CServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const targetAudience = (store as any).targetAudience ?? "";
  const availability = (store as any).availability ?? "";
  const description = store.description ?? "";
  const website = (store as any).website ?? "";
  const price = (store as any).price ?? store.salePrice ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Business");
    if (!subcategory) setField("subcategory", "B2C");
  }, [category, subcategory, setField]);

  const isPositive = (v: unknown) => {
    if (!v) return true;
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

    if (!name.trim()) mapped.name = "Service name required";
    if (!description.trim()) mapped.description = "Description required";
    if (!location?.address?.trim())
      mapped.location = "Location required";
    if (!isPositive(price)) mapped.price = "Invalid price";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact person required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";
    if (!sellerInfo?.email?.trim())
      mapped.sellerEmail = "Email required";

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
        Post Your B2C Service
      </h2>

      <FormField
        label="Service Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Target Audience"
        field="targetAudience"
        value={targetAudience}
        onChange={(v) => setField("targetAudience", v)}
      />

      <FormField
        label="Price / Rate (₹)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
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
        label="Availability"
        field="availability"
        value={availability}
        onChange={(v) => setField("availability", v)}
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Person"
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
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
      </div> */}

      <FormField
        label="Website / Social Link"
        field="website"
        value={website}
        onChange={(v) => setField("website", v)}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}