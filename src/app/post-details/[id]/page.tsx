// src/app/post-details/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import { CATEGORY_CONFIG, normalizeCategory, normalizeSubcategory } from "@/lib/buildPostFormData";

// ---- Labels used in both Preview & Details ----
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

  // room rental example
  type: "Room Type",
  rent: "Monthly Rent",
  preferred_tenants: "Preferred Tenants",
  rules: "Rules",

  // vehicles/jobs examples—add as needed
  budget: "Budget",
  preferred_locations: "Preferred Locations",
  salary: "Salary",
  hourlyRate: "Hourly Rate",
  experience: "Experience",
  skills: "Skills",
  shifts: "Shifts",
  make: "Make",
  model: "Model",
  year: "Year",
  kms: "Kilometers",
  features: "Features",
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
  if (["rentPrice", "salePrice", "deposit", "maintenance", "price", "rent"].includes(key)) {
    return fmtCurrency(value) ?? "—";
  }
  if (["available_from"].includes(key)) {
    return fmtDate(value) ?? "—";
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

// Fields we show in the "Property Details" section to match the Preview
const PREVIEW_PROPERTY_KEYS: string[] = [
  "propertyType",
  "beds",
  "baths",
  "rentPrice",
  "deposit",
  "occupancy",
  "gender_pref",
  "facilities",
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

  // Use normalized category + subcategory when reading CATEGORY_CONFIG
  const configuredKeys = useMemo(() => {
    if (!post?.category || !post?.subcategory) return [] as string[];
    const normCat = normalizeCategory(post.category);
    const normSub = normalizeSubcategory(post.subcategory);
    const spec = CATEGORY_CONFIG[normCat]?.[normSub];
    return Array.isArray(spec) ? spec.map((f) => f.key) : [];
  }, [post]);

  // Anything present on the document that isn't core, and not in preview keys,
  // but is part of the spec (to show under "More Details")
  const extraConfiguredKeys = useMemo(() => {
    if (!post) return [] as string[];
    const core = new Set([
      "_id", "name", "description", "images", "category", "subcategory", "location", "seller_info",
      "createdAt", "updatedAt", "__v",
    ]);
    const previewSet = new Set(PREVIEW_PROPERTY_KEYS);
    return configuredKeys
      .filter((k) => !core.has(k) && !previewSet.has(k))
      .filter((k) => post[k] !== null && post[k] !== undefined && post[k] !== "");
  }, [post, configuredKeys]);

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
            {/* --- Basic Info (matches Preview) --- */}
            <section className="space-y-1 border-b pb-4">
              <h3 className="text-lg font-semibold">Basic Info</h3>
              <p><b>Category:</b> {post.category} {post.subcategory ? `→ ${post.subcategory}` : ""}</p>
              <p><b>Title:</b> {post.name || "—"}</p>
              {post.description ? <p><b>Description:</b> {post.description}</p> : null}
            </section>

            {/* --- Property Details (matches Preview list) --- */}
            <section className="space-y-1 border-b pb-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              {PREVIEW_PROPERTY_KEYS.map((key) => (
                <p key={key}>
                  <b>{LABELS[key] ?? key}:</b> {renderValue(key, post[key])}
                </p>
              ))}
            </section>

            {/* --- More Details (anything extra from CATEGORY_CONFIG that you saved) --- */}
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

            {/* --- Contact Details (matches Preview) --- */}
            {(post.seller_info?.name || post.seller_info?.email || post.seller_info?.phone) && (
              <section className="space-y-1 border-b pb-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <p><b>Name:</b> {post.seller_info?.name || "—"}</p>
                <p><b>Email:</b> {post.seller_info?.email || "—"}</p>
                <p><b>Phone:</b> {post.seller_info?.phone || "—"}</p>
              </section>
            )}

            {/* --- Location (matches Preview) --- */}
            <section className="space-y-1 border-b pb-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <p><b>Address:</b> {post.location?.address || "—"}</p>
            </section>

            {/* --- Images (matches Preview) --- */}
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

            {/* --- Debug JSON (collapsible) --- */}
            {/* <section>
              <details className="group">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Debug JSON
                </summary>
                <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 p-2 rounded overflow-auto">
                  {debugJson}
                </pre>
              </details>
            </section> */}
          </CardContent>
        </Card>
      </div>
      <AppFooter />
    </>
  );
}
