'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function ClassesCoursesForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Set default category and subcategory
  React.useEffect(() => {
    if (!store.category) setField("category", "Classes & Courses");
    if (!store.subcategory) setField("subcategory", "General Classes");
  }, [store.category, store.subcategory, setField]);

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Post a Class / Course</h2>

        <FormField
          label="Class / Course Title"
          field="title"
          placeholder="e.g., Python Programming Bootcamp"
          required
        />

        <SelectField
          label="Category"
          field="subcategory"
          options={[
            { value: "academic", label: "Academic" },
            { value: "skill-development", label: "Skill Development" },
            { value: "arts", label: "Arts & Creativity" },
            { value: "sports", label: "Sports & Fitness" },
            { value: "other", label: "Other" },
          ]}
        />

        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the class or course"
          required
        />

        <FormField label="Location" field="location" placeholder="Venue / City / Online" />
        <FormField label="Start Date" field="startDate" type="date" />
        <FormField label="End Date" field="endDate" type="date" />
        <FormField label="Duration" field="duration" placeholder="e.g., 3 months, 10 sessions" />
        <FormField label="Schedule" field="schedule" placeholder="e.g., Mon & Wed 6-8 PM" />
        <FormField label="Fees" field="fees" placeholder="e.g., ₹5000 for full course" />
        <FormField label="Contact Person" field="contactName" placeholder="Name of contact person" />
        <FormField label="Contact Email" field="contactEmail" type="email" placeholder="Email Address" />
        <FormField label="Contact Phone" field="contactPhone" placeholder="Phone Number" />
        <FormField
          label="Registration / Signup Link"
          field="link"
          placeholder="Website / Zoom / Event Link"
        />
      </CardContent>
    </Card>
  );
}
