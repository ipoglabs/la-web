// src/app/components/form/vehicles/VehicleWantedForm.tsx
"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function VehicleWantedForm() {
  const setField = usePostFormStore((s) => s.setField);

  // read existing values so the form stays controlled
  const name                 = usePostFormStore((s) => s.name); // optional headline
  const description          = usePostFormStore((s) => s.description);
  const vehicleType          = usePostFormStore((s) => (s as any).vehicleType);
  const make                 = usePostFormStore((s) => (s as any).make);
  const model                = usePostFormStore((s) => (s as any).model);
  const year                 = usePostFormStore((s) => (s as any).year);
  const fuelType             = usePostFormStore((s) => (s as any).fuelType);
  const transmission         = usePostFormStore((s) => (s as any).transmission);
  const maxBudget            = usePostFormStore((s) => (s as any).maxBudget);
  const preferred_locations  = usePostFormStore((s) => (s as any).preferred_locations);
  const sellerInfo           = usePostFormStore((s) => s.sellerInfo);

  // (Optional) auto-set category/subcategory for this form
  // useEffect(() => {
  //   setField("category", "Vehicles");
  //   setField("subcategory", "Wanted");
  // }, [setField]);

  // comma → array for preferred locations
  const [locText, setLocText] = useState(
    Array.isArray(preferred_locations) ? preferred_locations.join(", ") : ""
  );
  const commitLocations = () => {
    const arr = locText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("preferred_locations", arr);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">Post Vehicle Wanted</h2>

      {/* (Optional) Headline */}
      <FormField
        label="Ad Title (optional)"
        field="name"
        value={name ?? ""}
        onChange={(v) => setField("name", v)}
        placeholder="e.g. Looking for a 2018+ Toyota Corolla"
      />

      {/* Vehicle basics */}
      <div className="space-y-4">
        <SelectField
          label="Vehicle Category"
          field="vehicleType"
          value={vehicleType ?? ""}
          onChange={(v) => setField("vehicleType", v)} // stored as "car" | "motorcycle" | "van" | "truck" | "parts"
          options={[
            { value: "car", label: "Car" },
            { value: "motorcycle", label: "Motorcycle" },
            { value: "van", label: "Van" },
            { value: "truck", label: "Truck" },
            { value: "parts", label: "Parts" },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Preferred Make"
            field="make"
            value={make ?? ""}
            onChange={(v) => setField("make", v)}
            placeholder="e.g. Toyota"
          />
          <FormField
            label="Preferred Model"
            field="model"
            value={model ?? ""}
            onChange={(v) => setField("model", v)}
            placeholder="e.g. Corolla"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Preferred Year (min)"
            field="year"
            type="number"
            value={year ?? ""}
            onChange={(v) => setField("year", v)}
            placeholder="e.g. 2018"
          />
          <SelectField
            label="Fuel Type"
            field="fuelType"
            value={fuelType ?? ""}
            onChange={(v) => setField("fuelType", v)}
            options={[
              { value: "petrol", label: "Petrol" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Electric" },
              { value: "hybrid", label: "Hybrid" },
              { value: "cng", label: "CNG" },
            ]}
          />
          <SelectField
            label="Transmission"
            field="transmission"
            value={transmission ?? ""}
            onChange={(v) => setField("transmission", v)}
            options={[
              { value: "manual", label: "Manual" },
              { value: "automatic", label: "Automatic" },
            ]}
          />
        </div>
      </div>

      {/* Budget & locations */}
      <div className="space-y-4">
        <FormField
          label="Budget (Max, ₹)"
          field="maxBudget"
          type="number"
          value={maxBudget ?? ""}
          onChange={(v) => setField("maxBudget", v)}
          placeholder="e.g. 1000000"
        />

        <div className="space-y-1">
          <label className="text-sm font-medium">Preferred Locations (comma-separated)</label>
          <input
            className="border rounded w-full py-2 px-3"
            placeholder="e.g. Mumbai, Pune, Remote"
            value={locText}
            onChange={(e) => setLocText(e.target.value)}
            onBlur={commitLocations}
          />
          <p className="text-xs text-gray-500">Saved as a list of locations.</p>
        </div>
      </div>

      {/* Additional info */}
      <FormField
        label="Additional Information"
        field="description"
        type="textarea"
        value={description ?? ""}
        onChange={(v) => setField("description", v)}
        placeholder="Any specific requirements or constraints…"
      />

      {/* Contact (nested sellerInfo as used across the app) */}
      <div className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Your name"
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

      {/* Location picker:
          Your global map component should write to location.{address,lat,lng}
          If you want a fallback input here, uncomment:
      <FormField label="Address" field="location.address" placeholder="City / State" />
      */}
    </div>
  );
}
