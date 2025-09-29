"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ChildFamilyActivitiesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category/subcategory (Community & Events → Child & Family Activities)
  React.useEffect(() => {
    if (!store.category) setField("category", "Community & Events");
    if (!store.subcategory) setField("subcategory", "Child & Family Activities");
  }, [store.category, store.subcategory, setField]);

  // Nested helpers
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
        <h2 className="text-2xl font-bold">Child & Family Activities</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Community & Events" required />
          <FormField
            label="Subcategory"
            field="subcategory"
            placeholder="Child & Family Activities"
            required
          />
        </div>

        {/* Title → name */}
        <FormField
          label="Activity Title"
          field="name"
          placeholder="e.g., Weekend Art Workshop for Kids"
          required
        />

        {/* Activity Category */}
        <SelectField
          label="Activity Category"
          field="activityCategory"
          placeholder="Select Category"
          options={[
            { value: "sports", label: "Sports" },
            { value: "arts", label: "Arts & Crafts" },
            { value: "education", label: "Educational" },
            { value: "other", label: "Other" },
          ]}
        />

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the activity, schedule, and special instructions"
          required
        />

        {/* Age Group */}
        <SelectField
          label="Age Group"
          field="ageGroup"
          placeholder="Select Age Group"
          options={[
            { value: "0-3", label: "0–3 years" },
            { value: "4-7", label: "4–7 years" },
            { value: "8-12", label: "8–12 years" },
            { value: "13+", label: "13+ years" },
          ]}
        />

        {/* Date */}
        <FormField label="Event Date" field="eventDate" type="date" />

        {/* Location (nested) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City / Venue / Online"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Website / Link */}
        <FormField
          label="Related Link"
          field="website"
          type="text"
          placeholder="Website / Activity link (https://...)"
          hint="Optional"
        />

        {/* Contact Info (nested seller_info) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Person"
            field="__ignore_seller_name__"
            placeholder="Name of contact person"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="Email address"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="Phone number"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
          />
        </div>

        {/* No submit here — your Preview page handles submission */}
      </CardContent>
    </Card>
  );
}
