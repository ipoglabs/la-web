'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function WantedForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Wanted");
    if (!store.subcategory) setField("subcategory", "General Wanted Ads");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Post a Wanted Ad</h2>

        <FormField label="Ad Title" field="title" placeholder="e.g., Looking for a used laptop" required />

        <SelectField
          label="Category"
          field="subcategory"
          options={[
            { value: "electronics", label: "Electronics" },
            { value: "furniture", label: "Home & Furniture" },
            { value: "vehicles", label: "Vehicles" },
            { value: "services", label: "Services" },
            { value: "jobs", label: "Jobs" },
            { value: "misc", label: "Miscellaneous" },
          ]}
        />

        <FormField label="Budget (Optional)" field="budget" placeholder="e.g., $500" />
        <FormField label="Preferred Location" field="location" placeholder="e.g., New York, NY" />
        <FormField label="Description" field="description" type="textarea" placeholder="Describe what you are looking for..." required />
        <FormField label="Contact Information" field="contact" placeholder="Phone or Email" required />
      </CardContent>
    </Card>
  );
}
