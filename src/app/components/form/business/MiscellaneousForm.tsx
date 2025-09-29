'use client'

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BusinessMiscellaneousForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Miscellaneous");
  }, [store.category, store.subcategory, setField]);

  // Seller info helper
  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Business Miscellaneous Details</h2>

        {/* Title & Description */}
        <FormField label="Title" field="title" placeholder="Enter listing title" required />
        <FormField label="Description" field="description" type="textarea" placeholder="Enter details about your listing" required />

        {/* Category & Location */}
        <FormField label="Category" field="subcategory" placeholder="e.g., Services, Supplies, Misc." />
        <FormField label="Location" field="location" placeholder="Enter city or address" />

        {/* Price */}
        <FormField label="Price (if applicable)" field="price" placeholder="Enter price or leave blank" />

        {/* Contact Info */}
        <FormField
          label="Contact Name"
          field="__ignore_seller_name__"
          value={store.sellerInfo?.name ?? ""}
          onChange={(v) => setSeller("name", v as string)}
          placeholder="Enter your name"
        />
        <FormField
          label="Phone"
          field="__ignore_seller_phone__"
          value={store.sellerInfo?.phone ?? ""}
          onChange={(v) => setSeller("phone", v as string)}
          placeholder="Enter phone number"
        />
        <FormField
          label="Email"
          field="__ignore_seller_email__"
          value={store.sellerInfo?.email ?? ""}
          onChange={(v) => setSeller("email", v as string)}
          placeholder="Enter email address"
        />
      </CardContent>
    </Card>
  );
}
