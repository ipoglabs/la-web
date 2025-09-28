"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FoodServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Food
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Food");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested fields
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  // Optionally keep dietary options as a simple comma-separated string.
  // If you prefer an array in the store, split/join here.
  const dietaryValue = (store.dietaryOptions as string) ?? "";

  return (
    <Card className="max-w-3xl mx-auto my-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post Food Service</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Food" required />
        </div>

        {/* Basic */}
        <FormField
          label="Service Title"
          field="name"
          placeholder="e.g., Home-cooked Tiffin Service"
          required
        />

        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select service type"
          options={[
            { value: "home-cooked", label: "Home Cooked" },
            { value: "tiffin", label: "Tiffin Service" },
            { value: "catering", label: "Catering" },
            { value: "restaurant", label: "Restaurant Service" },
            { value: "cloud-kitchen", label: "Cloud Kitchen" },
          ]}
        />

        <FormField
          label="Cuisine Type"
          field="cuisineType"
          placeholder="e.g., Indian, Chinese, Italian"
        />

        <FormField
          label="Dietary Options"
          field="dietaryOptions"
          placeholder="e.g., Vegetarian, Vegan, Gluten-Free"
          // keep as string; if you want an array, split on commas here and setField with an array
        />

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Price / Range"
            field="price"
            type="number"
            placeholder="e.g., 150 per meal"
          />
          <FormField
            label="Location"
            field="__ignore_location__"
            placeholder="e.g., Chennai, TN"
            value={store.location?.address ?? ""}
            onChange={(v) => setLoc((v as string) || "")}
          />
          <SelectField
            label="Delivery Available"
            field="deliveryAvailable"
            placeholder="Select option"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </div>

        {/* Description */}
        <FormField
          label="Service Description"
          field="description"
          type="textarea"
          placeholder="Describe your service (menu, hygiene, packaging, delivery area, timings)…"
        />

        {/* Contact Info (seller_info) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your full name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="example@email.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
