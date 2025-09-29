'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function WantedForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category for Wanted posts
  React.useEffect(() => {
    if (!store.category) setField("category", "Wanted");
    if (!store.subcategory) setField("subcategory", "General Wanted");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post a Wanted Item / Service</h2>

        <FormField
          label="Item / Service Wanted"
          field="title"
          placeholder="What are you looking for?"
          required
        />

        <SelectField
          label="Category"
          field="subcategory"
          options={[
            { value: "property", label: "Property" },
            { value: "vehicles", label: "Vehicles" },
            { value: "services", label: "Services" },
            { value: "jobs", label: "Jobs" },
            { value: "electronics", label: "Electronics" },
            { value: "others", label: "Others" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details of the item or service you want"
          required
        />

        <FormField
          label="Location"
          field="location"
          placeholder="City / Area"
        />

        <SelectField
          label="Urgency"
          field="urgency"
          options={[
            { value: "high", label: "High (ASAP)" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
        />

        <FormField
          label="Contact Name"
          field="contactName"
          placeholder="Your Name"
          required
        />

        <FormField
          label="Contact Email"
          field="contactEmail"
          type="email"
          placeholder="Email Address"
        />

        <FormField
          label="Contact Phone"
          field="contactPhone"
          placeholder="Phone Number"
        />
      </CardContent>
    </Card>
  );
}
