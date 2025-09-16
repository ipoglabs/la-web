// src/app/post/preview/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePostFormStore } from "../store/postFormStore";
import { Button } from "@/components/ui/button";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import { addPost } from "@/app/actions/addPost";
import { buildPostFormData } from "@/lib/buildPostFormData";

function fmtCurrency(v: unknown) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(v: unknown) {
  if (!v) return undefined;
  const d = new Date(String(v));
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString();
}

const CURRENCY_KEYS = new Set([
  "rentPrice",
  "salePrice",
  "deposit",
  "maintenance",
  "price",
  "rent",
  "rateNightly",
  "rateWeekly",
  "rateMonthly",
  "salary",
  "hourlyRate",
  "stipendAmount",
  "budgetAmount",
]);

function renderValue(key: string, value: any): string {
  if (CURRENCY_KEYS.has(key)) {
    return fmtCurrency(value) ?? "—";
  }
  if (key === "available_from") {
    return fmtDate(value) ?? "—";
  }
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

// helper to display preferred_locations as string or array
function renderPreferredLocations(v: any) {
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "string") return v.trim() || "—";
  return "—";
}

export default function PreviewPage() {
  const data = usePostFormStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const has = (k: string) =>
    data[k] !== undefined && data[k] !== null && String(data[k]).trim() !== "";

  const row = (label: string, value: any, keyHint?: string) => (
    <p>
      <b>{label}:</b>{" "}
      {keyHint
        ? renderValue(keyHint, value)
        : Array.isArray(value)
        ? value.length
          ? value.join(", ")
          : "—"
        : String(value ?? "—")}
    </p>
  );

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
      const res = await addPost(fd); // supports return-or-redirect
      setLoading(false);

      // If your server action returns a result object
      if (res && (res as any).ok && (res as any).id) {
        router.push(`/post-details/${(res as any).id}`);
        return;
      }

      // If it returned a falsy/failed object
      if (res && (res as any).ok === false) {
        setClientError((res as any).error || "Submit failed. Please try again.");
        return;
      }

      // If it redirected, Next will have navigated already; no action needed.
    } catch (err: any) {
      // If the server action throws a non-redirect error
      console.error("❌ submit error", err);
      setClientError(
        err?.message ||
          "Submit failed. Please check required fields and try again."
      );
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
          {row(
            "Category",
            `${data.category || "—"}${data.subcategory ? ` → ${data.subcategory}` : ""}`
          )}
          {row("Title", data.name || "—")}
          {row("Description", data.description || "—")}
        </section>

        {/* Details */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Details</h3>

          {/* Common property fields */}
          {has("propertyType") && row("Type", data.propertyType)}
          {has("beds") && row("Beds", data.beds)}
          {has("baths") && row("Baths", data.baths)}
          {has("rentPrice") && row("Rent", data.rentPrice, "rentPrice")}
          {has("salePrice") && row("Sale Price", data.salePrice, "salePrice")}
          {has("deposit") && row("Deposit", data.deposit, "deposit")}
          {has("occupancy") && row("Occupancy", data.occupancy)}
          {has("gender_pref") && row("Gender Preference", data.gender_pref)}
          {Array.isArray(data.facilities) && row("Facilities", data.facilities)}

          {/* Commercial extras */}
          {has("builtup_area") && row("Built-up Area (sq ft)", data.builtup_area)}
          {has("carpet_area") && row("Carpet Area (sq ft)", data.carpet_area)}
          {has("floor") && row("Floor", data.floor)}
          {has("totalFloors") && row("Total Floors", data.totalFloors)}
          {has("furnishing") && row("Furnishing", data.furnishing)}
          {has("washrooms") && row("Washrooms", data.washrooms)}
          {has("pantry") && row("Pantry", data.pantry)}
          {has("parkingSpaces") && row("Parking Spaces", data.parkingSpaces)}
          {has("maintenance") && row("Maintenance", data.maintenance, "maintenance")}
          {has("available_from") &&
            row("Available From", data.available_from, "available_from")}
          {has("leaseTerm") && row("Lease Term (months)", data.leaseTerm)}
          {has("powerBackup") && row("Power Backup", data.powerBackup)}

          {/* Room Rental */}
          {has("type") && row("Room Type", data.type)}
          {has("rent") && row("Monthly Rent", data.rent, "rent")}
          {has("preferred_tenants") && row("Preferred Tenants", data.preferred_tenants)}
          {Array.isArray(data.amenities) && row("Amenities", data.amenities)}
          {Array.isArray(data.rules) && row("Rules", data.rules)}

          {/* Holiday Rental */}
          {has("holidayType") && row("Holiday Property Type", data.holidayType)}
          {has("guests") && row("Guests", data.guests)}
          {Array.isArray(data.house_rules) && row("House Rules", data.house_rules)}
          {has("rateNightly") && row("Nightly Rate", data.rateNightly, "rateNightly")}
          {has("rateWeekly") && row("Weekly Rate", data.rateWeekly, "rateWeekly")}
          {has("rateMonthly") && row("Monthly Rate", data.rateMonthly, "rateMonthly")}

          {/* Property Sale extras */}
          {has("plot_area") && row("Plot Area (sq.ft.)", data.plot_area)}
          {has("negotiable") && row("Price Negotiable", data.negotiable)}
          {has("ownership") && row("Ownership Type", data.ownership)}
          {has("age") && row("Age of Property", data.age)}

          {/* Jobs → Full Time / Part Time / etc. */}
          {has("jobType") && row("Job Type", data.jobType)}
          {has("company") && row("Company", data.company)}
          {has("salary") && row("Salary", data.salary, "salary")}
          {has("hourlyRate") && row("Hourly Rate", data.hourlyRate, "hourlyRate")}
          {has("stipendAmount") && row("Stipend Amount", data.stipendAmount, "stipendAmount")}
          {has("budgetAmount") && row("Budget Amount", data.budgetAmount, "budgetAmount")}
          {has("experience") && row("Experience", data.experience)}
          {Array.isArray(data.skills) && row("Skills", data.skills)}
          {Array.isArray(data.benefits) && row("Benefits", data.benefits)}
          {has("workMode") && row("Work Mode", data.workMode)}

          {/* ✅ Jobs → Wanted specific */}
          {has("candidateName") && row("Candidate Name", data.candidateName)}
          {has("employmentType") && row("Employment Type", data.employmentType)}
          {(has("preferred_locations") || Array.isArray(data.preferred_locations)) && (
            <p>
              <b>Preferred Locations:</b> {renderPreferredLocations(data.preferred_locations)}
            </p>
          )}
          {has("available_from") &&
            row("Available From", data.available_from, "available_from")}
        </section>

        {/* Contact Details */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Contact Details</h3>
          {row("Name", data.sellerInfo?.name || "—")}
          {row("Email", data.sellerInfo?.email || "—")}
          {row("Phone", data.sellerInfo?.phone || "—")}
        </section>

        {/* Location */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Location</h3>
          {row("Address", data.location?.address || "—")}
        </section>

        {/* Images */}
        {Array.isArray(data.images) && data.images.length > 0 && (
          <section className="space-y-2 border-b pb-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="flex flex-wrap gap-3">
              {data.images
                .filter(
                  (img: any) => img instanceof File || typeof img === "string"
                )
                .map((img: any, i: number) => {
                  const url =
                    img instanceof File ? URL.createObjectURL(img) : (img as string);
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

        {/* Debug JSON */}
        <section>
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-600">
              Debug JSON
            </summary>
          <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 p-2 rounded overflow-auto">
              {debugJson}
            </pre>
          </details>
        </section>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Post"}
        </Button>
      </main>
      <AppFooter />
    </>
  );
}
