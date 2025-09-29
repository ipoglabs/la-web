'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ClassesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category for post
  React.useEffect(() => {
    if (!store.category) setField("category", "Classes");
    if (!store.subcategory) setField("subcategory", "General Classes");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post a Class</h2>

        <FormField
          label="Class Title"
          field="title"
          placeholder="e.g., Guitar Lessons, Coding Bootcamp"
          required
        />

        <SelectField
          label="Class Type"
          field="subcategory"
          options={[
            { value: "workshop", label: "Workshop" },
            { value: "course", label: "Course" },
            { value: "training", label: "Training" },
            { value: "webinar", label: "Webinar" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the class"
          required
        />

        <FormField label="Location" field="location" placeholder="Venue / City / Online Link" />
        <FormField label="Start Date" field="startDate" type="date" />
        <FormField label="End Date" field="endDate" type="date" />
        <FormField label="Start Time" field="startTime"/>
        <FormField label="End Time" field="endTime" />
        <FormField label="Class Fee" field="fee" placeholder="e.g., ₹500 per session" />
        <FormField label="Instructor Name" field="instructorName" placeholder="Instructor Name" />
        <FormField label="Instructor Email" field="instructorEmail" type="email" placeholder="Email Address" />
        <FormField label="Instructor Phone" field="instructorPhone" placeholder="Phone Number" />
        <FormField label="Registration / Booking Link" field="link" placeholder="Website / Zoom / Event Link" />
      </CardContent>
    </Card>
  );
}
