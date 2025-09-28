"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HealthServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Health
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Health");
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
    <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post Health Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Health" required />
        </div>

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name" // map serviceTitle -> name
          placeholder="e.g., Physiotherapy, Online Yoga, Dental Checkup"
          required
        />

        <FormField
          label="Provider Name"
          field="providerName"
          placeholder="Enter provider's full name"
          required
        />

        <FormField
          label="Qualification"
          field="qualification"
          placeholder="e.g., MBBS, Physiotherapist, Certified Trainer"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Service Type"
            field="serviceType"
            placeholder="Doctor, Therapist, Trainer, Clinic"
            required
          />
          <SelectField
            label="Consultation Mode"
            field="consultationMode"
            placeholder="Select mode"
            options={[
              { value: "online", label: "Online" },
              { value: "in-person", label: "In-person" },
              { value: "both", label: "Both" },
            ]}
          />
          <FormField
            label="Consultation Fee (INR)"
            field="price" // map consultationFee -> price (numeric for INR formatting)
            type="number"
            placeholder="e.g., 600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Experience"
            field="experience"
            placeholder="e.g., 5 years"
          />
          <FormField
            label="Availability"
            field="availability"
            placeholder="e.g., Mon–Fri 9 AM – 6 PM"
          />
          {/* Location (stored at location.address) */}
          <FormField
            label="Location"
            field="__ignore_location__"
            placeholder="City, Area"
            value={store.location?.address ?? ""}
            onChange={(v) => setLoc((v as string) || "")}
            required
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Number"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Enter contact number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Enter email address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
        </div>

        {/* Description */}
        <FormField
          label="Service Description"
          field="description"
          type="textarea"
          placeholder="Write details about the service provided (modalities, session length, tools, hygiene, etc.)"
          required
        />
      </CardContent>
    </Card>
  );
}
