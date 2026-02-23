"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PetAdoptionForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // preset category/subcategory
  useEffect(() => {
    setField("category", "Pets");
    setField("subcategory", "Adoption");
  }, [setField]);

  const petName = (store as any).petName ?? store.name ?? "";
  const petType = (store as any).petType ?? "";
  const breed = (store as any).breed ?? "";
  const ageText = (store as any).ageText ?? "";
  const gender = (store as any).gender ?? "";
  const vaccination = (store as any).vaccination ?? "";
  const size = (store as any).size ?? "";
  const price = (store as any).price ?? store.salePrice ?? "";
  const description = store.description ?? "";

  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const el = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  const handlePrice = (v: string) => {
    setField("price", v);
    setField("salePrice", v); // preview/backend safe
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

    if (!petName.trim()) mapped.petName = "Pet name required";
    if (!petType) mapped.petType = "Pet type required";
    if (!isPositive(price)) mapped.price = "Invalid adoption fee";

    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    if (!location?.address?.trim())
      mapped.location = "Location required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // persist cleaned values
    setField("petName", petName.trim());
    setField("name", petName.trim()); // optional: for preview title reuse
    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">
        Post Pet for Adoption
      </h2>

      <FormField
        label="Pet Name"
        field="petName"
        value={petName}
        onChange={(v) => setField("petName", v)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Pet Type"
          field="petType"
          value={petType}
          onChange={(v) => setField("petType", v)}
          options={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
            { value: "bird", label: "Bird" },
            { value: "rabbit", label: "Rabbit" },
            { value: "other", label: "Other" },
          ]}
        />
        <FormField
          label="Breed"
          field="breed"
          value={breed}
          onChange={(v) => setField("breed", v)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Age"
          field="ageText"
          value={ageText}
          onChange={(v) => setField("ageText", v)}
        />
        <SelectField
          label="Gender"
          field="gender"
          value={gender}
          onChange={(v) => setField("gender", v)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Vaccination"
          field="vaccination"
          value={vaccination}
          onChange={(v) => setField("vaccination", v)}
          options={[
            { value: "vaccinated", label: "Vaccinated" },
            { value: "partial", label: "Partially Vaccinated" },
            { value: "not_vaccinated", label: "Not Vaccinated" },
          ]}
        />
        <FormField
          label="Size"
          field="size"
          value={size}
          onChange={(v) => setField("size", v)}
          placeholder="Small / Medium / Large"
        />
      </div>

      <FormField
        label="Adoption Fee (₹)"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
      />

      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      <input
        name="location"
        className="border rounded px-3 py-2 w-full"
        placeholder="Location"
        value={location?.address ?? ""}
        onChange={(e) => setLoc(e.target.value)}
      />

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

      <button type="submit" className="sr-only" />
    </form>
  );
}