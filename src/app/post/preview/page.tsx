"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

import { addPost } from "@/app/actions/addPost";
import { buildPostFormData } from "@/lib/buildPostFormData";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

import { getSpecs } from "@/posting/config/getSpecs";
import type { FieldSpec } from "@/posting/config/types";

/* ---------------- FORMAT HELPERS ---------------- */

function fmtCurrency(v: unknown) {
  if (v === null || v === undefined || v === "") return "—";
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
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString();
}

function renderByType(spec: FieldSpec, value: any): string {
  if (value === null || value === undefined || value === "")
    return "—";

  if (spec.type === "array")
    return Array.isArray(value)
      ? value.length
        ? value.join(", ")
        : "—"
      : "—";

  if (spec.type === "currency") return fmtCurrency(value);
  if (spec.type === "date") return fmtDate(value);

  if (spec.type === "boolean") {
    if (value === true || value === "true" || value === 1) return "Yes";
    if (value === false || value === "false" || value === 0) return "No";
    return String(value);
  }

  if (spec.type === "number") {
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value);
    return spec.unit ? `${n} ${spec.unit}` : String(n);
  }

  return String(value);
}

/* ---------------- CONTACT SECTION ---------------- */

type SellerInfo = {
  name: string;
  email: string;
  phone: string;
};

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
        Advertiser Contact Details
      </h3>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-600">Name</p>
          <p className="text-gray-900">{sellerInfo.name || "—"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-600">Email</p>
          <p className="text-gray-900">{sellerInfo.email || "—"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <p className="text-gray-600">Phone</p>
          <Input
            value={sellerInfo.phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="h-8"
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function PreviewPage() {
  useWizardGuard("preview");

  const router = useRouter();
  const data = usePostFormStore();
  const setField = usePostFormStore((s) => s.setField);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  /* ---------------- AUTO FILL SELLER ---------------- */

  useEffect(() => {
    if (!user) return;

    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!data.sellerInfo?.name) {
      setField("sellerInfo", {
        name: fullName,
        email: user.email,
        phone:
          data.sellerInfo?.phone || user.primaryNumber || "",
      });
    }
  }, [user]);

  const sellerInfo: SellerInfo = {
    name: data.sellerInfo?.name || "",
    email: data.sellerInfo?.email || "",
    phone: data.sellerInfo?.phone || "",
  };

  /* ---------------- VALIDATION ---------------- */

  const missing = useMemo(() => {
    const m: string[] = [];

    if (!data.name?.trim()) m.push("Title");
    if (!data.description?.trim()) m.push("Description");
    if (!data.category) m.push("Category");
    if (!data.subcategory) m.push("Subcategory");
    if (!data.location?.address?.trim()) m.push("Location");
   if (!sellerInfo.phone && !user?.primaryNumber) m.push("Phone");

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
      urls.forEach((u, i) => {
        if (data.images?.[i] instanceof File)
          URL.revokeObjectURL(u);
      });
    };
  }, [data.images]);

  /* ---------------- SPECS ---------------- */

  const specs = useMemo(() => {
    if (!data.category || !data.subcategory) return [];
    return getSpecs(data.category, data.subcategory);
  }, [data.category, data.subcategory]);

  const advRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];

    rows.push({ label: "Category", value: data.category || "—" });
    rows.push({
      label: "Subcategory",
      value: data.subcategory || "—",
    });
    rows.push({ label: "Title", value: data.name || "—" });
    rows.push({
      label: "Description",
      value: data.description || "—",
    });

    for (const spec of specs) {
      const v = (data as any)[spec.key];

      if (v === undefined || v === null || v === "") continue;

      rows.push({
        label: spec.label,
        value: renderByType(spec, v),
      });
    }

    return rows;
  }, [data, specs]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
  setClientError(null);

  console.log("POST STORE DATA:", data);
  console.log("SELLER INFO:", sellerInfo);
  console.log("MISSING FIELDS:", missing);

  if (missing.length) {
    setClientError(`Please fill: ${missing.join(", ")}`);
    return;
  }

    // 🔥 trigger sub-form validation
    const forms = document.querySelectorAll<HTMLFormElement>(
  "form[data-post-form='true']"
);

let validationPassed = false;

if (forms.length === 0) {
  validationPassed = true;
} else {
  const listener = (e: any) => {
    validationPassed = e.detail?.ok === true;
  };

  window.addEventListener("postform:validated", listener, {
    once: true,
  });

  forms.forEach((f) => f.requestSubmit());

  await new Promise((r) => setTimeout(r, 100));

  window.removeEventListener("postform:validated", listener);
}

if (!validationPassed) {
  setClientError("Please complete required fields.");
  return;
}

    setLoading(true);

    const fd = buildPostFormData({
      ...data,
      sellerInfo,
    });

    const res = await addPost(fd);

    setLoading(false);

    if (!res || (res as any).ok === false) {
      setClientError(
        (res as any)?.error || "Submit failed."
      );
      return;
    }

    router.push("/congratulation");
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <PostHeader />

      <main className="min-h-screen bg-gray-50">
        <div className="w-full max-w-xl mx-auto px-6 pt-10 pb-16">

          <PageHeader
            title="Review Details"
            description="Review everything before submitting."
          />

          {clientError && (
            <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
              {clientError}
            </div>
          )}

          {/* Advertisement */}
          <section className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-3">Advertisement</h3>

            {advRows.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">{r.label}</div>
                <div>{r.value}</div>
              </div>
            ))}
          </section>

          {/* Images */}
          {imgUrls.length > 0 && (
            <section className="bg-white border rounded p-4 mt-4">
              <h3 className="font-semibold mb-3">Photos</h3>

              <div className="grid grid-cols-3 gap-2">
                {imgUrls.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Location */}
          <section className="bg-white border rounded p-4 mt-4">
            <h3 className="font-semibold mb-3">Location</h3>

            {data.location?.address ? (
              <div className="text-sm space-y-1">
                <p>{data.location.address}</p>

                {data.location.city && (
                  <p className="text-gray-500">
                    {data.location.city},{" "}
                    {data.location.state}
                  </p>
                )}

                {data.location.pincode && (
                  <p className="text-gray-500">
                    PIN: {data.location.pincode}
                  </p>
                )}

                {data.location.lat &&
                  data.location.lng && (
                    <a
                      href={`https://www.google.com/maps?q=${data.location.lat},${data.location.lng}`}
                      target="_blank"
                      className="text-blue-600 text-xs underline"
                    >
                      View on Map
                    </a>
                  )}
              </div>
            ) : (
              <p className="text-gray-400">
                No location selected
              </p>
            )}
          </section>

          {/* Contact */}
          <section className="bg-white border rounded p-4 mt-4">
            <AdvertiserContactSection
              sellerInfo={sellerInfo}
              onPhoneChange={(phone) =>
                setField("sellerInfo", {
                  ...sellerInfo,
                  phone,
                })
              }
            />
          </section>

          <PostFooter
            showBack
            showSubmit
            submitting={loading}
            onBack={() =>
              router.push("/post/pick-location")
            }
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </>
  );
}