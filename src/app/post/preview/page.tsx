"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import ReviewDetailsSection from "../components/ReviewSection";
import { updatePost } from "@/app/actions/updatePost";
import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

import { addPost } from "@/app/actions/addPost";
import { buildPostFormData } from "@/lib/buildPostFormData";
import { uploadFileToR2 } from "@/lib/media/uploadToR2";

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
  useWizardGuard("preview");

  const router = useRouter();

  const data = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  /* ---------------- SELLER AUTO-FILL ---------------- */

  useEffect(() => {
    if (!user) return;

    const existing = usePostFormStore.getState().sellerInfo;

    const fullName =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

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
  }, [user, setField]);

  const sellerInfo = useMemo(
    () => ({
      name:
        data.sellerInfo?.name ||
        user?.fullName ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        "",
      email: data.sellerInfo?.email || user?.email || "",
      phone:
        data.sellerInfo?.phone ||
        user?.primaryNumber ||
        user?.phone ||
        user?.mobile ||
        "",
    }),
    [data.sellerInfo, user]
  );

  /* ---------------- VALIDATION ---------------- */

  const missing = useMemo(() => {
    const m: string[] = [];

    if (!data.name?.trim()) m.push("Title");
    if (!data.description?.trim()) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
    if (!data.location?.address?.trim()) m.push("Location");
    if (!sellerInfo.name?.trim()) m.push("Contact Name");
    if (!sellerInfo.phone?.trim()) m.push("Phone");

    return m;
  }, [data, sellerInfo]);

  /* ---------------- IMAGES ---------------- */

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

  /* ---------------- SPECS ---------------- */

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
      if (!v || (Array.isArray(v) && v.length === 0)) continue;

      groups.categorySpecific.push({
        title: spec.label,
        value: renderByType(spec, v),
      });
    }

    return groups;
  }, [data, specs]);

  /* ---------------- NAVIGATION GUARD ---------------- */

  const confirmNavigation = (path: string) => {
    if (
      confirm(
        "If you change category, some entered details may be lost. Continue?"
      )
    ) {
      window.scrollTo(0, 0);
      router.push(path);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setClientError(null);

    if (missing.length) {
      setClientError(`Please fill: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const store = usePostFormStore.getState();

      // Upload all File objects to R2, collect public URLs
      const resolvedImages: string[] = [];
      const failedImageNumbers: number[] = [];

      const allImages = store.images || [];
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        if (img instanceof File) {
          try {
            const url = await uploadFileToR2(img, store.name);
            resolvedImages.push(url);
          } catch (uploadErr: any) {
            console.error(`Photo ${i + 1} upload error:`, uploadErr?.message);
            failedImageNumbers.push(i + 1);
          }
        } else if (typeof img === "string" && !img.startsWith("blob:")) {
          resolvedImages.push(img); // existing hosted URL — keep as-is
        }
      }

      if (failedImageNumbers.length > 0) {
        setClientError(
          `Photo ${failedImageNumbers.join(", ")} failed to upload. Remove and re-add ${failedImageNumbers.length === 1 ? "it" : "them"} before submitting.`
        );
        return;
      }

      const fd = buildPostFormData({
        ...store,
        sellerInfo,
        images: resolvedImages,
      });

      let res;

      if (store.editMode && store.postId) {
        res = await updatePost(store.postId, fd);
      } else {
        res = await addPost(fd);
      }

      if (!res || (res as any).ok === false) {
        setClientError((res as any)?.error || "Submit failed.");
        return;
      }

      await usePostFormStore.getState().reset();
      router.push("/congratulation");
    } catch (error: any) {
      setClientError(error?.message || "Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNavigation = (path: string) => {
  // ✅ reset edit mode safely
  usePostFormStore.setState({
    editMode: false,
    postId: undefined,
  });

  window.scrollTo(0, 0);
  router.push(path);
};

  /* ---------------- UI ---------------- */

  return (
    <>
      <PostHeader />

      <main className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
        <div className="w-full max-w-xl">
          <PageHeader
            title="Review Details"
            description="Review everything before submitting."
          />

          {/* Debug */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowDebug((s) => !s)}
              className="text-xs bg-black text-white px-3 py-1 rounded"
            >
              Debug
            </button>
          </div>

          {showDebug && (
            <pre className="bg-black text-green-400 text-xs p-4 rounded mb-4 overflow-auto">
              {JSON.stringify({ sellerInfo, data, user }, null, 2)}
            </pre>
          )}

          {clientError && (
            <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
              {clientError}
            </div>
          )}

          {/* CATEGORY */}
         <ReviewDetailsSection
  title="Category"
  routeBackTo="/select-category"
  onChange={handleChangeNavigation}
  dataProvider={[
    {
      title: "Category",
      value: `${data.category} ➝ ${data.subcategory}`,
    },
  ]}
/>

          {/* BASIC */}
         <ReviewDetailsSection
  title="Basic Details"
  routeBackTo="/details"
  onChange={handleChangeNavigation}
  dataProvider={groupedFields.basic}
/>

          {/* ADDITIONAL */}
          {groupedFields.categorySpecific.length > 0 && (
           <ReviewDetailsSection
  title="Additional Details"
  routeBackTo="/post/details"
  onChange={handleChangeNavigation}
  dataProvider={groupedFields.categorySpecific}
/>
          )}

          {/* LOCATION */}
          <ReviewDetailsSection
  title="Location"
  routeBackTo="/pick-location"
  onChange={handleChangeNavigation}
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

          {/* PHOTOS */}
          {imgUrls.length > 0 && (
            <ReviewDetailsSection
  title="Photos"
  routeBackTo="/upload-photo"
  onChange={handleChangeNavigation}
  imageProvider={imgUrls.map((u) => ({ imageUrl: u }))}
/>
          )}

          {/* CONTACT (NO CHANGE) */}
          <ReviewDetailsSection
            title="Contact"
            hideChange
            showAutoFillHint
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