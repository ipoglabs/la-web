"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/components/form/fields/FormField";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";

export default function BusinessEventsForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Business");
    if (!store.subcategory) setField("subcategory", "events");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setLocationText = (value?: string) => {
    setField("locationText", value ?? "");
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Business Event</h2>

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
            placeholder="Business Events"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Adv Title"
          field="name"
          placeholder="e.g., Startup Networking Mixer, Trade Expo"
          required
        />

        {/* Date (matches config) */}
        <FormField
          label="Event Date"
          field="date"
          type="date"
          required
        />

        {/* LocationText (matches config) */}
        <FormField
          label="Location"
          field="locationText"
          placeholder="Venue / City / Online Link"
          required
        />

        {/* Description */}
        <FormField
          label="Adv Details"
          field="description"
          type="textarea"
          placeholder="Provide full event details"
          required
        />
      </CardContent>
    </Card>
  );
}
