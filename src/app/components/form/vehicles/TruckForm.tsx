// src/app/components/form/vehicles/TruckForm.tsx
"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function TruckForm() {
  const setField = usePostFormStore((s) => s.setField);

  // Read existing values so inputs stay controlled
  const name                = usePostFormStore((s) => s.name);
  const description         = usePostFormStore((s) => s.description);
  const make                = usePostFormStore((s) => (s as any).make);
  const model               = usePostFormStore((s) => (s as any).model);
  const year                = usePostFormStore((s) => (s as any).year);
  const kms                 = usePostFormStore((s) => (s as any).kms); // mileage
  const fuelType            = usePostFormStore((s) => (s as any).fuelType);
  const transmission        = usePostFormStore((s) => (s as any).transmission);
  const bodyType            = usePostFormStore((s) => (s as any).bodyType); // e.g. tipper/box/flatbed
  const condition           = usePostFormStore((s) => (s as any).condition);
  const ownerType           = usePostFormStore((s) => (s as any).ownerType);
  const registrationNumber  = usePostFormStore((s) => (s as any).registrationNumber);
  const insuranceValidTill  = usePostFormStore((s) => (s as any).insuranceValidTill);
  const serviceHistory      = usePostFormStore((s) => (s as any).serviceHistory);
  const payloadCapacity     = usePostFormStore((s) => (s as any).payloadCapacity); // tons
  const axleConfig          = usePostFormStore((s) => (s as any).axleConfig);      // 4x2, 6x4, etc.
  const gvwr                = usePostFormStore((s) => (s as any).gvwr);            // kg
  const salePrice           = usePostFormStore((s) => (s as any).salePrice);
  const featuresVal         = usePostFormStore((s) => (s as any).features);        // string[]
  const sellerInfo          = usePostFormStore((s) => s.sellerInfo);

  // (Optional) pre-set category/subcategory
  // useEffect(() => {
  //   setField("category", "Vehicles");
  //   setField("subcategory", "Truck");
  // }, [setField]);

  // Comma-list → array (features)
  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresVal) ? featuresVal.join(", ") : ""
  );
  const commitFeatures = () => {
    const arr = featuresText.split(",").map(s => s.trim()).filter(Boolean);
    setField("features", arr);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">Post a Truck for Sale</h2>

      {/* ===== Basic Info ===== */}
      <div className="space-y-6">
        <FormField
          label="Ad Title"
          field="name"
          value={name ?? ""}
          onChange={(v) => setField("name", v)}
          placeholder="e.g. Tata LPT 1613 Truck for Sale"
          required
        />
        <FormField
          label="Description"
          field="description"
          type="textarea"
          value={description ?? ""}
          onChange={(v) => setField("description", v)}
          placeholder="Add more details about your truck..."
        />
      </div>

      {/* ===== Vehicle Details ===== */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Vehicle Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Make"
            field="make"
            value={make ?? ""}
            onChange={(v) => setField("make", v)}
            placeholder="e.g. Tata, Ashok Leyland, BharatBenz"
            required
          />
          <FormField
            label="Model"
            field="model"
            value={model ?? ""}
            onChange={(v) => setField("model", v)}
            placeholder="e.g. LPT 1613"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Year"
            field="year"
            type="number"
            value={year ?? ""}
            onChange={(v) => setField("year", v)}
            placeholder="e.g. 2020"
            required
          />
          <FormField
            label="Mileage (km)"
            field="kms"
            type="number"
            value={kms ?? ""}
            onChange={(v) => setField("kms", v)}
            placeholder="e.g. 150000"
            required
          />
          <SelectField
            label="Condition"
            field="condition"
            value={condition ?? ""}
            onChange={(v) => setField("condition", v)}
            options={[
              { value: "used", label: "Used" },
              { value: "new", label: "New" },
              { value: "refurbished", label: "Refurbished" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            label="Fuel Type"
            field="fuelType"
            value={fuelType ?? ""}
            onChange={(v) => setField("fuelType", v)}
            options={[
              { value: "diesel", label: "Diesel" },
              { value: "petrol", label: "Petrol" },
              { value: "cng", label: "CNG" },
              { value: "lng", label: "LNG" },
              { value: "electric", label: "Electric" },
            ]}
          />
          <SelectField
            label="Transmission"
            field="transmission"
            value={transmission ?? ""}
            onChange={(v) => setField("transmission", v)}
            options={[
              { value: "manual", label: "Manual" },
              { value: "amt", label: "AMT" },
              { value: "automatic", label: "Automatic" },
            ]}
          />
          <SelectField
            label="Body Type"
            field="bodyType"
            value={bodyType ?? ""}
            onChange={(v) => setField("bodyType", v)}
            options={[
              { value: "tipper", label: "Tipper" },
              { value: "box", label: "Box" },
              { value: "flatbed", label: "Flatbed" },
              { value: "tanker", label: "Tanker" },
              { value: "trailer", label: "Trailer" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Payload Capacity (tons)"
            field="payloadCapacity"
            type="number"
            value={payloadCapacity ?? ""}
            onChange={(v) => setField("payloadCapacity", v)}
            placeholder="e.g. 10"
          />
          <SelectField
            label="Axle Configuration"
            field="axleConfig"
            value={axleConfig ?? ""}
            onChange={(v) => setField("axleConfig", v)}
            options={[
              { value: "4x2", label: "4x2" },
              { value: "6x2", label: "6x2" },
              { value: "6x4", label: "6x4" },
              { value: "8x2", label: "8x2" },
              { value: "8x4", label: "8x4" },
            ]}
          />
          <FormField
            label="GVWR (kg)"
            field="gvwr"
            type="number"
            value={gvwr ?? ""}
            onChange={(v) => setField("gvwr", v)}
            placeholder="e.g. 16200"
          />
        </div>
      </div>

      {/* ===== Ownership & Docs ===== */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Ownership & Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Owner Type"
            field="ownerType"
            value={ownerType ?? ""}
            onChange={(v) => setField("ownerType", v)}
            placeholder="First Owner / Second Owner"
          />
          <FormField
            label="Registration Number"
            field="registrationNumber"
            value={registrationNumber ?? ""}
            onChange={(v) => setField("registrationNumber", v)}
            placeholder="e.g. TN-01-AB-1234"
          />
          <FormField
            label="Insurance Valid Till"
            field="insuranceValidTill"
            type="date"
            value={insuranceValidTill ?? ""}
            onChange={(v) => setField("insuranceValidTill", v)}
          />
        </div>

        <SelectField
          label="Service History"
          field="serviceHistory"
          value={serviceHistory ?? ""}
          onChange={(v) => setField("serviceHistory", v)}
          options={[
            { value: "full", label: "Full" },
            { value: "partial", label: "Partial" },
            { value: "none", label: "None" },
          ]}
        />

        {/* Features (comma-separated -> array) */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Key Features (comma-separated)</label>
          <input
            className="border rounded w-full py-2 px-3"
            placeholder="e.g. AC cabin, ABS, Telematics, New tyres"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            onBlur={commitFeatures}
          />
          <p className="text-xs text-gray-500">Saved as a list.</p>
        </div>
      </div>

      {/* ===== Pricing ===== */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Pricing</h3>
        <FormField
          label="Price (₹)"
          field="salePrice"
          type="number"
          value={salePrice ?? ""}
          onChange={(v) => setField("salePrice", v)}
          placeholder="e.g. 1200000"
          required
        />
      </div>

      {/* ===== Contact Details (nested sellerInfo) ===== */}
      <div className="space-y-2 border-t pt-6">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Seller Name"
              value={sellerInfo?.name ?? ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              placeholder="Email address"
              value={sellerInfo?.email ?? ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="tel"
              placeholder="Phone number"
              value={sellerInfo?.phone ?? ""}
              onChange={(e) =>
                setField("sellerInfo", { ...sellerInfo, phone: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Location comes from your global map picker → location.{address,lat,lng} */}
      {/* Optional fallback:
      <FormField label="Address" field="location.address" placeholder="City, State" />
      */}
    </div>
  );
}
