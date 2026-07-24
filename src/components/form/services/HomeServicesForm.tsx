"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function HomeServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const setField = usePostFormStore((s) => s.setField);
  const store = usePostFormStore();

  const name = store.name ?? "";
  const serviceType = (store as any).serviceType ?? "";
  const availability = (store as any).availability ?? "";
  const price = (store as any).price ?? "";
  const description = store.description ?? "";
  const sellerInfo = store.sellerInfo ?? {};
  const location = store.location ?? {};

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

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v); // keep backend consistent
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
    if (!serviceType) mapped.serviceType = "Service type required";
    if (!isPositive(price)) mapped.price = "Valid service charge required";

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
      className="max-w-3xl mx-auto mt-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold">Post Home Service</h2>

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="cleaning">Cleaning</ToggleGroupButton>
        <ToggleGroupButton value="plumbing">Plumbing</ToggleGroupButton>
        <ToggleGroupButton value="electrical">Electrical</ToggleGroupButton>
        <ToggleGroupButton value="carpentry">Carpentry</ToggleGroupButton>
        <ToggleGroupButton value="pest-control">Pest Control</ToggleGroupButton>
        <ToggleGroupButton value="gardening">Gardening</ToggleGroupButton>
        <ToggleGroupButton value="others">Others</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Title */}
      <FormField
        label="Service Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* Details */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="Availability"
          field="availability"
          value={availability}
          onChange={(v) => setField("availability", v)}
        />

        <FormField
          label="Experience"
          field="experience"
          onChange={(v) => setField("experience", v)}
        />

        <FormField
          label={`Service Charge (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
      </div>

      {/* Location */}
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Service Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      {/* Contact */}
      <div className="grid grid-cols-3 gap-4 border-t pt-6">
        <input
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
          required
        />
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
