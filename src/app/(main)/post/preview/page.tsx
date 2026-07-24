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
import { deleteImageVariants } from "@/lib/media/imageVariants";

import { useAuthStore } from "@/store/authStore";
import { getSpecs } from "@/posting/config/getSpecs";
import type { FieldSpec } from "@/posting/config/types";
import SubmitProgressModal, {
  SUBMIT_STEPS,
  type SubmitStepStatus,
} from "../components/SubmitProgressModal";

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

  const [stepStatus, setStepStatus] = useState<Record<string, SubmitStepStatus>>(
    Object.fromEntries(SUBMIT_STEPS.map((s) => [s.key, "pending"]))
  );
  const setStep = (key: string, status: SubmitStepStatus) =>
    setStepStatus((s) => ({ ...s, [key]: status }));
  const resetSteps = () =>
    setStepStatus(Object.fromEntries(SUBMIT_STEPS.map((s) => [s.key, "pending"])));

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
        user.secondaryNumber1 ||
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
        user?.secondaryNumber1 ||
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

    resetSteps();
    setLoading(true);

    try {
      setStep("validate", "active");
      const store = usePostFormStore.getState();
      const postId = store.postId || "draft";
      setStep("validate", "done");

      // Upload every File to R2 under {userId}/post-images/{postId}/
      setStep("upload", "active");
      const resolvedImages: string[] = [];
      const uploadErrors: { index: number; reason: string }[] = [];
      const newlyUploadedUrls: string[] = []; // track for orphan cleanup on failure

      const allImages = store.images || [];
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        if (img instanceof File) {
          try {
            const url = await uploadFileToR2(img, postId, i + 1);
            resolvedImages.push(url);
            newlyUploadedUrls.push(url);
          } catch (uploadErr: any) {
            const reason = uploadErr?.message || "Unknown error";
            console.error(`Photo ${i + 1} upload error:`, reason);
            uploadErrors.push({ index: i + 1, reason });
          }
        } else if (typeof img === "string" && !img.startsWith("blob:")) {
          resolvedImages.push(img);
        }
      }

      if (uploadErrors.length > 0) {
        setStep("upload", "error");
        // Clean up any images that did upload before the failure
        if (newlyUploadedUrls.length > 0) {
          deleteImageVariants(newlyUploadedUrls).catch((e) =>
            console.error("R2 orphan cleanup after upload error:", e)
          );
        }
        const first = uploadErrors[0]!;
        setClientError(
          uploadErrors.length === 1
            ? `Photo ${first.index} failed to upload: ${first.reason}`
            : `${uploadErrors.length} photos failed to upload. First error: ${first.reason}`
        );
        setLoading(false);
        return;
      }
      setStep("upload", "done");

      setStep("build", "active");
      const fd = buildPostFormData({
        ...store,
        sellerInfo,
        images: resolvedImages,
      });
      setStep("build", "done");

      setStep("save", "active");
      let res;

      if (store.editMode && store.postId) {
        res = await updatePost(store.postId, fd);
      } else {
        res = await addPost(fd);
      }

      if (!res || (res as any).ok === false) {
        setStep("save", "error");
        // addPost/updatePost failed — clean up any newly uploaded R2 images
        if (newlyUploadedUrls.length > 0) {
          deleteImageVariants(newlyUploadedUrls).catch((e) =>
            console.error("R2 orphan cleanup after submit failure:", e)
          );
        }
        setClientError((res as any)?.error || "Submit failed.");
        setLoading(false);
        return;
      }
      setStep("save", "done");

      setStep("finalize", "active");
      const savedId = (res as any).id as string | undefined;
      await usePostFormStore.getState().reset();
      setStep("finalize", "done");

      // Keep the modal visible briefly so the user sees the final checkmark
      setTimeout(() => {
        router.push(savedId ? `/congratulation?postId=${savedId}` : "/congratulation");
      }, 400);
    } catch (error: any) {
      setClientError(error?.message || "Submit failed.");
      setLoading(false);
    }
  };

  const handleChangeNavigation = (path: string) => {
    // Preserve postId so R2 folder stays consistent if user edits then comes back
    usePostFormStore.setState({ editMode: false });
    window.scrollTo(0, 0);
    router.push(path);
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <PostHeader />

      {loading && (
        <SubmitProgressModal status={stepStatus} errorMessage={clientError} />
      )}

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