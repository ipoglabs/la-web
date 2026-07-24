"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/components/form/fields/FormField";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

export default function TrainingOpportunitiesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const { countryConfig } = useCountryConfig();
  const currency = countryConfig.currency;

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "training");
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
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">
          Training Opportunity
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
            placeholder="Training"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Training Title"
          field="name"
          placeholder="e.g., Advanced React Workshop"
          required
        />

        {/* Service Type */}
        <FormField
          label="Training Type"
          field="serviceType"
          placeholder="e.g., Workshop, Course, Webinar"
          required
        />

        {/* Availability */}
        <FormField
          label="Availability"
          field="availability"
          placeholder="e.g., Weekends, Online, Flexible"
        />

        {/* Price */}
        <FormField
          label={`Price (${currency})`}
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="Enter price or 0 if free"
        />

        {/* Location (nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City or Online"
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
          placeholder="Describe the training, topics covered, duration, and benefits"
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
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", v as string)
            }
            required
          />

          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", v as string)
            }
          />
        </div> */}
      </CardContent>
    </Card>
  );
}