"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/components/form/fields/FormField";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";

export default function AnnouncementForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "announcement");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- HELPERS ---------------- */

  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };

  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">
          Post an Announcement
        </h2>

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
            placeholder="Announcement"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Announcement Title"
          field="name"
          placeholder="Enter announcement title"
          required
        />

        {/* Description (matches config key) */}
        <FormField
          label="Announcement"
          field="description"
          type="textarea"
          placeholder="Provide details about the announcement"
          required
        />

        {/* Location (nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Venue / Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Contact Section */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Contact Information
          </h3>

          <FormField
            label="Contact Person"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", (v as string) || "")
            }
          />

          <FormField
            label="Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", (v as string) || "")
            }
          />

          <FormField
            label="Phone"
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