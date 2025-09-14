// src/app/components/form/property/BuyForm.tsx
"use client";

import FormField from "@/app/components/form/fields/FormField";
import CheckboxGroupField from "@/app/components/form/fields/CheckboxGroupField";

export default function BuyForm() {
  const facilitiesOptions = ["Parking", "Gym", "Swimming Pool", "Garden"];

  return (
    <div className="space-y-6">
      <FormField
        label="Listing Title"
        field="name"
        placeholder="eg. 2BHK Apartment in Anna Nagar"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Describe the property…"
      />
      <FormField
        label="Sale Price"
        field="salePrice"
        type="number"
        placeholder="e.g. 6500000"
      />
      <FormField
        label="Built-up Area (sq ft)"
        field="builtup_area"
        type="number"
      />
      <FormField
        label="Carpet Area (sq ft)"
        field="carpet_area"
        type="number"
      />

      <CheckboxGroupField
        label="Facilities"
        field="facilities"
        options={facilitiesOptions}
        cols={3}
      />
    </div>
  );
}
