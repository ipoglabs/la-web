'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function AnnouncementForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category
  React.useEffect(() => {
    if (!store.category) setField("category", "Announcement");
    if (!store.subcategory) setField("subcategory", "General Announcements");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post an Announcement</h2>

        <FormField
          label="Title"
          field="title"
          placeholder="Announcement Title"
          required
        />

        <SelectField
          label="Category"
          field="subcategory"
          options={[
            { value: "general", label: "General" },
            { value: "event", label: "Event" },
            { value: "news", label: "News" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the announcement"
          required
        />

        <FormField label="Location" field="location" placeholder="City / Venue / Online" />
        <FormField label="Event / Announcement Date" field="eventDate" type="date" />

        <FormField label="Contact Person" field="contactName" placeholder="Name of contact person" />
        <FormField label="Contact Email" field="contactEmail" type="email" placeholder="Email Address" />
        <FormField label="Contact Phone" field="contactPhone" placeholder="Phone Number" />

        <FormField label="Related Link" field="link" placeholder="Website / Event Link" />
      </CardContent>
    </Card>
  );
}
