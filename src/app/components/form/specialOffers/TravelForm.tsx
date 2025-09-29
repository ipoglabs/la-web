"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function TravelTourismForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default main category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "For Sale");
    if (!store.subcategory) setField("subcategory", "Travel & Tourism");
  }, [store.category, store.subcategory, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Travel & Tourism</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="For Sale" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Travel & Tourism"
            required
          />
        </div>

        {/* Tour Title */}
        <FormField
          label="Tour / Package Title"
          field="tourTitle"
          placeholder="Title of the tour or package"
          required
        />

        {/* Tour Type */}
        <SelectField
          label="Tour Type"
          field="tourType"
          placeholder="Select Tour Type"
          options={[
            { value: "domestic", label: "Domestic" },
            { value: "international", label: "International" },
            { value: "adventure", label: "Adventure" },
            { value: "cruise", label: "Cruise" },
            { value: "honeymoon", label: "Honeymoon" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Details about the tour or package"
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" field="startDate" type="date" />
          <FormField label="End Date" field="endDate" type="date" />
        </div>

        {/* Duration */}
        <FormField label="Duration" field="duration" placeholder="e.g. 5 Days / 4 Nights" />

        {/* Itinerary */}
        <FormField
          label="Itinerary / Highlights"
          field="itinerary"
          type="textarea"
          placeholder="Key attractions / day-wise plan"
        />

        {/* Inclusions */}
        <FormField
          label="Inclusions"
          field="inclusions"
          type="textarea"
          placeholder="Meals, Hotel, Transport, Guide, etc."
        />

        {/* Exclusions */}
        <FormField
          label="Exclusions"
          field="exclusions"
          type="textarea"
          placeholder="Not included in the package"
        />

        {/* Accommodation */}
        <SelectField
          label="Accommodation Type"
          field="accommodation"
          placeholder="Select Accommodation"
          options={[
            { value: "hotel", label: "Hotel" },
            { value: "resort", label: "Resort" },
            { value: "hostel", label: "Hostel" },
            { value: "camp", label: "Camp" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Transport */}
        <SelectField
          label="Transport Mode"
          field="transport"
          placeholder="Select Transport"
          options={[
            { value: "flight", label: "Flight" },
            { value: "train", label: "Train" },
            { value: "bus", label: "Bus" },
            { value: "cruise", label: "Cruise" },
            { value: "own", label: "Own Transport" },
          ]}
        />

        {/* Group Size */}
        <FormField
          label="Group Size / Capacity"
          field="groupSize"
          placeholder="e.g. Max 20 people"
        />

        {/* Booking Deadline */}
        <FormField label="Booking Deadline" field="bookingDeadline" type="date" />

        {/* Price */}
        <FormField label="Price / Package Cost" field="price" placeholder="Cost of the tour/package" />

        {/* Special Offers */}
        <FormField
          label="Special Offers / Discounts"
          field="specialOffers"
          placeholder="e.g. Early bird discount"
        />

        {/* Cancellation Policy */}
        <FormField
          label="Cancellation Policy"
          field="cancellationPolicy"
          type="textarea"
          placeholder="e.g. 50% refund before 7 days"
        />

        {/* Contact Info */}
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
