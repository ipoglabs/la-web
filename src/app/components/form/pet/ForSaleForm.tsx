"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

const PET_TYPES = [
  { value: "dog",   label: "Dog" },
  { value: "cat",   label: "Cat" },
  { value: "bird",  label: "Bird" },
  { value: "fish",  label: "Fish" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other", label: "Other" },
];

const GENDER_OPTIONS   = [{ value: "male", label: "Male" }, { value: "female", label: "Female" }];
const SIZE_OPTIONS     = [{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }];
const VACCINATION_OPTIONS = [
  { value: "vaccinated",         label: "Vaccinated" },
  { value: "partially_vaccinated", label: "Partially Vaccinated" },
  { value: "not_vaccinated",     label: "Not Vaccinated" },
];
const SUBCATEGORY_OPTIONS = [
  { value: "For Sale",    label: "For Sale" },
  { value: "Adoption",   label: "Adoption" },
  { value: "Mating",     label: "Mating" },
  { value: "Lost & Found", label: "Lost & Found" },
  { value: "Accessories", label: "Accessories" },
];

export default function PetsForSaleForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const setField   = usePostFormStore((s) => s.setField);
  const subcategory = usePostFormStore((s) => s.subcategory);
  const name       = usePostFormStore((s) => s.name) ?? "";
  const description = usePostFormStore((s) => s.description) ?? "";
  const petType    = usePostFormStore((s) => (s as any).petType) ?? "";
  const breed      = usePostFormStore((s) => (s as any).breed) ?? "";
  const age        = usePostFormStore((s) => (s as any).age) ?? "";
  const gender     = usePostFormStore((s) => (s as any).gender) ?? "";
  const size       = usePostFormStore((s) => (s as any).size) ?? "";
  const vaccination = usePostFormStore((s) => (s as any).vaccination) ?? "";
  const salePrice  = usePostFormStore((s) => s.salePrice) ?? "";
  const location   = usePostFormStore((s) => s.location);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("category", "Pets");
  }, [setField]);

  const priceLabel = useMemo(
    () => String(subcategory).toLowerCase().includes("adopt")
      ? `Adoption Fee (${currency})`
      : `Price (${currency})`,
    [subcategory, currency]
  );

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petforsaleform:validated", { detail: { ok } }));
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

    if (!name.trim())              mapped.name        = "Title is required.";
    if (!petType)                  mapped.petType     = "Pet type is required.";
    if (!sellerInfo?.name?.trim()) mapped["sellerInfo.name"]  = "Contact name is required.";
    if (!sellerInfo?.phone?.trim()) mapped["sellerInfo.phone"] = "Phone is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
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
      id="petForSaleForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Post a Pet</h2>

      <ToggleButtonGroup title="Post Type" singleSelect value={subcategory ? [subcategory] : []} onChange={(v) => setField("subcategory", v[0] ?? "")}>
        <ToggleGroupButton value="For Sale">For Sale</ToggleGroupButton>
        <ToggleGroupButton value="Adoption">Adoption</ToggleGroupButton>
        <ToggleGroupButton value="Mating">Mating</ToggleGroupButton>
        <ToggleGroupButton value="Lost & Found">Lost &amp; Found</ToggleGroupButton>
        <ToggleGroupButton value="Accessories">Accessories</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Friendly Labrador Puppy"
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        placeholder="Temperament, health, diet, special needs, etc."
      />

      <ToggleButtonGroup title="Pet Type" singleSelect value={petType ? [petType] : []} onChange={(v) => setField("petType", v[0] ?? "")}>
        <ToggleGroupButton value="dog">Dog</ToggleGroupButton>
        <ToggleGroupButton value="cat">Cat</ToggleGroupButton>
        <ToggleGroupButton value="bird">Bird</ToggleGroupButton>
        <ToggleGroupButton value="fish">Fish</ToggleGroupButton>
        <ToggleGroupButton value="rabbit">Rabbit</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Breed"
        field="breed"
        value={breed}
        onChange={(v) => setField("breed", v)}
        placeholder="e.g. Labrador / Persian / Macaw"
      />

      <FormField label="Age" field="age" value={age} onChange={(v) => setField("age", v)} placeholder="e.g. 2 years" />

      <ToggleButtonGroup title="Gender" singleSelect value={gender ? [gender] : []} onChange={(v) => setField("gender", v[0] ?? "")}>
        <ToggleGroupButton value="male">Male</ToggleGroupButton>
        <ToggleGroupButton value="female">Female</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Size" singleSelect value={size ? [size] : []} onChange={(v) => setField("size", v[0] ?? "")}>
        <ToggleGroupButton value="small">Small</ToggleGroupButton>
        <ToggleGroupButton value="medium">Medium</ToggleGroupButton>
        <ToggleGroupButton value="large">Large</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Vaccination Status" singleSelect value={vaccination ? [vaccination] : []} onChange={(v) => setField("vaccination", v[0] ?? "")}>
        <ToggleGroupButton value="vaccinated">Vaccinated</ToggleGroupButton>
        <ToggleGroupButton value="partially_vaccinated">Partially Vaccinated</ToggleGroupButton>
        <ToggleGroupButton value="not_vaccinated">Not Vaccinated</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label={priceLabel}
        field="salePrice"
        type="number"
        value={salePrice ?? ""}
        onChange={(v) => setField("salePrice", v)}
        placeholder="Enter amount or leave blank"
      />

      <FormField
        label="Location"
        field="location.address"
        value={location?.address ?? ""}
        onChange={(v) => setField("location", { ...(location || {}), address: v })}
        placeholder="City, State"
        required
      />

      <div className="space-y-3 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Contact Name *</label>
            <input
              name="sellerInfo.name"
              className="border rounded px-3 py-2 w-full"
              placeholder="Owner / Foster Name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="sellerInfo.email"
              type="email"
              className="border rounded px-3 py-2 w-full"
              placeholder="Email address"
              value={sellerInfo?.email ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone *</label>
            <input
              name="sellerInfo.phone"
              type="tel"
              className="border rounded px-3 py-2 w-full"
              placeholder="Phone number"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) => setField("sellerInfo", { ...sellerInfo, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="sr-only" />
    </form>
  );
}
