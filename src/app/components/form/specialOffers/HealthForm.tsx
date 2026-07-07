"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function HealthWellnessForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const providerName = store.providerName ?? "";
  const wellnessCategory = store.wellnessCategory ?? "";
  const serviceType = store.serviceType ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const duration = store.duration ?? "";
  const availability = store.availability ?? "";
  const certifications = store.certifications ?? "";
  const experience = store.experience ?? "";
  const website = store.website ?? "";
  const languages = store.languages ?? "";
  const description = store.description ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Services");
    if (!subcategory) setField("subcategory", "Health & Wellness");
  }, [category, subcategory, setField]);

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
    if (price && !isPositive(price))
      mapped.price = "Invalid price amount";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    // Clean persist
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
      className="space-y-6 max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">Health & Wellness Service</h2>

      {/* Service Name */}
      <FormField
        label="Service Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Provider */}
      <FormField
        label="Provider Name"
        field="providerName"
        value={providerName}
        onChange={(v) => setField("providerName", v)}
      />

      <ToggleButtonGroup title="Category" singleSelect value={wellnessCategory ? [wellnessCategory] : []} onChange={(v) => setField("wellnessCategory", v[0] ?? "")}>
        <ToggleGroupButton value="fitness">Fitness</ToggleGroupButton>
        <ToggleGroupButton value="nutrition">Nutrition</ToggleGroupButton>
        <ToggleGroupButton value="mental-health">Mental Health</ToggleGroupButton>
        <ToggleGroupButton value="wellness-products">Wellness Products</ToggleGroupButton>
        <ToggleGroupButton value="therapy">Therapy / Counseling</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="online">Online</ToggleGroupButton>
        <ToggleGroupButton value="offline">Offline</ToggleGroupButton>
        <ToggleGroupButton value="both">Both</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Price */}
      <FormField
        label="Price / Fees"
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
      />

      {/* Duration */}
      <FormField
        label="Duration"
        field="duration"
        value={duration}
        onChange={(v) => setField("duration", v)}
      />

      {/* Availability */}
      <FormField
        label="Availability / Schedule"
        field="availability"
        value={availability}
        onChange={(v) => setField("availability", v)}
      />

      {/* Certifications */}
      <FormField
        label="Certifications / Qualifications"
        field="certifications"
        value={certifications}
        onChange={(v) => setField("certifications", v)}
      />

      {/* Experience */}
      <FormField
        label="Experience"
        field="experience"
        value={experience}
        onChange={(v) => setField("experience", v)}
      />

      {/* Website */}
      <FormField
        label="Website / Booking Link"
        field="website"
        type="url"
        value={website}
        onChange={(v) => setField("website", v)}
      />

      {/* Languages */}
      <FormField
        label="Languages Supported"
        field="languages"
        value={languages}
        onChange={(v) => setField("languages", v)}
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Location */}
      <FormField
        label="Location"
        field="sellerLocation"
        value={location?.address ?? ""}
        onChange={(v) => setLoc((v as string) || "")}
      />

      {/* Contact */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Contact Name"
          field="sellerName"
          value={sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", (v as string) || "")}
          required
        />
        <FormField
          label="Contact Email"
          field="sellerEmail"
          type="email"
          value={sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", (v as string) || "")}
        />
        <FormField
          label="Contact Phone"
          field="sellerPhone"
          type="tel"
          value={sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", (v as string) || "")}
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}