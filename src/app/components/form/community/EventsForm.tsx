'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function EventsForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category and subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Events");
    if (!store.subcategory) setField("subcategory", "General Events");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post an Event</h2>

        <FormField
          label="Event Title"
          field="title"
          placeholder="e.g., Yoga Workshop, Music Concert"
          required
        />

        <SelectField
          label="Event Type"
          field="subcategory"
          options={[
            { value: "workshop", label: "Workshop" },
            { value: "class", label: "Class" },
            { value: "concert", label: "Concert" },
            { value: "meetup", label: "Meetup" },
            { value: "seminar", label: "Seminar" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the event"
          required
        />

        <FormField label="Location" field="location" placeholder="Venue / City / Online Link" required />
        <FormField label="Start Date" field="startDate" type="date" required />
        <FormField label="End Date" field="endDate" type="date" />
        <FormField label="Start Time" field="startTime"  />
        <FormField label="End Time" field="endTime" />

        <FormField label="Contact Name" field="contactName" placeholder="Organizer Name" required />
        <FormField label="Contact Email" field="contactEmail" type="email" placeholder="Email Address" />
        <FormField label="Contact Phone" field="contactPhone" placeholder="Phone Number" />

        <FormField
          label="Registration / Ticket Link"
          field="link"
          placeholder="Website / Eventbrite / Zoom Link"
        />
      </CardContent>
    </Card>
  );
}
