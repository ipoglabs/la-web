'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FinancialServicesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set category/subcategory defaults
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Financial Services");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Financial Services Details</h2>

        {/* Category/Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Financial Services" required />
        </div>

        {/* Service Details */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select Service Type"
          options={[
            { value: "accounting", label: "Accounting" },
            { value: "tax", label: "Tax Advisory" },
            { value: "investment", label: "Investment Services" },
            { value: "loan", label: "Loan & Credit Services" },
            { value: "insurance", label: "Insurance" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField label="Company Name" field="companyName" placeholder="Enter company name" />
        <FormField label="License / Registration Number" field="licenseNumber" placeholder="Enter license/registration number" />
        <FormField label="Years of Experience" field="experience" placeholder="e.g., 5 years" />

        <FormField label="Contact Person" field="__ignore_contact_person__"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setField("sellerInfo", { ...store.sellerInfo, name: v as string })}
          placeholder="Full Name"
        />

        <FormField label="Phone" field="__ignore_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setField("sellerInfo", { ...store.sellerInfo, phone: v as string })}
          placeholder="+91 98765 43210"
        />

        <FormField label="Email" field="__ignore_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setField("sellerInfo", { ...store.sellerInfo, email: v as string })}
          placeholder="example@email.com"
        />

        <FormField label="Website" field="website" placeholder="https://yourcompany.com" />

        <SelectField
          label="Pricing Model"
          field="pricingModel"
          placeholder="Select Pricing Model"
          options={[
            { value: "fixed", label: "Fixed Fee" },
            { value: "hourly", label: "Hourly Rate" },
            { value: "commission", label: "Commission-based" },
            { value: "custom", label: "Custom Pricing" },
          ]}
        />

        <FormField
          label="Service Description"
          field="description"
          type="textarea"
          placeholder="Describe your financial services in detail..."
        />

      </CardContent>
    </Card>
  );
}
