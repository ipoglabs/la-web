"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function EventsForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "events");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLocationText = (value?: string) => {
    setField("locationText", value ?? "");
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Post an Event</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            field="category"
            placeholder="Community"
            required
          />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Events"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Event Title"
          field="name"
          placeholder="e.g., Yoga Workshop, Music Concert"
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
          label="Details"
          field="description"
          type="textarea"
          placeholder="Provide full event details"
          required
        />

        {/* Organizer / Contact */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Organizer Details
          </h3>

          <FormField
            label="Organizer Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", (v as string) || "")
            }
            required
          />

          <FormField
            label="Organizer Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", (v as string) || "")
            }
          />

          <FormField
            label="Organizer Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", (v as string) || "")
            }
          />
        </div> */}

        {/* Preview page handles submit */}
      </CardContent>
    </Card>
  );
}