"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";
import { usePostFormStore } from "@/app/post/store/postFormStore";

export default function AutomotiveForm() {
  const store = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  // Ensure category defaults to Vehicles
  React.useEffect(() => {
    if (!store.category) setField("category", "Vehicles");
  }, [store.category, setField]);

  // Helpers for nested objects
  const setSeller = (k: "name" | "email" | "phone", v?: string) => {
    const cur = store.sellerInfo || {};
    setField("sellerInfo", { ...cur, [k]: v ?? "" });
  };
  const setLoc = (address?: string) => {
    const cur = store.location || {};
    setField("location", { ...cur, address: address ?? "" });
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-bold">Post a Vehicle</h2>

        {/* Category / Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category" field="category" placeholder="Vehicles" required />
          <SelectField
            label="Vehicle Type"
            field="subcategory"
            placeholder="Select vehicle type"
            options={[
              { value: "car", label: "Car" },
              { value: "motorcycle", label: "Motorcycle" },
              { value: "truck", label: "Truck" },
              { value: "van", label: "Van" },
              // You can add "parts" here if this form should also handle parts
            ]}
            required
          />
        </div>

        {/* Basic vehicle info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Make" field="make" placeholder="e.g., Toyota, Honda" required />
          <FormField label="Model" field="model" placeholder="e.g., Corolla, Civic" required />
          <FormField label="Year" field="year" type="number" placeholder="e.g., 2020" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Condition"
            field="condition"
            placeholder="Select"
            options={[
              { value: "New" },
              { value: "Used" },
              { value: "Certified Pre-Owned", label: "Certified Pre-Owned" },
            ]}
          />
          <FormField label="Mileage (km)" field="kms" type="number" placeholder="e.g., 20000" />
          <SelectField
            label="Fuel Type"
            field="fuelType"
            placeholder="Select"
            options={[
              { value: "Petrol" },
              { value: "Diesel" },
              { value: "Electric" },
              { value: "Hybrid" },
              { value: "Other" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Transmission"
            field="transmission"
            placeholder="Select"
            options={[
              { value: "Manual" },
              { value: "Automatic" },
              { value: "AMT" },
              { value: "CVT" },
              { value: "DCT" },
            ]}
          />
          <FormField label="Body Type" field="bodyType" placeholder="e.g., SUV, Sedan, Hatchback" />
          <FormField label="Color" field="color" placeholder="e.g., White" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Owner Type" field="ownerType" placeholder="e.g., First Owner" />
          <FormField label="Registration Number" field="registrationNumber" placeholder="e.g., KA01AB1234" />
          <FormField label="Insurance Valid Till" field="insuranceValidTill" type="date" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Service History" field="serviceHistory" placeholder="e.g., Full service history" />
          <FormField
            label="Price (INR)"
            field="salePrice"
            type="number"
            placeholder="e.g., 500000"
          />
        </div>

        {/* Location (stored in location.address) */}
        <FormField
          label="Location"
          field="__ignore_location__"
          placeholder="City, State"
          value={store.location?.address ?? ""}
          onChange={(v) => setLoc((v as string) || "")}
        />

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Contact Name"
            field="__ignore_seller_name__"
            placeholder="Contact person"
            value={store.sellerInfo?.name ?? ""}
            onChange={(v) => setSeller("name", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Email"
            field="__ignore_seller_email__"
            type="email"
            placeholder="you@example.com"
            value={store.sellerInfo?.email ?? ""}
            onChange={(v) => setSeller("email", (v as string) || "")}
            required
          />
          <FormField
            label="Contact Phone"
            field="__ignore_seller_phone__"
            type="tel"
            placeholder="+91 9876543210"
            value={store.sellerInfo?.phone ?? ""}
            onChange={(v) => setSeller("phone", (v as string) || "")}
            required
          />
        </div>

        {/* Description */}
        <FormField
          label="Description"
          field="description"
          type="textarea"
          placeholder="Provide details about the vehicle (condition, extras, etc.)"
          required
        />
      </CardContent>
    </Card>
  );
}
