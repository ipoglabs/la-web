"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/components/form/fields/FormField";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { usePostFormStore } from "@/app/(main)/post/store/postFormStore";

export default function RideshareForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const rideType = (store as any).rideType ?? "";
  const seatsAvailable = (store as any).seatsAvailable ?? "";

  /* ---------------- DEFAULT CATEGORY ---------------- */

  React.useEffect(() => {
    if (!store.category) setField("category", "Community");
    if (!store.subcategory) setField("subcategory", "rideshare");
  }, [store.category, store.subcategory, setField]);

  /* ---------------- UI ---------------- */

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Community" required />
          <FormField label="Subcategory" field="subcategory" placeholder="Rideshare & Carpool" required />
        </div>

        {/* Title */}
        <FormField
          label="Adv Title"
          field="name"
          placeholder="e.g., Daily commute to downtown"
          required
        />

        <ToggleButtonGroup title="I am" singleSelect value={rideType ? [rideType] : []} onChange={(v) => setField("rideType", v[0] ?? "")}>
          <ToggleGroupButton value="offering">Offering a Ride</ToggleGroupButton>
          <ToggleGroupButton value="seeking">Looking for a Ride</ToggleGroupButton>
        </ToggleButtonGroup>

        {/* From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="From" field="fromLocation" placeholder="Starting point" required />
          <FormField label="To" field="toLocation" placeholder="Destination" required />
        </div>

        {/* Date + Seats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Date" field="rideDate" type="date" />
          <FormField
            label="Seats Available"
            field="seatsAvailable"
            type="number"
            value={seatsAvailable}
            onChange={(v) => setField("seatsAvailable", v)}
          />
        </div>

        {/* Description */}
        <FormField
          label="Adv Details"
          field="description"
          type="textarea"
          placeholder="Timing, recurring schedule, cost sharing, etc."
          required
        />
      </CardContent>
    </Card>
  );
}
