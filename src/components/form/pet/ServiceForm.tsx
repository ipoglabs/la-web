"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { toast } from "sonner";

const SERVICE_TYPES = [
  { value: "grooming",  label: "Grooming" },
  { value: "training",  label: "Training" },
  { value: "boarding",  label: "Boarding" },
  { value: "walking",   label: "Walking" },
  { value: "vet",       label: "Veterinary" },
  { value: "other",     label: "Other" },
];

const PET_TYPES = [
  { value: "dog",    label: "Dog" },
  { value: "cat",    label: "Cat" },
  { value: "bird",   label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other",  label: "Other" },
];

export default function PetServiceForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  const store    = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category    = store.category;
  const subcategory = store.subcategory;

  const name                = store.name ?? "";
  const description         = store.description ?? "";
  const serviceType         = (store as any).serviceType ?? "";
  const petType             = (store as any).petType ?? "";
  const experience          = (store as any).experience ?? "";
  const availability        = (store as any).availability ?? "";
  const serviceProviderName = (store as any).serviceProviderName ?? "";
  const price               = (store as any).price ?? (store as any).salePrice ?? "";
  const location            = store.location ?? {};
  const sellerInfo          = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category)    setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Services");
  }, [category, subcategory, setField]);

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const isPositive = (v: unknown) => {
    if (!v) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0;
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petserviceform:validated", { detail: { ok } }));
  };

  const scrollToFirstError = (mapped: Record<string, string>) => {
    const first = Object.keys(mapped)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};

    if (!name.trim())              mapped.name         = "Service title is required.";
    if (!serviceType)              mapped.serviceType  = "Service type is required.";
    if (!petType)                  mapped.petType      = "Pet type is required.";
    if (!availability.trim())      mapped.availability = "Availability is required.";
    if (!isPositive(price))        mapped.price        = "Valid price is required.";
    if (!location?.address?.trim()) mapped.location    = "Location is required.";
    if (!sellerInfo?.name?.trim()) mapped.sellerName   = "Contact name is required.";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    setField("serviceProviderName", serviceProviderName.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="petServiceForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Post a Pet Service</h2>

      <FormField label="Service Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Service Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="grooming">Grooming</ToggleGroupButton>
        <ToggleGroupButton value="training">Training</ToggleGroupButton>
        <ToggleGroupButton value="boarding">Boarding</ToggleGroupButton>
        <ToggleGroupButton value="walking">Walking</ToggleGroupButton>
        <ToggleGroupButton value="vet">Veterinary</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Pet Type" singleSelect value={petType ? [petType] : []} onChange={(v) => setField("petType", v[0] ?? "")}>
        <ToggleGroupButton value="dog">Dog</ToggleGroupButton>
        <ToggleGroupButton value="cat">Cat</ToggleGroupButton>
        <ToggleGroupButton value="bird">Bird</ToggleGroupButton>
        <ToggleGroupButton value="rabbit">Rabbit</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Service Provider Name" field="serviceProviderName" value={serviceProviderName} onChange={(v) => setField("serviceProviderName", v)} />
        <FormField label="Experience (years)" field="experience" type="number" value={experience} onChange={(v) => setField("experience", v)} />
        <FormField label="Availability" field="availability" value={availability} onChange={(v) => setField("availability", v)} placeholder="e.g. Mon–Fri 9am–6pm" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={`Price (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          required
        />
        <div className="space-y-1">
          <label className="text-sm font-medium">Location *</label>
          <input
            name="location"
            className="border rounded px-3 py-2 w-full"
            placeholder="City / Area"
            value={location?.address ?? ""}
            onChange={(e) => setField("location", { ...location, address: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Contact Name *</label>
            <input
              name="sellerName"
              className="border rounded px-3 py-2 w-full"
              placeholder="Your name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => setSeller("name", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone *</label>
            <input
              name="sellerPhone"
              type="tel"
              className="border rounded px-3 py-2 w-full"
              placeholder="Phone number"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => setSeller("phone", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="sellerEmail"
              type="email"
              className="border rounded px-3 py-2 w-full"
              placeholder="Email address"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => setSeller("email", e.target.value)}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
