"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FreelanceContractorForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "Contractors");
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
          Freelance / Contractor Service
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
            placeholder="Contractors"
            required
          />
        </div>

        {/* Service Title */}
        <FormField
          label="Service Title"
          field="name"
          placeholder="e.g., Web Developer, Graphic Designer"
          required
        />

        {/* Service Type */}
        <FormField
          label="Service Type"
          field="serviceType"
          placeholder="e.g., Web Development, Content Writing"
          required
        />

        {/* Skills */}
        <FormField
          label="Skills"
          field="skills"
          placeholder="e.g., React, SEO, Photoshop"
        />

        {/* Availability */}
        <FormField
          label="Availability"
          field="availability"
          placeholder="e.g., Full-time, Part-time, Remote"
        />

        {/* Pricing */}
        <FormField
          label="Service Price (₹)"
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="e.g., 5000"
        />

        {/* Location (Nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="e.g., Chennai or Remote"
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
          placeholder="Describe your services in detail..."
          required
        />

        {/* Contact Information */}
        {/* <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-3">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Contact Name"
              field="__ignore_seller_name__"
              value={store.sellerInfo?.name ?? ""}
              onChange={(v) =>
                setSeller("name", v as string)
              }
              placeholder="Your full name"
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
              placeholder="your@email.com"
              required
            />
          </div>

          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", v as string)
            }
            placeholder="+91 9876543210"
            required
          />
        </div> */}
      </CardContent>
    </Card>
  );
}