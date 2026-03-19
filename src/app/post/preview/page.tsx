"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import ReviewDetailsSection from "../components/ReviewSection";

import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

import { addPost } from "@/app/actions/addPost";
import { buildPostFormData } from "@/lib/buildPostFormData";

import { useAuthStore } from "@/store/authStore";
import { getSpecs } from "@/posting/config/getSpecs";
import type { FieldSpec } from "@/posting/config/types";

/* ---------------- HELPERS ---------------- */

function fmtCurrency(v: unknown) {
  if (!v) return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(v: unknown) {
  if (!v) return "—";
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
}

function renderByType(spec: FieldSpec, value: any): string {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return "—";
  }

  if (spec.type === "array") {
    return Array.isArray(value) ? value.join(", ") : "—";
  }

  if (spec.type === "currency") return fmtCurrency(value);
  if (spec.type === "date") return fmtDate(value);

  if (spec.type === "boolean") {
    if (value === true || value === "true") return "Yes";
    if (value === false || value === "false") return "No";
  }

  if (spec.type === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return spec.unit ? `${n} ${spec.unit}` : String(n);
  }

  return String(value);
}

/* ---------------- MAIN ---------------- */

export default function PreviewPage() {
  useWizardGuard("preview", { allowRefresh: true });

  const router = useRouter();

  const data = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

 useEffect(() => {
  if (!user) return;

  const existing = usePostFormStore.getState().sellerInfo;

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  setField("sellerInfo", {
    name: existing?.name || fullName,
    email: existing?.email || user.email,
    phone:
      existing?.phone ||
      user.primaryNumber ||
      user.phone ||
      user.mobile ||
      "",
  });
}, [user, setField]); // ✅ IMPORTANT

 const sellerInfo = useMemo(() => ({
  name:
    data.sellerInfo?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "",

  email:
    data.sellerInfo?.email ||
    user?.email ||
    "",

  phone:
    data.sellerInfo?.phone ||
    user?.primaryNumber ||
    user?.phone ||
    user?.mobile ||
    "",
}), [data.sellerInfo, user]);

  const missing = useMemo(() => {
    const m: string[] = [];

    if (!data.name?.trim()) m.push("Title");
    if (!data.description?.trim()) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
    if (!data.location?.address?.trim()) m.push("Location");
    if (!sellerInfo.phone?.trim()) m.push("Phone");

    return m;
  }, [data, sellerInfo]);

  const [imgUrls, setImgUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = (data.images || []).map((img: File | string) =>
      img instanceof File ? URL.createObjectURL(img) : img
    );

    setImgUrls(urls);

    return () => {
      urls.forEach((url, index) => {
        if (data.images?.[index] instanceof File) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [data.images]);

  const specs = useMemo(() => {
    if (!data.category || !data.subcategory) return [];
    return getSpecs(data.category, data.subcategory);
  }, [data.category, data.subcategory]);

  const groupedFields = useMemo(() => {
    const groups: Record<string, any[]> = {
      basic: [],
      categorySpecific: [],
    };

    groups.basic.push({ title: "Title", value: data.name || "—" });
    groups.basic.push({
      title: "Description",
      value: data.description || "—",
      noWrap: true,
    });

    for (const spec of specs) {
      const v = (data as any)[spec.key];
      if (
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      ) {
        continue;
      }

      groups.categorySpecific.push({
        title: spec.label,
        value: renderByType(spec, v),
      });
    }

    return groups;
  }, [data, specs]);

  const handleSubmit = async () => {
    setClientError(null);

    if (missing.length) {
      setClientError(`Please fill: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const fd = buildPostFormData({
        ...data,
        sellerInfo,
      });

      const res = await addPost(fd);

      if (!res || (res as any).ok === false) {
        setClientError((res as any)?.error || "Submit failed.");
        return;
      }

      router.push("/congratulation");
    } catch (error: any) {
      setClientError(error?.message || "Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PostHeader />

      <main className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
        <div className="w-full max-w-xl">
          <PageHeader
            title="Review Details"
            description="Review everything before submitting."
          />

          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setShowDebug((s) => !s)}
              className="text-xs bg-black text-white px-3 py-1 rounded"
            >
              Debug
            </button>
          </div>

          {showDebug && (
            <div className="bg-black text-green-400 text-xs p-4 rounded mb-4 overflow-auto">
              <pre>
                {JSON.stringify(
                  {
                    sellerInfo,
                    storeSellerInfo: data.sellerInfo,
                    authUserPrimaryNumber: user?.primaryNumber,
                    authUser: user,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {clientError && (
            <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
              {clientError}
            </div>
          )}

          <ReviewDetailsSection
            title="Category"
            dataProvider={[
              {
                title: "Category",
                value: `${data.category} ➝ ${data.subcategory}`,
              },
            ]}
          />

          <ReviewDetailsSection
            title="Basic Details"
            dataProvider={groupedFields.basic}
          />

          {groupedFields.categorySpecific.length > 0 && (
            <ReviewDetailsSection
              title="Additional Details"
              dataProvider={groupedFields.categorySpecific}
            />
          )}

          <ReviewDetailsSection
            title="Location"
            mapData={
              data.location?.lat && data.location?.lng
                ? { lat: data.location.lat, lng: data.location.lng }
                : null
            }
            dataProvider={[
              {
                title: "Address",
                value: data.location?.address || "—",
              },
            ]}
          />

          {imgUrls.length > 0 && (
            <ReviewDetailsSection
              title="Photos"
              imageProvider={imgUrls.map((u) => ({ imageUrl: u }))}
            />
          )}

          <ReviewDetailsSection
            title="Contact"
            dataProvider={[
              { title: "Name", value: sellerInfo.name || "—" },
              { title: "Email", value: sellerInfo.email || "—" },
              { title: "Phone", value: sellerInfo.phone || "—" },
            ]}
            isLastItem
          />

          <PostFooter
            showBack
            showSubmit
            submitting={loading}
            onBack={() => router.push("/post/pick-location")}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  );
}