'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BusinessSaleLeaseForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Sale / Lease");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Business Sale / Lease Details</h2>

        <FormField label="Business Title" field="businessTitle" required />
        <FormField label="Business Type" field="businessType" required />

        <SelectField
          label="Transaction Type"
          field="transactionType"
          options={[
            { value: "sale", label: "For Sale" },
            { value: "lease", label: "For Lease" },
          ]}
        />

        <FormField label="Location" field="location" required />
        <FormField label="Asking Price (₹ / $)" field="askingPrice" type="number" />
        <FormField label="Annual Revenue (Optional)" field="annualRevenue" type="number" />

        {/* Lease Terms - show only if lease */}
        {store.transactionType === "lease" && (
          <FormField label="Lease Terms" field="leaseTerms" placeholder="E.g., 5 years, renewable" />
        )}

        <FormField label="Business Description" field="description" type="textarea" required />

        {/* Contact Info */}
        <FormField
          label="Contact Name"
          field="__ignore_seller_name__"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", v as string)}
          required
        />
        <FormField
          label="Contact Email"
          field="__ignore_seller_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
          required
        />
        <FormField
          label="Contact Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          required
        />
      </CardContent>
    </Card>
  );
}
