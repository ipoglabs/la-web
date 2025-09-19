// src/app/components/form/vehicles/PartsForm.tsx
"use client";

import { useEffect, useState } from "react";
import { usePostFormStore } from "@/app/post/store/postFormStore";
import FormField from "@/app/components/form/fields/FormField";
import SelectField from "@/app/components/form/fields/SelectField";

export default function PartsForm() {
  const setField         = usePostFormStore((s) => s.setField);

  // read values so inputs are controlled
  const sellerInfo       = usePostFormStore((s) => s.sellerInfo);
  const name             = usePostFormStore((s) => s.name);
  const description      = usePostFormStore((s) => s.description);
  const partsCategory    = usePostFormStore((s) => (s as any).partsCategory);
  const brand            = usePostFormStore((s) => s.brand);
  const condition        = usePostFormStore((s) => s.condition);
  const compatibilityVal = usePostFormStore((s) => (s as any).compatibility); // string[]
  const featuresVal      = usePostFormStore((s) => (s as any).features);      // string[]
  const salePrice        = usePostFormStore((s) => s.salePrice);
  const mrp              = usePostFormStore((s) => (s as any).mrp);
  const negotiable       = usePostFormStore((s) => (s as any).negotiable);    // "Yes"/"No"
  const warrantyMonths   = usePostFormStore((s) => (s as any).warrantyMonths);
  const returnPolicy     = usePostFormStore((s) => (s as any).returnPolicy);
  const stockQty         = usePostFormStore((s) => (s as any).stockQty);
  const oemPartNumber    = usePostFormStore((s) => (s as any).oemPartNumber);
  const partNumber       = usePostFormStore((s) => (s as any).partNumber);
  const color            = usePostFormStore((s) => (s as any).color);
  const material         = usePostFormStore((s) => (s as any).material);
  const shippingAvailable= usePostFormStore((s) => (s as any).shippingAvailable); // "Yes"/"No"
  const deliveryOptions  = usePostFormStore((s) => (s as any).deliveryOptions);   // string[]

  // (Optional) auto-tag the post
  // useEffect(() => {
  //   setField("category", "Vehicles");
  //   setField("subcategory", "Parts & Accessories");
  // }, [setField]);

  // comma -> array helpers
  const [compatibilityText, setCompatibilityText] = useState(
    Array.isArray(compatibilityVal) ? compatibilityVal.join(", ") : ""
  );
  const commitCompatibility = () => {
    const arr = compatibilityText.split(",").map(s => s.trim()).filter(Boolean);
    setField("compatibility", arr);
  };

  const [featuresText, setFeaturesText] = useState(
    Array.isArray(featuresVal) ? featuresVal.join(", ") : ""
  );
  const commitFeatures = () => {
    const arr = featuresText.split(",").map(s => s.trim()).filter(Boolean);
    setField("features", arr);
  };

  // delivery options as comma list too (doorstep, pickup, courier, etc.)
  const [deliveryText, setDeliveryText] = useState(
    Array.isArray(deliveryOptions) ? deliveryOptions.join(", ") : ""
  );
  const commitDelivery = () => {
    const arr = deliveryText.split(",").map(s => s.trim()).filter(Boolean);
    setField("deliveryOptions", arr);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">Post Vehicle Parts & Accessories</h2>

      {/* ===== Basic Info ===== */}
      <div className="space-y-6">
        <FormField
          label="Part Name"
          field="name"
          value={name ?? ""}
          onChange={(v) => setField("name", v)}
          placeholder="e.g. Brake Pads, Car Battery"
          required
        />
        <FormField
          label="Description"
          field="description"
          type="textarea"
          value={description ?? ""}
          onChange={(v) => setField("description", v)}
          placeholder="Key specs, condition, what’s included…"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            label="Parts Category"
            field="partsCategory"
            value={partsCategory ?? ""}
            onChange={(v) => setField("partsCategory", v)}
            options={[
              { value: "engine",    label: "Engine Parts" },
              { value: "electrical",label: "Electrical & Lighting" },
              { value: "interior",  label: "Interior Accessories" },
              { value: "exterior",  label: "Exterior Accessories" },
              { value: "tyres",     label: "Tyres & Wheels" },
              { value: "others",    label: "Others" },
            ]}
          />
          <FormField
            label="Brand"
            field="brand"
            value={brand ?? ""}
            onChange={(v) => setField("brand", v)}
            placeholder="e.g. Bosch, MRF, Exide"
          />
          <SelectField
            label="Condition"
            field="condition"
            value={condition ?? ""}
            onChange={(v) => setField("condition", v)}
            options={[
              { value: "new",          label: "New" },
              { value: "used",         label: "Used" },
              { value: "refurbished",  label: "Refurbished" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Compatibility */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Compatibility (comma-separated)</label>
            <input
              className="border rounded w-full py-2 px-3"
              placeholder="e.g. Maruti Swift, Hero Splendor"
              value={compatibilityText}
              onChange={(e) => setCompatibilityText(e.target.value)}
              onBlur={commitCompatibility}
            />
            <p className="text-xs text-gray-500">Saved as a list.</p>
          </div>
          {/* Features */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Key Features (comma-separated)</label>
            <input
              className="border rounded w-full py-2 px-3"
              placeholder="e.g. OEM grade, Heat-resistant, Plug-and-play"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              onBlur={commitFeatures}
            />
            <p className="text-xs text-gray-500">Saved as a list.</p>
          </div>
        </div>
      </div>

      {/* ===== Pricing & Policies (commercial-style) ===== */}
      <div className="space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold">Pricing & Policies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="MRP (₹)"
            field="mrp"
            type="number"
            value={mrp ?? ""}
            onChange={(v) => setField("mrp", v)}
            placeholder="e.g. 4500"
          />
          <FormField
            label="Selling Price (₹)"
            field="salePrice"
            type="number"
            value={salePrice ?? ""}
            onChange={(v) => setField("salePrice", v)}
            placeholder="e.g. 3999"
          />
          <SelectField
            label="Negotiable"
            field="negotiable"
            value={negotiable ?? ""}
            onChange={(v) => setField("negotiable", v)}
            options={[
              { value: "Yes" },
              { value: "No"  },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Warranty (months)"
            field="warrantyMonths"
            type="number"
            value={warrantyMonths ?? ""}
            onChange={(v) => setField("warrantyMonths", v)}
            placeholder="e.g. 12"
          />
          <SelectField
            label="Return Policy"
            field="returnPolicy"
            value={returnPolicy ?? ""}
            onChange={(v) => setField("returnPolicy", v)}
            options={[
              { value: "no-returns", label: "No Returns" },
              { value: "7-days",     label: "7 Days" },
              { value: "10-days",    label: "10 Days" },
              { value: "30-days",    label: "30 Days" },
            ]}
          />
          <FormField
            label="Stock Quantity"
            field="stockQty"
            type="number"
            value={stockQty ?? ""}
            onChange={(v) => setField("stockQty", v)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* ===== Identification & Attributes ===== */}
      <div className="space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold">Identification & Attributes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="OEM Part Number"
            field="oemPartNumber"
            value={oemPartNumber ?? ""}
            onChange={(v) => setField("oemPartNumber", v)}
            placeholder="e.g. 1K0-615-301AA"
          />
          <FormField
            label="Seller Part Number"
            field="partNumber"
            value={partNumber ?? ""}
            onChange={(v) => setField("partNumber", v)}
            placeholder="Internal SKU / Part ID"
          />
          <FormField
            label="Color"
            field="color"
            value={color ?? ""}
            onChange={(v) => setField("color", v)}
            placeholder="e.g. Black"
          />
        </div>
        <FormField
          label="Material"
          field="material"
          value={material ?? ""}
          onChange={(v) => setField("material", v)}
          placeholder="e.g. Rubber, ABS Plastic, Alloy"
        />
      </div>

      {/* ===== Shipping / Delivery ===== */}
      <div className="space-y-6 border-t pt-6">
        <h3 className="text-lg font-semibold">Shipping / Delivery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            label="Shipping Available"
            field="shippingAvailable"
            value={shippingAvailable ?? ""}
            onChange={(v) => setField("shippingAvailable", v)}
            options={[
              { value: "Yes" },
              { value: "No"  },
            ]}
          />
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Delivery Options (comma-separated)</label>
            <input
              className="border rounded w-full py-2 px-3"
              placeholder="e.g. Courier, Store Pickup, Doorstep"
              value={deliveryText}
              onChange={(e) => setDeliveryText(e.target.value)}
              onBlur={commitDelivery}
            />
            <p className="text-xs text-gray-500">Saved as a list.</p>
          </div>
        </div>
      </div>

      {/* ===== Contact Details (same nested pattern) ===== */}
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

      {/* Location handled by your global map picker (writes to location.{address,lat,lng}) */}
      {/* Fallback (optional):
      <FormField label="Address" field="location.address" placeholder="City, State" />
      */}
    </div>
  );
}
