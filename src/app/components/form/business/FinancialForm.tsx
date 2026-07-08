"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { toast } from "sonner";

export default function FinancialServicesForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const serviceType = (store as any).serviceType ?? "";
  const companyName = (store as any).companyName ?? "";
  const licenseNumber = (store as any).licenseNumber ?? "";
  const experience = (store as any).experience ?? "";
  const pricingModel = (store as any).pricingModel ?? "";
  const description = store.description ?? "";
  const website = (store as any).website ?? "";

  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // preset category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Business");
    if (!subcategory) setField("subcategory", "Financial");
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

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Service name required";
    if (!serviceType) mapped.serviceType = "Service type required";
    if (!description.trim()) mapped.description = "Description required";
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
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">
        Financial Services Details
      </h2>

      <FormField
        label="Service Name"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <ToggleButtonGroup title="Service Type" singleSelect value={serviceType ? [serviceType] : []} onChange={(v) => setField("serviceType", v[0] ?? "")}>
        <ToggleGroupButton value="accounting">Accounting</ToggleGroupButton>
        <ToggleGroupButton value="tax">Tax Advisory</ToggleGroupButton>
        <ToggleGroupButton value="investment">Investment Services</ToggleGroupButton>
        <ToggleGroupButton value="loan">Loan &amp; Credit Services</ToggleGroupButton>
        <ToggleGroupButton value="insurance">Insurance</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Company Name"
        field="companyName"
        value={companyName}
        onChange={(v) => setField("companyName", v)}
      />

      <FormField
        label="License / Registration Number"
        field="licenseNumber"
        value={licenseNumber}
        onChange={(v) => setField("licenseNumber", v)}
      />

      <FormField
        label="Years of Experience"
        field="experience"
        value={experience}
        onChange={(v) => setField("experience", v)}
      />

      <ToggleButtonGroup title="Pricing Model" singleSelect value={pricingModel ? [pricingModel] : []} onChange={(v) => setField("pricingModel", v[0] ?? "")}>
        <ToggleGroupButton value="fixed">Fixed Fee</ToggleGroupButton>
        <ToggleGroupButton value="hourly">Hourly Rate</ToggleGroupButton>
        <ToggleGroupButton value="commission">Commission-based</ToggleGroupButton>
        <ToggleGroupButton value="custom">Custom Pricing</ToggleGroupButton>
      </ToggleButtonGroup>

      <FormField
        label="Website"
        field="website"
        value={website}
        onChange={(v) => setField("website", v)}
      />

      <FormField
        label="Service Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* Contact Section */}
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
          name="sellerPhone"
          className="border rounded px-3 py-2"
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
          required
        />
      </div> */}

      <button type="submit" className="sr-only" />
    </form>
  );
}