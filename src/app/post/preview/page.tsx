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

// Currency-ish keys (incl. jobs/vehicles/parts/wanted)
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
  "maxBudget",
]);

function renderValue(key: string, value: any): string {
  if (CURRENCY_KEYS.has(key)) return fmtCurrency(value) ?? "—";

  // date-ish
  if (
    key === "available_from" ||
    key === "deadline" ||
    key === "startDate" ||
    key === "insuranceValidTill"
  ) {
    return fmtDate(value) ?? "—";
  }

  // vehicle niceties
  if (key === "kms" && value !== undefined && value !== null && value !== "") {
    return `${value} km`;
  }
  if (
    key === "engineCapacity" &&
    value !== undefined &&
    value !== null &&
    value !== ""
  ) {
    return `${value} cc`;
  }

  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function renderMaybeLink(value: any) {
  const s = String(value ?? "");
  if (!s) return "—";
  try {
    const u = new URL(s);
    return (
      <a
        href={u.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {u.hostname}
      </a>
    );
  } catch {
    return s;
  }
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
    const res = await addPost(fd); // returns { ok, id } on success
    setLoading(false);

    if (!res || (res as any).ok === false) {
      const msg =
        (res as any)?.error ||
        "Submit failed. Please check required fields and try again.";
      setClientError(msg);
      return;
    }

    router.push(`/post-details/${(res as any).id}`);
  };

  // quick booleans for sectioning
  const cat = String(data.category || "").toLowerCase();
  const sub = String(data.subcategory || "").toLowerCase();
  const isVehicle = cat === "vehicles" || has("make") || has("model");
  const isParts =
    (cat === "vehicles" && sub.includes("parts")) ||
    has("partsCategory") ||
    has("compatibility");
  const isVehicleWanted =
    (cat === "vehicles" && sub.includes("wanted")) ||
    has("vehicleType") ||
    has("maxBudget") ||
    has("preferred_locations");

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
            `${data.category || "—"}${
              data.subcategory ? ` → ${data.subcategory}` : ""
            }`
          )}
          {row("Title", data.name || "—")}
          {row("Description", data.description || "—")}
        </section>

        {/* Details */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Details</h3>

          {/* Vehicles — show a friendly Price even though it's salePrice */}
          {isVehicle && !isParts && !isVehicleWanted && (
            <>
              {has("salePrice") && row("Price", data.salePrice, "salePrice")}
              {has("make") && row("Make", data.make)}
              {has("model") && row("Model", data.model)}
              {has("year") && row("Year", data.year)}
              {has("kms") && row("Mileage", data.kms, "kms")}
              {has("engineCapacity") &&
                row("Engine Capacity", data.engineCapacity, "engineCapacity")}
              {has("fuelType") && row("Fuel Type", data.fuelType)}
              {has("transmission") && row("Transmission", data.transmission)}
              {has("bodyType") && row("Body Type", data.bodyType)}
              {has("color") && row("Color", data.color)}
              {has("condition") && row("Condition", data.condition)}
              {has("ownerType") && row("Owner Type", data.ownerType)}
              {has("registrationNumber") &&
                row("Registration Number", data.registrationNumber)}
              {has("insuranceValidTill") &&
                row(
                  "Insurance Valid Till",
                  data.insuranceValidTill,
                  "insuranceValidTill"
                )}
              {has("serviceHistory") &&
                row("Service History", data.serviceHistory)}
              {Array.isArray(data.features) && row("Features", data.features)}
            </>
          )}

          {/* Vehicles → Parts & Accessories */}
          {isParts && (
            <>
              {has("salePrice") && row("Price", data.salePrice, "salePrice")}
              {has("partsCategory") &&
                row("Parts Category", data.partsCategory)}
              {has("brand") && row("Brand", data.brand)}
              {has("condition") && row("Condition", data.condition)}
              {Array.isArray(data.compatibility) ||
              typeof data.compatibility === "string"
                ? row("Compatibility", data.compatibility)
                : null}
            </>
          )}

          {/* Vehicles → Wanted */}
          {isVehicleWanted && (
            <>
              {has("vehicleType") && row("Vehicle Type", data.vehicleType)}
              {has("make") && row("Preferred Make", data.make)}
              {has("model") && row("Preferred Model", data.model)}
              {has("year") && row("Preferred Year (min.)", data.year)}
              {has("fuelType") && row("Fuel Type", data.fuelType)}
              {has("transmission") && row("Transmission", data.transmission)}
              {has("maxBudget") && row("Max Budget", data.maxBudget, "maxBudget")}
              {Array.isArray(data.preferred_locations) ||
              typeof data.preferred_locations === "string"
                ? row("Preferred Locations", data.preferred_locations)
                : null}
            </>
          )}

          {/* Property-type (if any present) */}
          {has("propertyType") && row("Type", data.propertyType)}
          {has("beds") && row("Beds", data.beds)}
          {has("baths") && row("Baths", data.baths)}
          {has("rentPrice") && row("Rent", data.rentPrice, "rentPrice")}
          {has("salePrice") &&
            !isVehicle &&
            !isParts &&
            row("Sale Price", data.salePrice, "salePrice")}
          {has("deposit") && row("Deposit", data.deposit, "deposit")}
          {has("occupancy") && row("Occupancy", data.occupancy)}
          {has("gender_pref") && row("Gender Preference", data.gender_pref)}
          {Array.isArray(data.facilities) && row("Facilities", data.facilities)}

          {/* Commercial extras */}
          {has("builtup_area") &&
            row("Built-up Area (sq ft)", data.builtup_area)}
          {has("carpet_area") &&
            row("Carpet Area (sq ft)", data.carpet_area)}
          {has("floor") && row("Floor", data.floor)}
          {has("totalFloors") && row("Total Floors", data.totalFloors)}
          {has("furnishing") && row("Furnishing", data.furnishing)}
          {has("washrooms") && row("Washrooms", data.washrooms)}
          {has("pantry") && row("Pantry", data.pantry)}
          {has("parkingSpaces") &&
            row("Parking Spaces", data.parkingSpaces)}
          {has("maintenance") &&
            row("Maintenance", data.maintenance, "maintenance")}
          {has("available_from") &&
            row("Available From", data.available_from, "available_from")}
          {has("leaseTerm") && row("Lease Term (months)", data.leaseTerm)}
          {has("powerBackup") && row("Power Backup", data.powerBackup)}

          {/* Room Rental */}
          {has("type") && row("Room Type", data.type)}
          {has("rent") && row("Monthly Rent", data.rent, "rent")}
          {has("preferred_tenants") &&
            row("Preferred Tenants", data.preferred_tenants)}
          {Array.isArray(data.amenities) && row("Amenities", data.amenities)}
          {Array.isArray(data.rules) && row("Rules", data.rules)}

          {/* Holiday Rental */}
          {has("holidayType") &&
            row("Holiday Property Type", data.holidayType)}
          {has("guests") && row("Guests", data.guests)}
          {Array.isArray(data.house_rules) &&
            row("House Rules", data.house_rules)}
          {has("rateNightly") &&
            row("Nightly Rate", data.rateNightly, "rateNightly")}
          {has("rateWeekly") &&
            row("Weekly Rate", data.rateWeekly, "rateWeekly")}
          {has("rateMonthly") &&
            row("Monthly Rate", data.rateMonthly, "rateMonthly")}

          {/* Property Sale extras */}
          {has("plot_area") && row("Plot Area (sq.ft.)", data.plot_area)}
          {has("negotiable") && row("Price Negotiable", data.negotiable)}
          {has("ownership") && row("Ownership Type", data.ownership)}
          {has("age") && row("Age of Property", data.age)}

          {/* Jobs – common */}
          {has("employmentType") && row("Employment Type", data.employmentType)}
          {has("jobType") && row("Job Type", data.jobType)}
          {has("company") && row("Company", data.company)}
          {has("salary") && row("Salary", data.salary, "salary")}
          {has("hourlyRate") &&
            row("Hourly Rate", data.hourlyRate, "hourlyRate")}
          {has("deadline") &&
            row("Application Deadline", data.deadline, "deadline")}
          {has("applyLink") && (
            <p>
              <b>Apply Link:</b> {renderMaybeLink(data.applyLink)}
            </p>
          )}
          {Array.isArray(data.shifts) && row("Shifts", data.shifts)}
          {has("experience") && row("Experience", data.experience)}
          {Array.isArray(data.skills) && row("Skills", data.skills)}
          {Array.isArray(data.benefits) && row("Benefits", data.benefits)}
          {has("workMode") && row("Work Mode", data.workMode)}
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
              {data.images.map((img, i) => {
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
