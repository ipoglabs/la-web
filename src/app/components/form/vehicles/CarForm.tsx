// src/app/components/form/vehicle/CarSaleForm.tsx
"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function CarSaleForm() {
  const setField = usePostFormStore((s) => s.setField);
  const sellerInfo = usePostFormStore((s) => s.sellerInfo);
  const featuresStore = usePostFormStore((s) => s.features);

  // Optionally set category/subcategory for vehicles here
  // useEffect(() => {
  //   setField("category", "Vehicles");
  //   setField("subcategory", "Cars");
  // }, [setField]);

  // ---- Features: comma-separated -> array in store ----
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

  // Keep price both as salePrice (server action/model friendly) and price (preview labels)
  const handlePrice = (v: string) => {
    setField("salePrice", v);
    setField("price", v);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Post a Car for Sale</h2>

      {/* Basic Info */}
      <FormField
        label="Ad Title"
        field="name"
        placeholder="e.g. 2019 Honda City VX in excellent condition"
        required
      />
      <FormField
        label="Description"
        field="description"
        type="textarea"
        placeholder="Overall condition, ownership, service history, extras…"
      />

      {/* Price */}
      <FormField
        label="Price (₹)"
        field="salePrice"
        type="number"
        placeholder="e.g. 850000"
        onChangeRaw={(e) => handlePrice((e.target as HTMLInputElement).value)}
        required
      />

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Make" field="make" placeholder="e.g. Honda" required />
        <FormField label="Model" field="model" placeholder="e.g. City VX" required />
        <FormField label="Year" field="year" type="number" placeholder="e.g. 2019" required />
        <FormField label="Mileage (km)" field="kms" type="number" placeholder="e.g. 42000" />
        <SelectField
          label="Fuel Type"
          field="fuelType"
          options={[
            { value: "Petrol" },
            { value: "Diesel" },
            { value: "CNG" },
            { value: "Hybrid" },
            { value: "Electric" },
            { value: "Other" },
          ]}
        />
        <SelectField
          label="Transmission"
          field="transmission"
          options={[
            { value: "Manual" },
            { value: "Automatic" },
            { value: "AMT" },
            { value: "CVT" },
            { value: "DCT" },
          ]}
        />
        <SelectField
          label="Body Type"
          field="bodyType"
          options={[
            { value: "Hatchback" },
            { value: "Sedan" },
            { value: "SUV" },
            { value: "MUV" },
            { value: "Coupe" },
            { value: "Convertible" },
            { value: "Other" },
          ]}
        />
        <FormField label="Color" field="color" placeholder="e.g. White" />
      </div>

      {/* Ownership */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Owner Type" field="ownerType" placeholder="First Owner / Second Owner" />
        <FormField label="Registration Number" field="registrationNumber" placeholder="e.g. TN 01 AB 1234" />
        <FormField label="Insurance Valid Till" field="insuranceValidTill" type="date" />
        <SelectField
          label="Service History"
          field="serviceHistory"
          options={[
            { value: "Full", label: "Full" },
            { value: "Partial", label: "Partial" },
            { value: "None", label: "None" },
          ]}
        />
      </div>

      {/* Features (comma-separated -> array) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Features</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="e.g. Sunroof, ABS, Alloy Wheels, Android Auto"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={commitFeatures}
        />
        <p className="text-xs text-gray-500">Tip: comma-separate features; we’ll save them as a list.</p>
      </div>

      {/* Contact Details (nested sellerInfo object) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Seller Name"
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
            />
          </div>
        </div>
      </div>

      {/* Location: use your global picker to write location.address/lat/lng.
          If you need a simple fallback field, uncomment below:
      <FormField label="Location" field="location.address" placeholder="City / Area / Pincode" />
      */}
    </div>
  );
}
