"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function EntertainmentForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Default the main category/subcategory for this form
  React.useEffect(() => {
    if (!store.category) setField("category", "Community & Events");
    if (!store.subcategory) setField("subcategory", "Entertainment");
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
        <h2 className="text-2xl font-bold">Entertainment Event</h2>

        {/* Category / Subcategory (kept visible & editable for consistency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Community & Events" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Entertainment" required />
        </div>

        {/* Event Title → shared "name" */}
        <FormField
          label="Event / Entertainment Title"
          field="name"
          placeholder="e.g., Live Concert, Movie Premiere"
          required
        />

        {/* Organizer */}
        <FormField
          label="Organizer / Company Name"
          field="organizerName"
          placeholder="Organizer Name"
        />

        {/* Internal event type */}
        <SelectField
          label="Event Type"
          field="eventType"
          placeholder="Select Event Type"
          options={[
            { value: "concert", label: "Concert" },
            { value: "movie", label: "Movie / Premiere" },
            { value: "theater", label: "Theater / Play" },
            { value: "festival", label: "Festival" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Event Date" field="eventDate" type="date" />
          <FormField label="Start Time" field="startTime" type="time" />
          <FormField label="End Time" field="endTime" type="time" />
        </div>

        {/* Location (stored at location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City, Venue, or Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Ticket Price → store as numeric salePrice */}
        <FormField
          label="Ticket Price / Entry Fee (INR)"
          field="salePrice"
          type="number"
          placeholder="e.g., 500"
        />

        {/* Age Restriction */}
        <SelectField
          label="Age Restriction"
          field="ageRestriction"
          placeholder="Select Age Limit"
          options={[
            { value: "all", label: "All Ages" },
            { value: "13+", label: "13+" },
            { value: "18+", label: "18+" },
            { value: "21+", label: "21+" },
          ]}
        />

        {/* Website */}
        <FormField
          label="Event Website (optional)"
          field="website"
          type="url"
          placeholder="https://example.com"
        />

        {/* Social Media */}
        <FormField
          label="Social Media Link"
          field="socialMedia"
          type="url"
          placeholder="Facebook / Instagram Event Link"
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide event details, highlights, and special guests"
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
