// src/app/components/form/pets/LostFoundForm.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { toast } from "sonner";

export default function PetLostFoundForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const subcategory = store.subcategory;
  const reportType = (store as any).reportType ?? "lost";
  const name = store.name ?? "";
  const description = store.description ?? "";
  const petType = (store as any).petType ?? "";
  const breed = (store as any).breed ?? "";
  const color = (store as any).color ?? "";
  const age = (store as any).age ?? "";
  const lfDate = (store as any).lfDate ?? "";
  const lastSeenLocation =
    (store as any).lastSeenLocation ??
    store.location?.address ??
    "";

  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Lost & Found");
    if (!reportType) setField("reportType", "lost");
  }, [setField, subcategory, reportType]);

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

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!reportType)
      mapped.reportType = "Report type required";

    if (!name.trim())
      mapped.name = "Title required";

    if (!petType.trim())
      mapped.petType = "Pet type required";

    if (!lfDate)
      mapped.lfDate = "Date required";

    if (!lastSeenLocation.trim())
      mapped.lastSeenLocation = "Location required";

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

    // persist cleaned values
    setField("name", name.trim());
    setField("description", description.trim());
    setField("lfDate", lfDate);
    setField("lastSeenLocation", lastSeenLocation.trim());

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
        Pet Lost &amp; Found
      </h2>

      {/* Report Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Report Type"
          field="reportType"
          value={reportType}
          onChange={(v) => setField("reportType", v)}
          options={[
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ]}
          required
        />

        <SelectField
          label="Post Type"
          field="subcategory"
          value={subcategory ?? "Lost & Found"}
          onChange={(v) => setField("subcategory", v)}
          options={[
            { value: "Lost & Found", label: "Lost & Found" },
          ]}
          required
        />
      </div>

      {/* Title / Description */}
      <FormField
        label="Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
      />

      {/* Pet Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Pet Type"
          field="petType"
          value={petType}
          onChange={(v) => setField("petType", v)}
          required
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
          label="Color"
          field="color"
          value={color}
          onChange={(v) => setField("color", v)}
        />

        <FormField
          label="Age"
          field="age"
          value={age}
          onChange={(v) => setField("age", v)}
        />
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Last Seen / Found Date"
          field="lfDate"
          type="date"
          value={lfDate}
          onChange={(v) => setField("lfDate", v)}
          required
        />

        <FormField
          label="Last Seen Location"
          field="lastSeenLocation"
          value={lastSeenLocation}
          onChange={(v) => setField("lastSeenLocation", v)}
          required
        />
      </div>

      {/* Contact Info */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Name"
          value={sellerInfo?.name ?? ""}
          onChange={(e) => setSeller("name", e.target.value)}
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
        <input
          name="sellerEmail"
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={sellerInfo?.email ?? ""}
          onChange={(e) => setSeller("email", e.target.value)}
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}