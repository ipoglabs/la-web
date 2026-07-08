"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function PetWantedForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store    = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category    = store.category;
  const subcategory = store.subcategory;

  const name             = store.name ?? "";
  const description      = store.description ?? "";
  const wantedPetType    = (store as any).wantedPetType ?? "";
  const breedPreference  = (store as any).breedPreference ?? "";
  const agePreference    = (store as any).agePreference ?? "";
  const genderPreference = (store as any).genderPreference ?? "";
  const sizePreference   = (store as any).sizePreference ?? "";
  const price            = (store as any).price ?? (store as any).budget ?? store.salePrice ?? "";
  const preferredLocations = (store as any).preferred_locations ?? [];
  const location         = store.location ?? {};
  const sellerInfo       = store.sellerInfo ?? {};

  const [locationsText, setLocationsText] = useState(
    Array.isArray(preferredLocations) ? preferredLocations.join(", ") : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category)    setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Wanted");
  }, [category, subcategory, setField]);

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v);
  };

  const commitPreferredLocations = () => {
    const arr = locationsText.split(",").map((s) => s.trim()).filter(Boolean);
    setField("preferred_locations", arr);
  };

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petwantedform:validated", { detail: { ok } }));
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

    if (!name.trim())              mapped.name         = "Title is required.";
    if (!wantedPetType)            mapped.wantedPetType = "Pet type is required.";
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
    commitPreferredLocations();
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="petWantedForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Pet Wanted</h2>

      <FormField label="Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Additional Information" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <ToggleButtonGroup title="Type of Pet Wanted" singleSelect value={wantedPetType ? [wantedPetType] : []} onChange={(v) => setField("wantedPetType", v[0] ?? "")}>
        <ToggleGroupButton value="dog">Dog</ToggleGroupButton>
        <ToggleGroupButton value="cat">Cat</ToggleGroupButton>
        <ToggleGroupButton value="bird">Bird</ToggleGroupButton>
        <ToggleGroupButton value="rabbit">Rabbit</ToggleGroupButton>
        <ToggleGroupButton value="others">Others</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Breed Preference" field="breedPreference" value={breedPreference} onChange={(v) => setField("breedPreference", v)} />

      <FormField label="Preferred Age" field="agePreference" value={agePreference} onChange={(v) => setField("agePreference", v)} placeholder="e.g. Puppy / Adult" />

      <ToggleButtonGroup title="Gender Preference" singleSelect value={genderPreference ? [genderPreference] : []} onChange={(v) => setField("genderPreference", v[0] ?? "")}>
        <ToggleGroupButton value="male">Male</ToggleGroupButton>
        <ToggleGroupButton value="female">Female</ToggleGroupButton>
        <ToggleGroupButton value="any">Any</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Size Preference" singleSelect value={sizePreference ? [sizePreference] : []} onChange={(v) => setField("sizePreference", v[0] ?? "")}>
        <ToggleGroupButton value="small">Small</ToggleGroupButton>
        <ToggleGroupButton value="medium">Medium</ToggleGroupButton>
        <ToggleGroupButton value="large">Large</ToggleGroupButton>
        <ToggleGroupButton value="any">Any</ToggleGroupButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Preferred Locations</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Comma-separated locations"
            value={locationsText}
            onChange={(e) => setLocationsText(e.target.value)}
            onBlur={commitPreferredLocations}
          />
        </div>
        <FormField
          label={`Budget (${currency})`}
          field="price"
          type="number"
          value={price}
          onChange={(v) => handlePrice(String(v))}
          placeholder="Enter max budget"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Primary Location</label>
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
