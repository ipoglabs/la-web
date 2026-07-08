"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { toast } from "sonner";

export default function FranchiseOpportunitiesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const businessName = (store as any).businessName ?? "";
  const industry = (store as any).industry ?? "";
  const investmentRequired = (store as any).investmentRequired ?? "";
  const franchiseFee = (store as any).franchiseFee ?? "";
  const royaltyFee = (store as any).royaltyFee ?? "";
  const trainingSupport = (store as any).trainingSupport ?? "";
  const numberOfOutlets = (store as any).numberOfOutlets ?? "";
  const locationAvailability = (store as any).locationAvailability ?? "";
  const description = store.description ?? "";

  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Business");
    if (!subcategory) setField("subcategory", "Franchise");
  }, [category, subcategory, setField]);

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

  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!businessName.trim())
      mapped.businessName = "Business name required";
    if (!industry.trim())
      mapped.industry = "Industry required";
    if (!investmentRequired.trim())
      mapped.investmentRequired = "Investment amount required";
    if (!description.trim())
      mapped.description = "Description required";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact person required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";
    if (!sellerInfo?.email?.trim())
      mapped.sellerEmail = "Email required";

    setErrors(mapped);

    if (Object.keys(mapped).length > 0) {
      scrollToFirstError(mapped);
      toast.error("Please fix highlighted fields");
      dispatchValidated(false);
      return;
    }

    setField("description", description.trim());

    setErrors({});
    dispatchValidated(true);
  };

  return (
    <form
      ref={formRef}
      data-post-form="true"
      onSubmit={onSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">
        Franchise Opportunities Details
      </h2>

      <FormField
        label="Business Name"
        field="businessName"
        value={businessName}
        onChange={(v) => setField("businessName", v)}
        required
      />

      <FormField
        label="Industry"
        field="industry"
        value={industry}
        onChange={(v) => setField("industry", v)}
        required
      />

      <FormField
        label="Investment Required"
        field="investmentRequired"
        value={investmentRequired}
        onChange={(v) => setField("investmentRequired", v)}
        required
      />

      <FormField
        label="Franchise Fee"
        field="franchiseFee"
        value={franchiseFee}
        onChange={(v) => setField("franchiseFee", v)}
      />

      <FormField
        label="Royalty Fee (%)"
        field="royaltyFee"
        value={royaltyFee}
        onChange={(v) => setField("royaltyFee", v)}
      />

      <FormField
        label="Training & Support"
        field="trainingSupport"
        type="textarea"
        value={trainingSupport}
        onChange={(v) => setField("trainingSupport", v)}
      />

      <FormField
        label="Number of Existing Outlets"
        field="numberOfOutlets"
        value={numberOfOutlets}
        onChange={(v) => setField("numberOfOutlets", v)}
      />

      {/* <FormField
        label="Location Availability"
        field="locationAvailability"
        value={locationAvailability}
        onChange={(v) => setField("locationAvailability", v)}
      /> */}

      <FormField
        label="Business Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
        <input
          name="sellerName"
          className="border rounded px-3 py-2"
          placeholder="Contact Person"
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
          placeholder="Phone"
          value={sellerInfo?.phone ?? ""}
          onChange={(e) => setSeller("phone", e.target.value)}
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}