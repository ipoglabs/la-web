"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { useCountryConfig } from "@/hooks/useCountryConfig";
import { toast } from "sonner";

export default function BankingFinancialForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { currency } = useCountryConfig();

  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const category = store.category;
  const subcategory = store.subcategory;

  const name = store.name ?? "";
  const dealType = store.dealType ?? "";
  const institutionName = store.institutionName ?? "";
  const description = store.description ?? "";
  const interestRate = store.interestRate ?? "";
  const tenure = store.tenure ?? "";
  const minAmount = store.minAmount ?? "";
  const maxAmount = store.maxAmount ?? "";
  const eligibility = store.eligibility ?? "";
  const documents = store.documents ?? "";
  const validUntil = store.validUntil ?? "";

  const sellerInfo = store.sellerInfo ?? {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default category/subcategory
  useEffect(() => {
    if (!category) setField("category", "Business");
    if (!subcategory) setField("subcategory", "Banking & Finance");
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

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mapped: Record<string, string> = {};

    if (!name.trim()) mapped.name = "Offer title required";
    if (!description.trim()) mapped.description = "Description required";
    if (!sellerInfo?.name?.trim())
      mapped.sellerName = "Contact name required";
    if (!sellerInfo?.phone?.trim())
      mapped.sellerPhone = "Phone required";

    if (minAmount && !isPositive(minAmount))
      mapped.minAmount = "Invalid minimum amount";

    if (maxAmount && !isPositive(maxAmount))
      mapped.maxAmount = "Invalid maximum amount";

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
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold">Banking & Financial Deals</h2>

      {/* Offer Title */}
      <FormField
        label="Deal / Offer Title"
        field="name"
        value={name}
        onChange={(v) => setField("name", v)}
        required
      />

      <ToggleButtonGroup title="Deal Type" singleSelect value={dealType ? [dealType] : []} onChange={(v) => setField("dealType", v[0] ?? "")}>
        <ToggleGroupButton value="loan">Loan</ToggleGroupButton>
        <ToggleGroupButton value="credit-card">Credit Card</ToggleGroupButton>
        <ToggleGroupButton value="investment">Investment</ToggleGroupButton>
        <ToggleGroupButton value="insurance">Insurance</ToggleGroupButton>
        <ToggleGroupButton value="savings">Savings / Deposit</ToggleGroupButton>
        <ToggleGroupButton value="other">Other</ToggleGroupButton>
      </ToggleButtonGroup>

      {/* Institution */}
      <FormField
        label="Bank / Financial Institution"
        field="institutionName"
        value={institutionName}
        onChange={(v) => setField("institutionName", v)}
      />

      {/* Description */}
      <FormField
        label="Description"
        field="description"
        type="textarea"
        value={description}
        onChange={(v) => setField("description", v)}
        required
      />

      {/* Financial Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Interest Rate / Returns"
          field="interestRate"
          value={interestRate}
          onChange={(v) => setField("interestRate", v)}
        />
        <FormField
          label="Tenure / Duration"
          field="tenure"
          value={tenure}
          onChange={(v) => setField("tenure", v)}
        />
      </div>

      {/* Amount Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={`Minimum Amount (${currency})`}
          field="minAmount"
          type="number"
          value={minAmount}
          onChange={(v) => setField("minAmount", v)}
        />
        <FormField
          label={`Maximum Amount (${currency})`}
          field="maxAmount"
          type="number"
          value={maxAmount}
          onChange={(v) => setField("maxAmount", v)}
        />
      </div>

      {/* Eligibility & Docs */}
      <FormField
        label="Eligibility Criteria"
        field="eligibility"
        type="textarea"
        value={eligibility}
        onChange={(v) => setField("eligibility", v)}
      />

      <FormField
        label="Required Documents"
        field="documents"
        type="textarea"
        value={documents}
        onChange={(v) => setField("documents", v)}
      />

      {/* Valid Until */}
      <FormField
        label="Valid Until"
        field="validUntil"
        type="date"
        value={validUntil}
        onChange={(v) => setField("validUntil", v)}
      />

      <button type="submit" className="sr-only" />
    </form>
  );
}