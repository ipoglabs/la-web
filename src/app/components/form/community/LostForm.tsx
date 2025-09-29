'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function LostAndFoundForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Lost & Found");
    if (!store.subcategory) setField("subcategory", "Lost");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Lost & Found Post</h2>

        <SelectField
          label="Post Type"
          field="subcategory"
          options={[
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ]}
        />

        <FormField
          label="Item Name"
          field="itemName"
          placeholder="e.g., Wallet, Phone, Dog"
          required
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Describe the item (color, brand, unique features)"
          required
        />

        <FormField
          label="Location"
          field="location"
          placeholder="Where was it lost or found?"
          required
        />

        <FormField
          label="Date"
          field="date"
          type="date"
          required
        />

        <FormField
          label="Contact Name"
          field="contactName"
          placeholder="Enter your name"
          required
        />

        <FormField
          label="Contact Number"
          field="contactNumber"
          placeholder="Enter phone number"
          required
        />

        <FormField
          label="Contact Email"
          field="contactEmail"
          type="email"
          placeholder="Enter email address"
        />
      </CardContent>
    </Card>
  );
}
