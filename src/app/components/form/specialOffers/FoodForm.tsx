"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function FoodDiningForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default category/subcategory for this form
  React.useEffect(() => {
    if (!store.category) setField("category", "Community & Events");
    if (!store.subcategory) setField("subcategory", "Food & Dining");
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
        <h2 className="text-2xl font-bold">Food & Dining Service</h2>

        {/* Category / Subcategory (kept visible & editable for consistency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Community & Events" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Food & Dining" required />
        </div>

        {/* Service / Restaurant Name → shared "name" */}
        <FormField
          label="Service / Restaurant Name"
          field="name"
          placeholder="Name of the restaurant or food service"
          required
        />

        {/* Internal Category */}
        <SelectField
          label="Category"
          field="foodCategory"
          placeholder="Select Category"
          options={[
            { value: "restaurant", label: "Restaurant" },
            { value: "cafe", label: "Cafe" },
            { value: "delivery", label: "Food Delivery" },
            { value: "catering", label: "Catering" },
            { value: "streetfood", label: "Street Food" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Details about the food, service, or ambiance"
        />

        {/* Location (stored at location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City, Area, or Address"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Price Range */}
        <FormField
          label="Price Range"
          field="priceRange"
          placeholder="e.g. ₹200 - ₹500 per person"
        />

        {/* Cuisine Type */}
        <FormField
          label="Cuisine Type"
          field="cuisineType"
          placeholder="e.g. Italian, Chinese, Indian"
        />

        {/* Opening Hours */}
        <FormField
          label="Opening Hours"
          field="openingHours"
          placeholder="e.g. 10 AM - 11 PM"
        />

        {/* Delivery Option */}
        <SelectField
          label="Delivery Option"
          field="deliveryOption"
          placeholder="Select Option"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "thirdparty", label: "Available via Swiggy / Zomato" },
          ]}
        />

        {/* Website */}
        <FormField
          label="Website"
          field="website"
          type="url"
          placeholder="https://restaurant.com"
        />

        {/* Menu Link */}
        <FormField
          label="Menu Link (optional)"
          field="menuLink"
          type="url"
          placeholder="https://restaurant.com/menu"
        />

        {/* Average Rating */}
        <FormField
          label="Average Rating"
          field="averageRating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="e.g. 4.5"
        />

        {/* Contact Info (sellerInfo) */}
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
