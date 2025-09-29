"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BankingFinancialForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default the category/subcategory for this form
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Banking & Finance");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested values
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Banking & Financial Deals</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Business" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Banking & Finance"
            required
          />
        </div>

        {/* Deal / Offer Title → use shared name */}
        <FormField
          label="Deal / Offer Title"
          field="name"
          placeholder="Title of the banking or financial deal"
          required
        />

        {/* Deal Type */}
        <SelectField
          label="Deal Type"
          field="dealType"
          placeholder="Select deal type"
          options={[
            { value: "loan", label: "Loan" },
            { value: "credit-card", label: "Credit Card" },
            { value: "investment", label: "Investment" },
            { value: "insurance", label: "Insurance" },
            { value: "savings", label: "Savings / Deposit" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Bank / Institution */}
        <FormField
          label="Bank / Financial Institution"
          field="institutionName"
          placeholder="Name of the bank or financial institution"
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Details about the deal or offer"
          required
        />

        {/* Financial Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Interest Rate / Returns"
            field="interestRate"
            placeholder="e.g., 8% p.a."
          />
          <FormField
            label="Tenure / Duration"
            field="tenure"
            placeholder="e.g., 5 years"
          />
        </div>

        {/* Amount Range (store numeric if possible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Minimum Amount (INR)"
            field="minAmount"
            type="number"
            placeholder="e.g., 50000"
          />
          <FormField
            label="Maximum Amount (INR)"
            field="maxAmount"
            type="number"
            placeholder="e.g., 1000000"
          />
        </div>

        {/* Eligibility & Documents */}
        <FormField
          label="Eligibility Criteria"
          field="eligibility"
          type="textarea"
          placeholder="e.g., Minimum salary ₹25,000/month, Age 21–60 years"
        />
        <FormField
          label="Required Documents"
          field="documents"
          type="textarea"
          placeholder="e.g., PAN Card, Aadhaar, Salary Slip"
        />

        {/* Valid Until */}
        <FormField label="Valid Until" field="validUntil" type="date" />


        {/* Contact Info (maps to sellerInfo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Contact person"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Email address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Phone number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
