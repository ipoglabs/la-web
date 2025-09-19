// src/app/post-details/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import {
  CATEGORY_CONFIG,
  normalizeCategory,
  normalizeSubcategory,
} from "@/lib/buildPostFormData";

// ---- Labels (shared with Preview) ----
const LABELS: Record<string, string> = {
  // core
  name: "Title",
  description: "Description",
  category: "Category",
  subcategory: "Subcategory",

  // property/common
  propertyType: "Type",
  beds: "Beds",
  baths: "Baths",
  rentPrice: "Rent",
  salePrice: "Sale Price",
  deposit: "Deposit",
  occupancy: "Occupancy",
  gender_pref: "Gender Preference",
  facilities: "Facilities",
  amenities: "Amenities",

  // commercial / extras
  builtup_area: "Built-up Area (sq ft)",
  carpet_area: "Carpet Area (sq ft)",
  floor: "Floor",
  totalFloors: "Total Floors",
  furnishing: "Furnishing",
  washrooms: "Washrooms",
  pantry: "Pantry",
  parkingSpaces: "Parking Spaces",
  maintenance: "Maintenance",
  available_from: "Available From",
  leaseTerm: "Lease Term (months)",
  powerBackup: "Power Backup",

  // room rental
  type: "Room Type",
  rent: "Monthly Rent",
  preferred_tenants: "Preferred Tenants",
  rules: "Rules",

  // holiday rental
  holidayType: "Holiday Property Type",
  guests: "Guests",
  house_rules: "House Rules",
  rateNightly: "Nightly Rate",
  rateWeekly: "Weekly Rate",
  rateMonthly: "Monthly Rate",

  // property sale extras
  plot_area: "Plot Area (sq.ft.)",
  negotiable: "Price Negotiable",
  ownership: "Ownership Type",
  age: "Age of Property",

  // jobs (employer posts)
  jobType: "Job Type",
  company: "Company",
  salary: "Salary",
  experience: "Experience",
  skills: "Skills",
  benefits: "Benefits",
  workMode: "Work Mode",
  hourlyRate: "Hourly Rate",
  deadline: "Application Deadline",
  startDate: "Start Date",
  endDate: "End Date",

  // jobs → wanted (candidate posts)
  candidateName: "Candidate Name",
  employmentType: "Employment Type",
  preferred_locations: "Preferred Locations",

  // vehicles (common)
  make: "Make",
  model: "Model",
  year: "Year",
  kms: "Kilometers",
  fuelType: "Fuel Type",
  transmission: "Transmission",
  bodyType: "Body Type",
  color: "Color",
  condition: "Condition",
  ownerType: "Owner Type",
  registrationNumber: "Registration Number",
  insuranceValidTill: "Insurance Valid Till",
  serviceHistory: "Service History",
  features: "Features",

  // motorcycle extras
  engineCapacity: "Engine Capacity (cc)",

  // van/truck extras
  seatingCapacity: "Seating Capacity",

  // parts & accessories
  partsCategory: "Parts Category",
  brand: "Brand",
  compatibility: "Compatibility",

  // misc examples
  budget: "Budget",
  price: "Price",
};

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
function renderValue(key: string, value: any): string {
  // currency-ish
  if (
    [
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
      "budgetAmount",
      "stipendAmount",
    ].includes(key)
  ) {
    return fmtCurrency(value) ?? "—";
  }

  // date-ish
  if (["available_from", "deadline", "startDate", "endDate", "insuranceValidTill"].includes(key)) {
    return fmtDate(value) ?? "—";
  }

  // vehicles niceties
  if (key === "kms" && value !== undefined && value !== null && value !== "") {
    return `${value} km`;
  }
  if (key === "engineCapacity" && value !== undefined && value !== null && value !== "") {
    return `${value} cc`;
  }

  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

type Post = {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  category: string;
  subcategory?: string;
  location?: { address?: string; lat?: number; lng?: number };
  seller_info?: { name?: string; email?: string; phone?: string };
  [k: string]: any;
};

// ---------- Preview key sets ----------

// Base keys shown for “property-ish” posts (same as Preview)
const BASE_PREVIEW_KEYS: string[] = [
  "propertyType",
  "beds",
  "baths",
  "rentPrice",
  "deposit",
  "occupancy",
  "gender_pref",
  "facilities",
];

// Commercial adds:
const COMMERCIAL_PREVIEW_KEYS: string[] = [
  "builtup_area",
  "carpet_area",
  "floor",
  "totalFloors",
  "furnishing",
  "washrooms",
  "pantry",
  "parkingSpaces",
  "maintenance",
  "available_from",
  "leaseTerm",
  "powerBackup",
];

// Holiday Rental adds:
const HOLIDAY_PREVIEW_KEYS: string[] = [
  "holidayType",
  "guests",
  "house_rules",
  "rateNightly",
  "rateWeekly",
  "rateMonthly",
];

// Room Rental adds:
const ROOM_RENTAL_PREVIEW_KEYS: string[] = [
  "type",
  "rent",
  "preferred_tenants",
  "amenities",
  "rules",
];

// Property Sale adds:
const PROPERTY_SALE_PREVIEW_KEYS: string[] = [
  "salePrice",
  "plot_area",
  "negotiable",
  "ownership",
  "age",
];

// Jobs → Full Time (and similar employer posts)
const JOB_FULLTIME_PREVIEW_KEYS: string[] = [
  "jobType",
  "company",
  "salary",
  "experience",
  "skills",
  "benefits",
  "workMode",
  "hourlyRate",
  "deadline",
  "startDate",
  "endDate",
];

// Jobs → Wanted (candidate posts)
const JOB_WANTED_PREVIEW_KEYS: string[] = [
  "candidateName",
  "employmentType",
  "preferred_locations",
  "available_from",
  "salary",
  "skills",
  "experience",
];

// Vehicles → common (car/van/truck + many work for motorcycle too)
const VEHICLE_COMMON_KEYS: string[] = [
  "salePrice",
  "make",
  "model",
  "year",
  "kms",
  "fuelType",
  "transmission",
  "bodyType",
  "color",
  "condition",
  "ownerType",
  "registrationNumber",
  "insuranceValidTill",
  "serviceHistory",
  "features",
];

// Vehicles → motorcycle extras
const MOTORCYCLE_PREVIEW_KEYS: string[] = ["engineCapacity"];

// Vehicles → van/truck extras
const VAN_TRUCK_PREVIEW_KEYS: string[] = ["seatingCapacity"];

// Parts & Accessories
const PARTS_PREVIEW_KEYS: string[] = [
  "partsCategory",
  "brand",
  "condition",
  "compatibility",
  "salePrice",
];

export default function PostDetailPageClient() {
  const params = useParams();
  const id = useMemo(() => {
    const raw = (params?.id ?? "") as string | string[];
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post-details/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Post not found");
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Keys for the Details section (mirror Preview) based on category/subcategory
  const previewKeys = useMemo(() => {
    if (!post) return [] as string[];
    const keys = new Set<string>();

    const normCat = normalizeCategory(post.category || "");
    const normSub = normalizeSubcategory(post.subcategory || "");

    if (normCat === "property") {
      BASE_PREVIEW_KEYS.forEach((k) => keys.add(k));
      if (normSub === "commercial") COMMERCIAL_PREVIEW_KEYS.forEach((k) => keys.add(k));
      if (normSub === "holiday rental") HOLIDAY_PREVIEW_KEYS.forEach((k) => keys.add(k));
      if (normSub === "room rental") ROOM_RENTAL_PREVIEW_KEYS.forEach((k) => keys.add(k));
      if (normSub === "for students") {
        // BASE covers typical student-rental fields
      }
      if (normSub === "property sale" || normSub === "to buy") {
        PROPERTY_SALE_PREVIEW_KEYS.forEach((k) => keys.add(k));
      }
    } else if (normCat === "job") {
      if (normSub === "wanted") {
        JOB_WANTED_PREVIEW_KEYS.forEach((k) => keys.add(k));
      } else {
        JOB_FULLTIME_PREVIEW_KEYS.forEach((k) => keys.add(k));
      }
    } else if (normCat === "vehicles") {
      // parts vs vehicles
      if (normSub === "parts & accessories" || normSub === "parts" || normSub === "accessories") {
        PARTS_PREVIEW_KEYS.forEach((k) => keys.add(k));
      } else {
        VEHICLE_COMMON_KEYS.forEach((k) => keys.add(k));
        if (normSub === "motorcycle" || normSub === "bike") {
          MOTORCYCLE_PREVIEW_KEYS.forEach((k) => keys.add(k));
        }
        if (normSub === "van" || normSub === "truck") {
          VAN_TRUCK_PREVIEW_KEYS.forEach((k) => keys.add(k));
        }
      }
    }

    // Only keep keys that actually exist on the post to avoid lots of “—”
    return Array.from(keys).filter((k) => post[k] !== undefined);
  }, [post]);

  // Use normalized category + subcategory for CATEGORY_CONFIG
  const configuredKeys = useMemo(() => {
    if (!post?.category || !post?.subcategory) return [] as string[];
    const normCat = normalizeCategory(post.category);
    const normSub = normalizeSubcategory(post.subcategory);
    const spec = CATEGORY_CONFIG[normCat]?.[normSub];
    return Array.isArray(spec) ? spec.map((f) => f.key) : [];
  }, [post]);

  // Extra fields present on the doc that are part of spec but not in the preview list
  const extraConfiguredKeys = useMemo(() => {
    if (!post) return [] as string[];
    const core = new Set([
      "_id",
      "name",
      "description",
      "images",
      "category",
      "subcategory",
      "location",
      "seller_info",
      "createdAt",
      "updatedAt",
      "__v",
    ]);
    const previewSet = new Set(previewKeys);
    return configuredKeys
      .filter((k) => !core.has(k) && !previewSet.has(k))
      .filter((k) => post[k] !== null && post[k] !== undefined && post[k] !== "");
  }, [post, configuredKeys, previewKeys]);

  const debugJson = useMemo(() => {
    try {
      return JSON.stringify(post, null, 2);
    } catch {
      return "—";
    }
  }, [post]);

  if (loading) return <div className="p-6 text-center">Loading post...</div>;
  if (!post) return <div className="p-6 text-center text-red-600">Post not found</div>;

  return (
    <>
      <AppHeader />
      <div className="max-w-3xl mx-auto my-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{post.name}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">{post.category}</Badge>
              {post.subcategory && <Badge variant="secondary">{post.subcategory}</Badge>}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6 mt-4">
            {/* Basic Info */}
            <section className="space-y-1 border-b pb-4">
              <h3 className="text-lg font-semibold">Basic Info</h3>
              <p>
                <b>Category:</b> {post.category}
                {post.subcategory ? ` → ${post.subcategory}` : ""}
              </p>
              <p><b>Title:</b> {post.name || "—"}</p>
              {post.description ? <p><b>Description:</b> {post.description}</p> : null}
            </section>

            {/* Details (mirrors Preview) */}
            {previewKeys.length > 0 && (
              <section className="space-y-1 border-b pb-4">
                <h3 className="text-lg font-semibold">Details</h3>
                {previewKeys.map((key) => (
                  <p key={key}>
                    <b>{LABELS[key] ?? key}:</b> {renderValue(key, post[key])}
                  </p>
                ))}
              </section>
            )}

            {/* More Details (spec extras not shown above) */}
            {extraConfiguredKeys.length > 0 && (
              <section className="space-y-1 border-b pb-4">
                <h3 className="text-lg font-semibold">More Details</h3>
                {extraConfiguredKeys.map((key) => (
                  <p key={key}>
                    <b>{LABELS[key] ?? key}:</b> {renderValue(key, post[key])}
                  </p>
                ))}
              </section>
            )}

            {/* Contact Details */}
            {(post.seller_info?.name ||
              post.seller_info?.email ||
              post.seller_info?.phone) && (
              <section className="space-y-1 border-b pb-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <p><b>Name:</b> {post.seller_info?.name || "—"}</p>
                <p><b>Email:</b> {post.seller_info?.email || "—"}</p>
                <p><b>Phone:</b> {post.seller_info?.phone || "—"}</p>
              </section>
            )}

            {/* Location */}
            <section className="space-y-1 border-b pb-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <p><b>Address:</b> {post.location?.address || "—"}</p>
            </section>

            {/* Images */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <section className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-semibold">Images</h3>
                <div className="flex flex-wrap gap-3">
                  {post.images.map((url: string, i: number) => (
                    <img
                      key={i}
                      src={url}
                      alt={`image-${i}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
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
          </CardContent>
        </Card>
      </div>
      <AppFooter />
    </>
  );
}
