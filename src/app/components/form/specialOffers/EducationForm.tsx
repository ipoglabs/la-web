"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function EducationLearningForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const institutionName = store.institutionName ?? "";
  const educationCategory = store.educationCategory ?? "";
  const mode = store.mode ?? "";
  const duration = store.duration ?? "";
  const price = store.price ?? store.salePrice ?? "";
  const description = store.description ?? "";
  const location = store.location ?? {};
  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Services");
    if (!subcategory)
      setField("subcategory", "Education & Learning");
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

    if (!name.trim()) mapped.name = "Course title required";
    if (price && !isPositive(price))
      mapped.price = "Invalid fee amount";
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
      <h2 className="text-2xl font-bold">Education & Learning</h2>

      {/* Course Title */}
      <FormField
        label="Course / Program Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      {/* Institution */}
      <FormField
        label="Institution / Provider"
        field="institutionName"
        value={institutionName}
        onChange={(v) => setField("institutionName", v)}
      />

      <ToggleButtonGroup title="Education Category" singleSelect value={educationCategory ? [educationCategory] : []} onChange={(v) => setField("educationCategory", v[0] ?? "")}>
        <ToggleGroupButton value="school">School / Academic</ToggleGroupButton>
        <ToggleGroupButton value="college">College / University</ToggleGroupButton>
        <ToggleGroupButton value="vocational">Vocational / Skill-based</ToggleGroupButton>
        <ToggleGroupButton value="online-course">Online Course</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup title="Mode" singleSelect value={mode ? [mode] : []} onChange={(v) => setField("mode", v[0] ?? "")}>
        <ToggleGroupButton value="online">Online</ToggleGroupButton>
        <ToggleGroupButton value="offline">Offline</ToggleGroupButton>
        <ToggleGroupButton value="hybrid">Hybrid</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Duration */}
      <FormField
        label="Duration"
        field="duration"
        value={duration}
        onChange={(v) => setField("duration", v)}
      />

      {/* Fees */}
      <FormField
        label={`Fees / Tuition (${currency})`}
        field="price"
        type="number"
        value={price}
        onChange={(v) => handlePrice(String(v))}
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
      {/* <FormField
        label="Location"
        field="__ignore_location__"
        value={location?.address ?? ""}
        onChange={(v) => setLoc((v as string) || "")}
      /> */}

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