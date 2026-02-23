"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function BusinessSaleLeaseForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "sale_lease");
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
          Business Sale / Lease
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
            placeholder="Sale / Lease"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Business Title"
          field="name"
          placeholder="e.g., Restaurant for Sale in Chennai"
          required
        />

        {/* Ownership (matches config) */}
        <SelectField
          label="Ownership"
          field="ownership"
          placeholder="Select ownership type"
          options={[
            { value: "sole-proprietor", label: "Sole Proprietor" },
            { value: "partnership", label: "Partnership" },
            { value: "private-limited", label: "Private Limited" },
            { value: "llp", label: "LLP" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Price (matches config key) */}
        <FormField
          label="Asking Price (₹)"
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="Enter asking price"
          required
        />

        {/* Location (nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="Enter business location"
          value={store.location?.address ?? ""}
          onChange={(v) =>
            setLocationAddress((v as string) || "")
          }
          required
        />

        {/* Description */}
        <FormField
          label="Business Description"
          field="description"
          type="textarea"
          placeholder="Provide full details about the business, revenue, assets, lease terms, etc."
          required
        />

        {/* Contact Section */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Contact Information
          </h3>

          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", v as string)
            }
            required
          />

          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", v as string)
            }
            required
          />

          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", v as string)
            }
            required
          />
        </div> */}
        
      </CardContent>
    </Card>
  );
}