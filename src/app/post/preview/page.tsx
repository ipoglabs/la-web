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
  "maxBudget",
  "budget",
]);

function renderValue(key: string, value: any): string {
  if (CURRENCY_KEYS.has(key)) return fmtCurrency(value) ?? "—";

  if (
    key === "available_from" ||
    key === "deadline" ||
    key === "startDate" ||
    key === "endDate" ||
    key === "insuranceValidTill" ||
    key === "lfDate" ||
    key === "date"
  ) {
    return fmtDate(value) ?? "—";
  }

  if (key === "kms" && value) return `${value} km`;
  if (key === "engineCapacity" && value) return `${value} cc`;

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

  // Location is now OPTIONAL to avoid blocking forms that don't collect it
  const missing = useMemo(() => {
    const m: string[] = [];
    if (!data.name) m.push("Title");
    if (!data.description) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
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
    const res = await addPost(fd);
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

  const isPets = cat === "pets" || cat === "pet";
  const isPetAdoption = isPets && sub.includes("adoption");
  const isPetWanted = isPets && sub.includes("wanted");
  const isPetAccessories = isPets && sub.includes("accessories");
  const isPetLostFound =
    isPets && (sub.includes("lost") || sub.includes("found"));
  const isPetServices = isPets && sub.includes("service");

  const isServices =
    cat === "services" || ["education", "food", "health", "home", "other", "technology", "travel", "tutoring", "wanted"].some(s => sub.includes(s));

  const isEdu = isServices && sub.includes("education");
  const isFood = isServices && sub.includes("food");
  const isHealth = isServices && sub.includes("health");
  const isHome = isServices && sub.includes("home");
  const isOther = isServices && sub.includes("other");
  const isTech = isServices && (sub.includes("tech") || sub.includes("technology"));
  const isTravel = isServices && sub.includes("travel");
  const isTutoring = isServices && sub.includes("tutoring");
  const isSvcWanted = isServices && sub.includes("wanted");

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

          {/* ===== Pets: Adoption ===== */}
          {isPetAdoption && (
            <>
              {has("petName") && row("Pet Name", data.petName)}
              {has("petType") && row("Pet Type", data.petType)}
              {has("breed") && row("Breed", data.breed)}
              {has("ageText") && row("Age", data.ageText)}
              {has("age") && !has("ageText") && row("Age", data.age)}
              {has("gender") && row("Gender", data.gender)}
              {has("vaccination") && row("Vaccination", data.vaccination)}
              {has("size") && row("Size", data.size)}
              {has("price") && row("Adoption Fee", data.price, "price")}
              {!has("price") && has("salePrice") &&
                row("Adoption Fee", data.salePrice, "salePrice")}
            </>
          )}

          {/* ===== Pets: Wanted ===== */}
          {isPetWanted && (
            <>
              {has("wantedPetType") &&
                row("Wanted Pet Type", data.wantedPetType)}
              {has("breedPreference") &&
                row("Breed Preference", data.breedPreference)}
              {has("agePreference") &&
                row("Age Preference", data.agePreference)}
              {has("genderPreference") &&
                row("Gender Preference", data.genderPreference)}
              {has("sizePreference") &&
                row("Size Preference", data.sizePreference)}
              {has("budget") && row("Budget", data.budget, "budget")}
            </>
          )}

          {/* ===== Pets: Accessories ===== */}
          {isPetAccessories && (
            <>
              {has("accessoryName") && row("Accessory Name", data.accessoryName)}
              {has("partsCategory") && row("Category", data.partsCategory)}
              {has("brand") && row("Brand", data.brand)}
              {has("condition") && row("Condition", data.condition)}
              {has("price") && row("Price", data.price, "price")}
              {!has("price") && has("salePrice") &&
                row("Price", data.salePrice, "salePrice")}
            </>
          )}

          {/* ===== Pets: Lost & Found ===== */}
          {isPetLostFound && (
            <>
              {has("reportType") && row("Report Type", data.reportType)}
              {has("petType") && row("Pet Type", data.petType)}
              {has("breed") && row("Breed", data.breed)}
              {has("color") && row("Color", data.color)}
              {has("ageText") && row("Age", data.ageText)}
              {has("age") && !has("ageText") && row("Age", data.age)}
              {has("lastSeenLocation") &&
                row("Last Seen Location", data.lastSeenLocation)}
              {has("lfDate") && row("Date", data.lfDate, "lfDate")}
              {has("date") && !has("lfDate") && row("Date", data.date, "date")}
            </>
          )}

          {/* ===== Pets: Services ===== */}
          {isPetServices && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("serviceProviderName") &&
                row("Provider Name", data.serviceProviderName)}
              {has("experience") && row("Experience", data.experience)}
              {has("availability") && row("Availability", data.availability)}
              {has("price") && row("Price", data.price, "price")}
              {!has("price") && has("salePrice") &&
                row("Price", data.salePrice, "salePrice")}
            </>
          )}

          {/* ===== Services: Education ===== */}
          {isEdu && (
            <>
              {has("educationType") && row("Education Type", data.educationType)}
              {has("subject") && row("Subject / Course", data.subject)}
              {has("mode") && row("Mode of Study", data.mode)}
              {has("qualification") &&
                row("Required Qualification", data.qualification)}
              {has("experience") && row("Experience (years)", data.experience)}
              {has("availability") &&
                row("Availability / Schedule", data.availability)}
              {has("price") && row("Fees / Price", data.price, "price")}
            </>
          )}

          {/* ===== Services: Food ===== */}
          {isFood && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("cuisineType") && row("Cuisine Type", data.cuisineType)}
              {Array.isArray(data.dietaryOptions) &&
                row("Dietary Options", data.dietaryOptions)}
              {has("price") && row("Price", data.price, "price")}
              {has("deliveryAvailable") &&
                row("Delivery Available", data.deliveryAvailable)}
            </>
          )}

          {/* ===== Services: Health ===== */}
          {isHealth && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("providerName") && row("Provider Name", data.providerName)}
              {has("qualification") && row("Qualification", data.qualification)}
              {has("experience") && row("Experience", data.experience)}
              {has("consultationMode") &&
                row("Consultation Mode", data.consultationMode)}
              {has("price") && row("Consultation Fee", data.price, "price")}
              {has("availability") && row("Availability", data.availability)}
            </>
          )}

          {/* ===== Services: Home ===== */}
          {isHome && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("experience") && row("Experience", data.experience)}
              {has("availability") && row("Availability", data.availability)}
              {has("price") && row("Service Charge", data.price, "price")}
            </>
          )}

          {/* ===== Services: Other ===== */}
          {isOther && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("availability") && row("Availability", data.availability)}
              {has("price") && row("Price", data.price, "price")}
            </>
          )}

          {/* ===== Services: Technology ===== */}
          {isTech && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {Array.isArray(data.skills) && row("Skills", data.skills)}
              {has("experience") && row("Experience", data.experience)}
              {has("availability") && row("Availability", data.availability)}
              {has("rateType") && row("Rate Type", data.rateType)}
              {has("price") && row("Rate", data.price, "price")}
            </>
          )}

          {/* ===== Services: Travel ===== */}
          {isTravel && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("destination") && row("Destination", data.destination)}
              {has("packageDetails") &&
                row("Package Details", data.packageDetails)}
              {has("duration") && row("Duration", data.duration)}
              {has("price") && row("Price", data.price, "price")}
              {has("availability") && row("Availability", data.availability)}
              {has("agencyName") && row("Agency Name", data.agencyName)}
            </>
          )}

          {/* ===== Services: Tutoring ===== */}
          {isTutoring && (
            <>
              {has("subject") && row("Subject", data.subject)}
              {has("level") && row("Level", data.level)}
              {has("mode") && row("Mode", data.mode)}
              {has("qualification") && row("Qualification", data.qualification)}
              {has("experience") && row("Experience (years)", data.experience)}
              {has("availability") &&
                row("Availability / Schedule", data.availability)}
              {has("price") && row("Hourly Rate", data.price, "price")}
            </>
          )}

          {/* ===== Services: Wanted ===== */}
          {isSvcWanted && (
            <>
              {has("serviceType") && row("Service Type", data.serviceType)}
              {has("budgetAmount") &&
                row("Budget", data.budgetAmount, "budgetAmount")}
              {has("urgency") && row("Urgency", data.urgency)}
            </>
          )}

          {/* ===== Vehicles / Property / Jobs blocks remain in your existing codebase.
               Keep them below if you already had them, or integrate them similarly. ===== */}
        </section>

        {/* Contact Details */}
        <section className="space-y-1 border-b pb-4">
          <h3 className="text-lg font-semibold">Contact Details</h3>
          {row("Name", data.sellerInfo?.name || "—")}
          {row("Email", data.sellerInfo?.email || "—")}
          {row("Phone", data.sellerInfo?.phone || "—")}
        </section>

        {/* Location (optional) */}
        {(data.location?.address || "").trim() ? (
          <section className="space-y-1 border-b pb-4">
            <h3 className="text-lg font-semibold">Location</h3>
            {row("Address", data.location?.address || "—")}
          </section>
        ) : null}

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
