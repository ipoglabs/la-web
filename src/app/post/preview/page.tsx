// src/app/post/preview/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import ReviewDetailsSection from "../components/ReviewSectionMap";

import { usePostFormStore } from "../store/postFormStore";

import { addPost } from "@/app/actions/addPost";
import { updatePost } from "@/app/actions/updatePost";
import { buildPostFormData } from "@/lib/buildPostFormData";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";

/** ---------- helpers ---------- */
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

/** ---------- contact helpers ---------- */

type SellerInfo = {
  name: string;
  email: string;
  phone: string;
};

// match your DB/user shape: firstName, lastName, email, primaryNumber, username
function extractUserContact(u: any): SellerInfo {
  if (!u) return { name: "", email: "", phone: "" };

  const name =
    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username || "";
  const email = u.email || "";
  const phone = u.primaryNumber || u.phone || "";

  return { name, email, phone };
}

function AdvertiserContactSection({
  sellerInfo,
  onPhoneChange,
}: {
  sellerInfo: SellerInfo;
  onPhoneChange: (phone: string) => void;
}) {
  return (
    <section className="pt-2 pb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Advertiser Name and Contacts
      </h3>

      <div className="space-y-2 text-xs sm:text-sm">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <p className="text-gray-600">Name</p>
          <p className="text-gray-900 break-words">
            {sellerInfo.name || "—"}
          </p>
        </div>

        {/* Email row */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <p className="text-gray-600">Email</p>
          <p className="text-gray-900 break-words">
            {sellerInfo.email || "—"}
          </p>
        </div>

        {/* Phone row (editable) */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <p className="text-gray-600">Primary Phone</p>
          <div>
            <Input
              value={sellerInfo.phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="h-8 text-xs sm:text-sm"
              placeholder="Enter phone number"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              This number will be shown in your advertisement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** ---------- main component ---------- */

export default function ReviewDetails() {
  const router = useRouter();

  const data = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);

  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const isEdit =
    data.editMode === true &&
    typeof data.postId === "string" &&
    data.postId.trim().length > 0;

  const postId = isEdit ? (data.postId as string) : undefined;

  const has = (k: string) =>
    (data as any)[k] !== undefined &&
    (data as any)[k] !== null &&
    String((data as any)[k]).trim() !== "";

  // Normalize sellerInfo from store
  const sellerInfo: SellerInfo = {
    name: data.sellerInfo?.name || "",
    email: data.sellerInfo?.email || "",
    phone: data.sellerInfo?.phone || "",
  };

  /** ---------- 1) hydrate auth store from /api/auth/me if empty ---------- */
  useEffect(() => {
    if (user) return;

    (async () => {
      try {
        console.log("🌐 [Preview] Fetching /api/auth/me to hydrate auth store");
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.warn("⚠️ [Preview] /api/auth/me returned status", res.status);
          return;
        }

        const json = await res.json();
        console.log("✅ [Preview] /api/auth/me payload =", json);

        if (!json.user) {
          console.warn("⚠️ [Preview] /api/auth/me had no user");
          return;
        }

        setAuth("", json.user);
        console.log("✅ [Preview] authStore hydrated from /api/auth/me");
      } catch (e) {
        console.error("❌ [Preview] Failed to hydrate auth store:", e);
      }
    })();
  }, [user, setAuth]);

  /** ---------- 2) auto-inject contact from auth user (once / when available) ---------- */
  useEffect(() => {
    console.log("🔎 [Preview] authStore.user =", user);
    console.log("🔎 [Preview] postForm.sellerInfo BEFORE =", data.sellerInfo);

    if (!user) {
      console.log("⚠️ [Preview] No user in auth store (yet).");
      return;
    }

    const fromProfile = extractUserContact(user);
    console.log("✅ [Preview] Extracted contact from user =", fromProfile);

    if (!fromProfile.name && !fromProfile.email && !fromProfile.phone) {
      console.log("⚠️ [Preview] extractUserContact returned empty.");
      return;
    }

    const current = data.sellerInfo || { name: "", email: "", phone: "" };

    const next: SellerInfo = {
      name: current.name || fromProfile.name,
      email: current.email || fromProfile.email,
      phone: current.phone || fromProfile.phone,
    };

    console.log("🧩 [Preview] Merging sellerInfo:", { current, next });

    if (
      next.name !== current.name ||
      next.email !== current.email ||
      next.phone !== current.phone
    ) {
      setField("sellerInfo", next);
    }
  }, [user, data.sellerInfo, setField]);

  /** ---------- required fields check ---------- */
  const missing = useMemo(() => {
    const m: string[] = [];
    if (!data.name) m.push("Title");
    if (!data.description) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
    if (!sellerInfo.name) m.push("Contact Name");
    if (!sellerInfo.email) m.push("Contact Email");
    if (!sellerInfo.phone) m.push("Contact Phone");
    return m;
  }, [
    data.name,
    data.description,
    data.category,
    data.subcategory,
    sellerInfo.name,
    sellerInfo.email,
    sellerInfo.phone,
  ]);

  /** ---------- submit (add | update) ---------- */
  /** ---------- submit (add | update) ---------- */
const handleSubmit = async () => {
  setClientError(null);

  console.log("📝 [Preview] isEdit =", isEdit, "postId =", postId);

  if (missing.length) {
    setClientError(`Please fill: ${missing.join(", ")}`);
    return;
  }

  setLoading(true);

  const fd = buildPostFormData({
    ...data,
    sellerInfo,
  });

  let res;
  if (isEdit && postId) {
    console.log("🔧 [Preview] Calling updatePost with id =", postId);
    res = await updatePost(postId, fd);
  } else {
    console.log("➕ [Preview] Calling addPost (create new)");
    res = await addPost(fd);
  }

  setLoading(false);

  if (!res || (res as any).ok === false) {
    console.error("❌ [Preview] submit error:", res);
    const msg =
      (res as any)?.error ||
      "Submit failed. Please check required fields and try again.";
    setClientError(msg);
    return;
  }

  const newId = (res as any).id as string | undefined;

  if (!isEdit) {
    // reset create mode flags if needed
    setField("editMode", false);
    setField("postId", undefined as unknown as string);

    // 👉 redirect to congratulations page (with id in query if you want)
    const target = newId
      ? `/congratulation?postId=${encodeURIComponent(newId)}`
      : "/congratulation";

    router.push(target);
  } else {
    // 👉 for edit keep your old behaviour
    if (postId) {
      router.push(`/post-details/${postId}`);
    } else if (newId) {
      router.push(`/post-details/${newId}`);
    } else {
      router.push("/my-ads"); // fallback
    }
  }
};



  /** ---------- build sections ---------- */

  const categorySection = [
    {
      title: "Main / Sub Category",
      value: `${data.category || "—"}${
        data.subcategory ? ` → ${data.subcategory}` : ""
      }`,
      type: "text" as const,
    },
  ];

  const advDetails: Array<{
    title: string;
    value: string;
    type?: "text" | "bullets";
    noWrap?: boolean;
  }> = [];

  advDetails.push(
    { title: "Title", value: String(data.name || "—"), noWrap: true },
    { title: "Description", value: String(data.description || "—"), noWrap: true }
  );

  const keyFeatures =
    (Array.isArray((data as any).keyFeatures) &&
      (data as any).keyFeatures.join(", ")) ||
    (typeof (data as any).keyFeatures === "string" && (data as any).keyFeatures) ||
    "";
  if (keyFeatures) {
    advDetails.push({
      title: "Key Features",
      value: keyFeatures,
      type: "bullets",
      noWrap: true,
    });
  }

  const possibleFields: Array<[string, string]> = [
    ["price", "Asking Price / Rent"],
    ["rentPrice", "Asking Rent"],
    ["salePrice", "Sale Price"],
    ["deposit", "Deposit"],
    ["available_from", "Available From"],
    ["deadline", "Deadline"],
    ["startDate", "Start Date"],
    ["endDate", "End Date"],
    ["propertyType", "Property Type"],
    ["bedroom", "Bedroom"],
    ["bathroom", "Bathroom"],
    ["size", "Size"],
    ["furnishType", "Furnish type"],
    ["letType", "Let type"],
    ["councilTax", "Council Tax"],
  ];

  for (const [k, label] of possibleFields) {
    if (has(k)) {
      advDetails.push({ title: label, value: renderValue(k, (data as any)[k]) });
    }
  }

  const hasAddress = (data.location?.address || "").trim().length > 0;
  const coords =
    typeof data.location?.lat === "number" &&
    typeof data.location?.lng === "number"
      ? `${data.location.lat.toFixed(6)}°, ${data.location.lng.toFixed(6)}°`
      : "";

  const locationProvider: Array<{ title: string; value: string; type?: "text" }> =
    [];
  if (hasAddress) {
    locationProvider.push({
      title: "Address",
      value: data.location?.address || "—",
      type: "text",
    });
  }
  if (coords) {
    locationProvider.push({
      title: "Coordinates",
      value: coords,
      type: "text",
    });
  }

  const mapData =
    typeof data.location?.lat === "number" &&
    typeof data.location?.lng === "number"
      ? { lat: data.location.lat, lng: data.location.lng }
      : null;

  const imageProvider =
    Array.isArray(data.images) && data.images.length
      ? data.images.map((img: File | string) => ({
          imageUrl: img instanceof File ? URL.createObjectURL(img) : (img as string),
        }))
      : [];

  const debugJson = useMemo(() => {
    try {
      return JSON.stringify({ ...data, sellerInfo }, null, 2);
    } catch {
      return "—";
    }
  }, [data, sellerInfo]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full max-w-xl mx-auto px-6 pt-10 pb-16">
        <div className="text-center mb-8">
          <PageHeader
            title="Review Details"
            description="Take a moment to review all the information you’ve provided. Make sure everything looks good before you submit your advertisement."
          />
        </div>

        {clientError && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded mb-6">
            {clientError}
          </div>
        )}

        <ReviewDetailsSection
          title="Selected Category"
          dataProvider={categorySection}
          routeBackTo="/post/select-category"
        />

        <ReviewDetailsSection
          title="Advertisement Details"
          dataProvider={advDetails}
          routeBackTo="/post/details"
        />

        {(hasAddress || mapData) && (
          <ReviewDetailsSection
            title="Selected Location"
            dataProvider={locationProvider}
            mapData={mapData || undefined}
            routeBackTo="/post/pick-location"
          />
        )}

        {imageProvider.length > 0 && (
          <ReviewDetailsSection
            title="Uploaded Photos"
            imageProvider={imageProvider}
            routeBackTo="/post/upload-photo"
          />
        )}

        <AdvertiserContactSection
          sellerInfo={sellerInfo}
          onPhoneChange={(phone) =>
            setField("sellerInfo", { ...sellerInfo, phone })
          }
        />

        <details className="group mt-4">
          <summary className="cursor-pointer text-sm text-gray-600">
            Debug JSON
          </summary>
          <pre className="mt-2 text-xs bg-slate-50 border border-slate-200 p-2 rounded overflow-auto">
            {debugJson}
          </pre>
        </details>

        <div className="mt-6">
          <PostFooter
            showBack={false}
            showNext={false}
            showSubmit={true}
            onSubmit={handleSubmit}
            submitting={loading}
            submitLabel={
              loading
                ? isEdit
                  ? "Saving..."
                  : "Submitting..."
                : isEdit
                ? "Save Changes"
                : "Submit Post"
            }
          />
        </div>
      </div>
    </main>
  );
}
