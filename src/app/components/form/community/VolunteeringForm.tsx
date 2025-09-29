'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function VolunteeringCharityForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category/subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Volunteering & Charity");
    if (!store.subcategory) setField("subcategory", "Volunteering");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post a Volunteering / Charity Opportunity</h2>

        <FormField
          label="Opportunity Title"
          field="title"
          placeholder="e.g., Beach Cleanup, Fundraising Event"
          required
        />

        <SelectField
          label="Type"
          field="subcategory"
          options={[
            { value: "volunteering", label: "Volunteering" },
            { value: "charity", label: "Charity" },
            { value: "fundraising", label: "Fundraising" },
            { value: "awareness", label: "Awareness Campaign" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the opportunity"
          required
        />

        <FormField
          label="Location"
          field="location"
          placeholder="Venue / City / Online"
        />

        <FormField
          label="Start Date"
          field="startDate"
          type="date"
        />

        <FormField
          label="End Date"
          field="endDate"
          type="date"
        />

        <FormField
          label="Time Commitment"
          field="timeCommitment"
          placeholder="e.g., 2 hrs/week, 1 day event"
        />

        <FormField
          label="Contact Person"
          field="contactName"
          placeholder="Name of contact person"
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

        <FormField
          label="Registration / Signup Link"
          field="link"
          placeholder="Website / Zoom / Event Link"
        />
      </CardContent>
    </Card>
  );
}
