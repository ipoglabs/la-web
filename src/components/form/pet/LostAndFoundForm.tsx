"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function PetLostFoundForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store    = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const subcategory     = store.subcategory;
  const reportType      = (store as any).reportType ?? "lost";
  const name            = store.name ?? "";
  const description     = store.description ?? "";
  const petType         = (store as any).petType ?? "";
  const breed           = (store as any).breed ?? "";
  const color           = (store as any).color ?? "";
  const age             = (store as any).age ?? "";
  const lfDate          = (store as any).lfDate ?? "";
  const lastSeenLocation = (store as any).lastSeenLocation ?? store.location?.address ?? "";
  const sellerInfo      = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setField("category", "Pets");
    if (!subcategory) setField("subcategory", "Lost & Found");
    if (!reportType)  setField("reportType", "lost");
  }, [setField, subcategory, reportType]);

  const setSeller = (k: "name" | "email" | "phone", v: string) => {
    setField("sellerInfo", { ...(sellerInfo || {}), [k]: v });
  };

  const dispatchValidated = (ok: boolean) => {
    window.dispatchEvent(new CustomEvent("postform:validated", { detail: { ok } }));
    window.dispatchEvent(new CustomEvent("petlostfoundform:validated", { detail: { ok } }));
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

    if (!reportType)               mapped.reportType       = "Report type is required.";
    if (!name.trim())              mapped.name             = "Title is required.";
    if (!petType.trim())           mapped.petType          = "Pet type is required.";
    if (!lfDate)                   mapped.lfDate           = "Date is required.";
    if (!lastSeenLocation.trim())  mapped.lastSeenLocation = "Location is required.";
    if (!sellerInfo?.name?.trim()) mapped.sellerName       = "Contact name is required.";
    if (!sellerInfo?.phone?.trim()) mapped.sellerPhone     = "Phone is required.";

    setErrors(mapped);
    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix the highlighted fields.");
      dispatchValidated(false);
      return;
    }

    setField("name", name.trim());
    setField("description", description.trim());
    setField("lfDate", lfDate);
    setField("lastSeenLocation", lastSeenLocation.trim());
    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      id="petLostFoundForm"
      data-post-form="true"
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center">Pet Lost &amp; Found</h2>

      <ToggleButtonGroup title="Report Type" singleSelect value={reportType ? [reportType] : []} onChange={(v) => setField("reportType", v[0] ?? "")}>
        <ToggleGroupButton value="lost">Lost</ToggleGroupButton>
        <ToggleGroupButton value="found">Found</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField label="Title" field="name" value={name} onChange={(v) => setField("name", v)} required />

      <FormField label="Description" field="description" type="textarea" value={description} onChange={(v) => setField("description", v)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Pet Type" field="petType" value={petType} onChange={(v) => setField("petType", v)} required />
        <FormField label="Breed" field="breed" value={breed} onChange={(v) => setField("breed", v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Color" field="color" value={color} onChange={(v) => setField("color", v)} />
        <FormField label="Age" field="age" value={age} onChange={(v) => setField("age", v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Last Seen / Found Date" field="lfDate" type="date" value={lfDate} onChange={(v) => setField("lfDate", v)} required />
        <FormField label="Last Seen Location" field="lastSeenLocation" value={lastSeenLocation} onChange={(v) => setField("lastSeenLocation", v)} required />
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
