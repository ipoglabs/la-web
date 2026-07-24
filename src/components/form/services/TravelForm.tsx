"use client";

import React, { useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

export default function TravelServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const name = store.name ?? "";
  const destination = (store as any).destination ?? "";
  const packageDetails = (store as any).packageDetails ?? "";
  const durationText = (store as any).durationText ?? "";
  const agencyName = (store as any).agencyName ?? "";
  const availability = (store as any).availability ?? "";
  const serviceType = (store as any).serviceType ?? "";
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
    setField("salePrice", v); // backend consistency
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
    if (!serviceType) mapped.serviceType = "Service type required";
    if (!destination.trim()) mapped.destination = "Destination required";
    if (!packageDetails.trim())
      mapped.packageDetails = "Package details required";
    if (!durationText.trim()) mapped.durationText = "Duration required";
    if (!isPositive(price)) mapped.price = "Valid price required";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.email?.trim())
      mapped.sellerEmail = "Email required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

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

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto my-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Travel Service
      </h2>

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="tour">Tour</ToggleGroupButton>
        <ToggleGroupButton value="package">Package</ToggleGroupButton>
        <ToggleGroupButton value="guide">Guide</ToggleGroupButton>
        <ToggleGroupButton value="transport">Transport</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Title */}
      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Destination */}
      <FormField
        label="Destination"
        field="destination"
        value={destination}
        onChange={(v) => setField("destination", v)}
      />

      {/* Package Details */}
      <FormField
        label="Package Details"
        field="packageDetails"
        type="textarea"
        value={packageDetails}
        onChange={(v) => setField("packageDetails", v)}
      />

      {/* Duration / Availability / Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Duration"
          field="durationText"
          value={durationText}
          onChange={(v) => setField("durationText", v)}
        />
        <FormField
          label="Availability"
          field="availability"
          value={availability}
          onChange={(v) => setField("availability", v)}
        />
        <FormField
          label={`Price (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
      </div>

      {/* Agency Name */}
      <FormField
        label="Agency Name"
        field="agencyName"
        value={agencyName}
        onChange={(v) => setField("agencyName", v)}
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

      {/* Location */}
      <input
        name="location"
        className="border rounded w-full px-3 py-2"
        placeholder="Service Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
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
          required
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
      </div>

      {/* hidden submit for global flow */}
      <button type="submit" className="sr-only" />
    </form>
  );
}