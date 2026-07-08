"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function PetAdoptionForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store    = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  useEffect(() => {
    setField("category", "Pets");
    setField("subcategory", "Adoption");
  }, [setField]);

  const petName    = (store as any).petName ?? store.name ?? "";
  const petType    = (store as any).petType ?? "";
  const breed      = (store as any).breed ?? "";
  const ageText    = (store as any).ageText ?? "";
  const gender     = (store as any).gender ?? "";
  const vaccination = (store as any).vaccination ?? "";
  const size       = (store as any).size ?? "";
  const price      = (store as any).price ?? store.salePrice ?? "";
  const description = store.description ?? "";
  const location   = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petadoptionform:validated", { detail: { ok } }));
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

    if (!petName.trim())           mapped.petName    = "Pet name is required.";
    if (!petType)                  mapped.petType    = "Pet type is required.";
    if (!sellerInfo?.name?.trim()) mapped.sellerName = "Contact name is required.";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone = "Phone is required.";
    if (!location?.address?.trim()) mapped.location  = "Location is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("petName", petName.trim());
    setField("name", petName.trim());
    setField("description", description.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="petAdoptionForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Post Pet for Adoption</h2>

      <FormField label="Pet Name" field="petName" value={petName} onChange={(v) => setField("petName", v)} required />

      <ToggleButtonGroup title="Pet Type" singleSelect value={petType ? [petType] : []} onChange={(v) => setField("petType", v[0] ?? "")}>
        <ToggleGroupButton value="dog">Dog</ToggleGroupButton>
        <ToggleGroupButton value="cat">Cat</ToggleGroupButton>
        <ToggleGroupButton value="bird">Bird</ToggleGroupButton>
        <ToggleGroupButton value="rabbit">Rabbit</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Breed" field="breed" value={breed} onChange={(v) => setField("breed", v)} />

      <FormField label="Age" field="ageText" value={ageText} onChange={(v) => setField("ageText", v)} placeholder="e.g. 2 years" />

      <ToggleButtonGroup title="Gender" singleSelect value={gender ? [gender] : []} onChange={(v) => setField("gender", v[0] ?? "")}>
        <ToggleGroupButton value="male">Male</ToggleGroupButton>
        <ToggleGroupButton value="female">Female</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Vaccination" singleSelect value={vaccination ? [vaccination] : []} onChange={(v) => setField("vaccination", v[0] ?? "")}>
        <ToggleGroupButton value="vaccinated">Vaccinated</ToggleGroupButton>
        <ToggleGroupButton value="partial">Partially Vaccinated</ToggleGroupButton>
        <ToggleGroupButton value="not_vaccinated">Not Vaccinated</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Size" field="size" value={size} onChange={(v) => setField("size", v)} placeholder="Small / Medium / Large" />

      <FormField
        label={`Adoption Fee (${currency})`}
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
        placeholder="Enter amount or 0 if free"
      />

      <FormField label="Additional Information" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

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
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
