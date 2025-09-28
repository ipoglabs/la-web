"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function HomeServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Home
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Home");
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
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Post Home Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Home" required />
        </div>

        {/* Service Type */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select Service Type"
          options={[
            { value: "cleaning", label: "Cleaning" },
            { value: "plumbing", label: "Plumbing" },
            { value: "electrical", label: "Electrical" },
            { value: "carpentry", label: "Carpentry" },
            { value: "pest-control", label: "Pest Control" },
            { value: "gardening", label: "Gardening" },
            { value: "others", label: "Others" },
          ]}
        />

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name" // map serviceTitle -> name
          placeholder="e.g., Professional Home Cleaning Service"
          required
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe your service in detail"
          required
        />

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Availability"
            field="availability"
            placeholder="e.g., Weekdays 9 AM – 6 PM"
          />
          <FormField
            label="Experience"
            field="experience"
            placeholder="e.g., 5 years in plumbing services"
          />
          <FormField
            label="Service Charge (INR)"
            field="price"        // map serviceCharge -> price (numeric for INR formatting)
            type="number"
            placeholder="e.g., 500 per visit"
          />
        </div>

        {/* Location (stored at location.address) */}
        <FormField
          label="Service Location"
          field="__ignore_location__"
          placeholder="City / Area"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Contact Info → sellerInfo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Enter Your Name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Enter Phone Number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Enter Email Address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
        </div>

        {/* No local submit button — user proceeds via your global Preview flow */}
      </CardContent>
    </Card>
  );
}
