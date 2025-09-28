"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function TravelServiceForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory for Services → Travel
  React.useEffect(() => {
    if (!store.category) setField("category", "Services");
    if (!store.subcategory) setField("subcategory", "Travel");
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
    <Card className="max-w-3xl mx-auto my-10 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post Travel Service</h2>

        {/* Category / Subcategory (kept visible for clarity, stored in global store) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Services" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Travel" required />
        </div>

        {/* Service Type */}
        <SelectField
          label="Service Type"
          field="serviceType"
          placeholder="Select service type"
          options={[
            { value: "tour", label: "Tour" },
            { value: "package", label: "Package" },
            { value: "guide", label: "Guide" },
            { value: "transport", label: "Transport" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Title -> name */}
        <FormField
          label="Title"
          field="name"
          placeholder="e.g., Goa Holiday Package, Manali Trip, Airport Cab"
          required
        />

        {/* Destination */}
        <FormField
          label="Destination"
          field="destination"
          placeholder="e.g., Goa, Paris, Manali"
        />

        {/* Duration + Availability + Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Duration"
            field="duration"
            placeholder="e.g., 5 Days / 4 Nights"
          />
          <FormField
            label="Availability"
            field="availability"
            placeholder="e.g., Year-round / Seasonal / Weekends"
          />
          <FormField
            label="Price (INR)"
            field="price"
            type="number"
            placeholder="e.g., 25000"
          />
        </div>

        {/* Agency Name (optional) */}
        <FormField
          label="Agency / Provider Name"
          field="agencyName"
          placeholder="Enter agency or provider name"
        />

        {/* Description */}
        <FormField
          label="Package / Service Details"
          field="description"
          type="textarea"
          placeholder="Include inclusions (hotel, flight, sightseeing), exclusions, itinerary, terms…"
          required
        />

        {/* Location (stored in location.address) */}
        <FormField
          label="Service Location"
          field="__ignore_location__"
          placeholder="City / Pickup area (or 'Online')"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Contact Info -> sellerInfo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Your name"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="you@example.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>

        {/* No local submit — user proceeds via the global Preview → Submit flow */}
      </CardContent>
    </Card>
  );
}
