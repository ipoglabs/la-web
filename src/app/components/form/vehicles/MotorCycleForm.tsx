"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function MotorcycleSaleForm() {
  const setField = usePostFormStore((s) => s.setField);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo) || {};

  // If you want to auto-set category/subcategory for this page, uncomment:
  // useEffect(() => {
  //   setField("category", "Vehicles");
  //   setField("subcategory", "Motorcycle");
  // }, [setField]);

  // Optional features as a comma-list -> array
  const featuresStore = usePostFormStore((s) => s.features);
  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresStore) ? featuresStore.join(", ") : ""
  );
  const commitFeatures = () => {
    const arr = featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("features", arr);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Motorcycle for Sale</h2>

      {/* Title / Description */}
      <FormField
        label="Ad Title"
        field="name"
        placeholder="e.g. Yamaha R15 V4 for Sale"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Provide additional details about the motorcycle"
      />

      {/* Make / Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Make" field="make" placeholder="e.g. Yamaha" required />
        <FormField label="Model" field="model" placeholder="e.g. R15 V4" required />
      </div>

      {/* Year / Mileage (kms) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Year" field="year" type="number" placeholder="e.g. 2022" required />
        <FormField
          label="Mileage (km)"
          field="kms"
          type="number"
          placeholder="e.g. 15000"
        />
      </div>

      {/* Engine Capacity */}
      <FormField
        label="Engine Capacity (cc)"
        field="engineCapacity"
        type="number"
        placeholder="e.g. 155"
      />

      {/* Fuel / Transmission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Fuel Type"
          field="fuelType"
          options={[
            { value: "Petrol" },
            { value: "Electric" },
          ]}
        />
        <SelectField
          label="Transmission"
          field="transmission"
          options={[
            { value: "Manual" },
            { value: "Automatic" },
          ]}
        />
      </div>

      {/* Condition / Owner Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Condition"
          field="condition"
          options={[
            { value: "New" },
            { value: "Used" },
          ]}
        />
        <SelectField
          label="Ownership"
          field="ownerType"
          options={[
            { value: "First Owner" },
            { value: "Second Owner" },
            { value: "Third Owner" },
            { value: "Other" },
          ]}
        />
      </div>

      {/* Optional registration / insurance / service history */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Registration Number"
          field="registrationNumber"
          placeholder="e.g. TN-01-AB-1234"
        />
        <FormField
          label="Insurance Valid Till"
          field="insuranceValidTill"
          type="date"
        />
      </div>
      <FormField
        label="Service History"
        field="serviceHistory"
        placeholder="Full / Partial / None"
      />

      {/* Price & (optional) Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Price (₹)"
          field="salePrice"            // ← stored as salePrice in your model
          type="number"
          placeholder="e.g. 150000"
          required
        />
        <FormField label="Color" field="color" placeholder="e.g. Blue" />
      </div>

      {/* Optional Features */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Features (optional)</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. ABS, Slipper Clutch, LED Headlamps"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
        />
        <p className="text-xs text-gray-500">
          Tip: comma-separate features; they’ll be saved as a list.
        </p>
      </div>

      {/* Contact (writes into nested sellerInfo) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Your Name"
              value={sellerInfo?.name || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="tel"
              placeholder="+91 9XXXXXXXXX"
              value={sellerInfo?.phone || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              placeholder="email@example.com"
              value={sellerInfo?.email || ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, email: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Location:
          Your global location picker writes to location.address/lat/lng.
          Optionally add a manual fallback address field like below. */}
      {/* <FormField label="Location" field="location.address" placeholder="City / State" /> */}
    </div>
  );
}
