// src/app/post/preview/page.tsx
"use client";

import { useState, useMemo } from "react";
import { usePostFormStore } from "../store/postFormStore";
import { Button } from "@/components/ui/button";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import { addPost } from "@/app/actions/addPost";
import { buildPostFormData } from "@/lib/buildPostFormData";

export default function PreviewPage() {
  const data = usePostFormStore();
  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // ---- small helpers ----
  const has = (k: string) =>
    data[k] !== undefined && data[k] !== null && String(data[k]).trim() !== "";

  const show = (label: string, value: any) => (
    <p>
      <b>{label}:</b>{" "}
      {Array.isArray(value)
        ? value.length
          ? value.join(", ")
          : "—"
        : value ?? "—"}
    </p>
  );

  // mirror server-side requireds
  const missing = useMemo(() => {
    const m: string[] = [];
    if (!data.name) m.push("Title");
    if (!data.description) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
    if (!data.location?.address) m.push("Location");
    if (!data.sellerInfo?.name) m.push("Contact Name");
    if (!data.sellerInfo?.email) m.push("Contact Email");
    if (!data.sellerInfo?.phone) m.push("Contact Phone");
    return m;
  }, [data]);

  // ✅ add this (so <details> has content even without images)
  const debugJson = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return "—";
    }
  }, [data]);

  const handleSubmit = async () => {
    setClientError(null);
    if (missing.length) {
      setClientError(`Please fill: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    const fd = buildPostFormData(data);

    try {
      await addPost(fd); // redirects on success
    } catch (err: any) {
      console.error("❌ submit error", err);
      setClientError(
        err?.message || "Submit failed. Please check required fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Preview Your Post</h2>

        {clientError && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded">
            {clientError}
          </div>
        )}

        {/* Basic Info */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Basic Info</h3>
          {show(
            "Category",
            `${data.category || "—"}${data.subcategory ? ` → ${data.subcategory}` : ""}`
          )}
          {show("Title", data.name || "—")}
          {show("Description", data.description || "—")}
        </section>

        {/* Property / Commercial Details (render only if present) */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Details</h3>

          {/* Common property fields */}
          {has("propertyType") && show("Type", data.propertyType)}
          {has("beds") && show("Beds", data.beds)}
          {has("baths") && show("Baths", data.baths)}
          {has("rentPrice") && show("Rent", data.rentPrice)}
          {has("salePrice") && show("Sale Price", data.salePrice)}
          {has("deposit") && show("Deposit", data.deposit)}
          {has("occupancy") && show("Occupancy", data.occupancy)}
          {has("gender_pref") && show("Gender Preference", data.gender_pref)}
          {Array.isArray(data.facilities) && show("Facilities", data.facilities)}

          {/* Commercial extras */}
          {has("builtup_area") && show("Built-up Area (sq ft)", data.builtup_area)}
          {has("carpet_area") && show("Carpet Area (sq ft)", data.carpet_area)}
          {has("floor") && show("Floor", data.floor)}
          {has("totalFloors") && show("Total Floors", data.totalFloors)}
          {has("furnishing") && show("Furnishing", data.furnishing)}
          {has("washrooms") && show("Washrooms", data.washrooms)}
          {has("pantry") && show("Pantry", data.pantry)}
          {has("parkingSpaces") && show("Parking Spaces", data.parkingSpaces)}
          {has("maintenance") && show("Maintenance", data.maintenance)}
          {has("available_from") && show("Available From", data.available_from)}
          {has("leaseTerm") && show("Lease Term (months)", data.leaseTerm)}
          {has("powerBackup") && show("Power Backup", data.powerBackup)}

          {/* Room Rental / other examples */}
          {has("type") && show("Room Type", data.type)}
          {has("rent") && show("Monthly Rent", data.rent)}
          {has("preferred_tenants") && show("Preferred Tenants", data.preferred_tenants)}
          {Array.isArray(data.amenities) && show("Amenities", data.amenities)}
          {Array.isArray(data.rules) && show("Rules", data.rules)}
        </section>

        {/* Contact Details */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Contact Details</h3>
          {show("Name", data.sellerInfo?.name || "—")}
          {show("Email", data.sellerInfo?.email || "—")}
          {show("Phone", data.sellerInfo?.phone || "—")}
        </section>

        {/* Location */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Location</h3>
          {show("Address", data.location?.address || "—")}
        </section>

        {/* Images */}
        {Array.isArray(data.images) && data.images.length > 0 && (
          <section className="space-y-2 border-b pb-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="flex flex-wrap gap-3">
              {data.images.map((img, i) => {
                const url = img instanceof File ? URL.createObjectURL(img) : img;
                return (
                  <img
                    key={i}
                    src={url}
                    alt={`preview-${i}`}
                    className="w-28 h-28 object-cover rounded"
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Debug JSON (always available) */}
        {/* <section>
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-600">Debug JSON</summary>
            <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 p-2 rounded overflow-auto">
              {debugJson}
            </pre>
          </details>
        </section> */}

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Post"}
        </Button>
      </main>
      <AppFooter />
    </>
  );
}
