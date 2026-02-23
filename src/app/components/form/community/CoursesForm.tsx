"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ClassesCoursesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "courses");
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
        <h2 className="text-2xl font-bold">Post a Course</h2>

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
            placeholder="Courses"
            required
          />
        </div>

        {/* Title */}
        <FormField
          label="Course Title"
          field="name"
          placeholder="e.g., Python Programming Bootcamp"
          required
        />

        {/* Qualification (matches config) */}
        <FormField
          label="Qualification"
          field="qualification"
          placeholder="e.g., Certificate, Diploma, Degree"
          required
        />

        {/* Duration */}
        <FormField
          label="Duration"
          field="durationText"
          placeholder="e.g., 3 months, 10 sessions"
          required
        />

        {/* Fee */}
        <FormField
          label="Fee (₹)"
          field="price"
          type="number"
          inputMode="decimal"
          placeholder="Enter course fee"
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide full course details"
          required
        />

        {/* Location (nested) */}
        {/* <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="Venue / City / Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        /> */}

        {/* Contact Section */}
        {/* <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold">
            Instructor / Contact Details
          </h3>

          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) =>
              setSeller("name", (v as string) || "")
            }
            required
          />

          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) =>
              setSeller("email", (v as string) || "")
            }
          />

          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) =>
              setSeller("phone", (v as string) || "")
            }
          />
        </div> */}

        {/* Preview handles submission */}
      </CardContent>
    </Card>
  );
}