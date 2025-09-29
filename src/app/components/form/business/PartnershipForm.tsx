'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function PartnershipOpportunitiesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Partnership Opportunities");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Partnership Opportunity Details</h2>

        {/* Partnership Type */}
        <SelectField
          label="Partnership Type"
          field="partnershipType"
          options={[
            { value: "joint-venture", label: "Joint Venture" },
            { value: "strategic-alliance", label: "Strategic Alliance" },
            { value: "distribution", label: "Distribution Partnership" },
            { value: "franchise", label: "Franchise" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Business Info */}
        <FormField label="Business Name" field="businessName" required />
        <FormField label="Industry" field="industry" required />
        <FormField label="Location" field="location" required />

        {/* Contact Info */}
        <FormField
          label="Contact Person"
          field="__ignore_seller_name__"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", v as string)}
          required
        />
        <FormField
          label="Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          required
        />
        <FormField
          label="Email"
          field="__ignore_seller_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
          required
        />

        {/* Investment & Collaboration */}
        <FormField label="Investment Range (if applicable)" field="investment" />
        <FormField label="Collaboration Details" field="collaborationDetails" type="textarea" />
      </CardContent>
    </Card>
  );
}
