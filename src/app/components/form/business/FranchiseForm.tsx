'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FranchiseOpportunitiesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set category/subcategory defaults
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Franchise Opportunities");
  }, [store.category, store.subcategory, setField]);

  // Helper for seller info
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Franchise Opportunities Details</h2>

        {/* Category/Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Business" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Franchise Opportunities" required />
        </div>

        {/* Franchise Details */}
        <FormField label="Business Name" field="businessName" placeholder="Enter business name" />
        <FormField label="Industry" field="industry" placeholder="E.g., Food & Beverage, Retail, Education" />
        <FormField label="Investment Required" field="investmentRequired" placeholder="Enter investment amount" />
        <FormField label="Franchise Fee" field="franchiseFee" placeholder="Enter franchise fee" />
        <FormField label="Royalty Fee (%)" field="royaltyFee" placeholder="Enter royalty fee percentage" />
        <FormField label="Training & Support" field="trainingSupport" type="textarea" placeholder="Describe training and support offered" />
        <FormField label="Number of Existing Outlets" field="numberOfOutlets" placeholder="Enter number of outlets" />
        <FormField label="Location Availability" field="locationAvailability" placeholder="E.g., All India, Selected States, International" />
        <FormField label="Business Description" field="description" type="textarea" placeholder="Provide details about the franchise opportunity" />

        {/* Contact Info */}
        <FormField
          label="Contact Person"
          field="__ignore_seller_name__"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", v as string)}
          placeholder="Enter contact person name"
        />
        <FormField
          label="Contact Email"
          field="__ignore_seller_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
          placeholder="Enter email"
        />
        <FormField
          label="Contact Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          placeholder="Enter phone number"
        />
      </CardContent>
    </Card>
  );
}
