"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HealthWellnessForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default category/subcategory for this form
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Health & Wellness");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Health & Wellness Service</h2>

        {/* Category / Subcategory (kept editable for transparency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Health & Wellness" required />
        </div>

        {/* Service Name → name */}
        <FormField
          label="Service Name"
          field="name"
          placeholder="e.g. Yoga Classes, Nutrition Consultation"
          required
        />

        {/* Provider Name */}
        <FormField
          label="Provider Name"
          field="providerName"
          placeholder="Organization or Individual Name"
        />

        {/* High-level Category (fitness/nutrition/etc.) */}
        <SelectField
          label="Category"
          field="wellnessCategory"
          placeholder="Select Category"
          options={[
            { value: "fitness", label: "Fitness" },
            { value: "nutrition", label: "Nutrition" },
            { value: "mental-health", label: "Mental Health" },
            { value: "wellness-products", label: "Wellness Products" },
            { value: "therapy", label: "Therapy / Counseling" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Service Type (online/offline/both) */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select Service Type"
          options={[
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
            { value: "both", label: "Both" },
          ]}
        />

        {/* Price / Fees (numeric for consistent currency formatting in preview) */}
        <FormField
          label="Price / Fees"
          field="price"
          type="number"
          placeholder="e.g. 500 (per session) or 3000 (per month)"
        />

        {/* Duration */}
        <FormField
          label="Duration"
          field="duration"
          placeholder="e.g. 1 hour session, 3 months program"
        />

        {/* Availability */}
        <FormField
          label="Availability / Schedule"
          field="availability"
          placeholder="e.g. Mon–Fri, 9 AM – 6 PM"
        />

        {/* Certifications */}
        <FormField
          label="Certifications / Qualifications"
          field="certifications"
          placeholder="e.g. Certified Yoga Instructor, Nutritionist"
        />

        {/* Experience */}
        <FormField
          label="Experience"
          field="experience"
          placeholder="e.g. 5 years in industry"
        />

        {/* Website / Booking */}
        <FormField
          label="Website / Booking Link"
          field="website"
          type="url"
          placeholder="https://wellness-service.com"
        />

        {/* Languages */}
        <FormField
          label="Languages Supported"
          field="languages"
          placeholder="e.g. English, Hindi"
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Details about the service"
        />

        {/* Location (stored in location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City, State or Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Contact Info → sellerInfo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Contact Person"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Email Address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Phone Number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
