'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function TrainingOpportunitiesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Education / Training");
    if (!store.subcategory) setField("subcategory", "Training Opportunities");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Training Opportunities</h2>

        <FormField label="Training Title" field="title" required />
        <SelectField
          label="Training Type"
          field="trainingType"
          options={[
            { value: "workshop", label: "Workshop" },
            { value: "course", label: "Course" },
            { value: "webinar", label: "Webinar" },
            { value: "seminar", label: "Seminar" },
            { value: "certification", label: "Certification Program" },
          ]}
        />
        <SelectField
          label="Mode"
          field="mode"
          options={[
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
            { value: "hybrid", label: "Hybrid" },
          ]}
        />
        <FormField label="Training Provider" field="provider" required />
        <FormField label="Duration" field="duration" placeholder="e.g. 6 weeks, 3 days" />
        <FormField label="Location" field="location" placeholder="City or Online" />
        <FormField label="Start Date" field="startDate" type="date" />
        <FormField label="End Date" field="endDate" type="date" />
        <FormField label="Price" field="price" placeholder="e.g. $200 or Free" />
        <FormField label="Description" field="description" type="textarea"  />
        <FormField label="Contact Email" field="contactEmail" type="email" required />
        <FormField label="Contact Phone" field="contactPhone" type="tel" />
        <FormField label="Website / Registration Link" field="website" />
      </CardContent>
    </Card>
  );
}
