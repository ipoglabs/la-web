"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import { useCountryConfig } from "@/hooks/useCountryConfig";

export default function BusinessMiscellaneousForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const { currency } = useCountryConfig();

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "misc");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (key: "name" | "phone" | "email", value?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [key]: value ?? "" });
  };

  const setLocationAddress = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">
          Business Miscellaneous Listing
        </h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            field="category"
            placeholder="Business"
            required
          />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Miscellaneous"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Listing Title"
          field="name"
          placeholder="Enter listing title"
          required
        />

        {/* Service Type (from serviceCommon spec) */}
        <FormField
          label="Service Type"
          field="serviceType"
          placeholder="Enter service type"
        />

        {/* Availability */}
        <FormField
          label="Availability"
          field="availability"
          placeholder="e.g., Weekdays, Full-time, On-demand"
        />

        {/* Price */}
        <FormField
          label={`Price (${currency})`}
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="Enter price (optional)"
        />

        {/* Location (Nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="Enter city or address"
          value={store.location?.address ?? ""}
          onChange={(v) =>
            setLocationAddress((v as string) || "")
          }
          required
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Enter details about your listing"
          required
        />

        {/* Contact Info */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Contact Information
          </h3>

          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", v as string)}
            placeholder="Enter your name"
            required
          />

          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", v as string)}
            placeholder="Enter phone number"
            required
          />

          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", v as string)}
            placeholder="Enter email address"
            required
          />
        </div> */}
      </CardContent>
    </Card>
  );
}