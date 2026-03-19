"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import {
  normalizeCategory,
  normalizeSubcategory,
} from "@/posting/config/normalize";
import { CATEGORY_CONFIG } from "@/posting/config/categoryConfig";

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
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
}

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderValue(key: string, value: any): string {
  if (value === null || value === undefined || value === "") return "—";

  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";

  if (
    ["rentPrice", "salePrice", "deposit", "salary", "price"].includes(key)
  ) {
    return fmtCurrency(value);
  }

  if (["available_from", "startDate", "endDate"].includes(key)) {
    return fmtDate(value);
  }

  return String(value);
}

/* ---------------- TYPES ---------------- */

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

/* ---------------- MAIN ---------------- */

export default function PostDetailPageClient() {
  const params = useParams();

  const id = useMemo(() => {
    return params?.id as string;
  }, [params]);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post-details/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Post not found");

        const resJson = await res.json();

        // ✅ SAFE PARSE
        const data = resJson?.data || resJson;

        if (!data) throw new Error("Invalid response");

        setPost(data);
      } catch (e) {
        console.error("❌ Fetch error:", e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  /* ---------------- KEYS ---------------- */

  const previewKeys = useMemo(() => {
    if (!post) return [];

    const normCat = normalizeCategory(post.category);
    const normSub = normalizeSubcategory(post.subcategory || "");

    const categoryConfig = CATEGORY_CONFIG[normCat];

    // ❌ No config → fallback ALL keys
    if (!categoryConfig) {
      console.warn("⚠️ No category config → fallback");
      return Object.keys(post);
    }

    // ✅ Find matching subcategory config
    const matchedKey = Object.keys(categoryConfig).find(
      (key) => normalizeSubcategory(key) === normSub
    );

    const config = matchedKey ? categoryConfig[matchedKey] : null;

    // ❌ No config match → fallback
    if (!config) {
      console.warn("⚠️ No subcategory config → fallback");

      return Object.keys(post).filter(
        (k) =>
          ![
            "_id",
            "__v",
            "images",
            "seller_info",
            "location",
            "createdAt",
            "updatedAt",
          ].includes(k)
      );
    }

    return config.map((f: any) => f.key);
  }, [post]);

  /* ---------------- DEBUG ---------------- */

  const debugJson = useMemo(() => {
    return JSON.stringify(post, null, 2);
  }, [post]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!post)
    return (
      <div className="p-6 text-center text-red-500">
        Post not found or deleted
      </div>
    );

  return (
    <>
      <AppHeader />

      <div className="max-w-3xl mx-auto my-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>{post.name || "Untitled"}</CardTitle>

            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge>{post.category}</Badge>
              {post.subcategory && <Badge>{post.subcategory}</Badge>}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6 mt-4">

            {/* BASIC */}
            <section>
              <h3 className="font-semibold">Basic</h3>
              <p><b>Title:</b> {post.name}</p>

              {post.description && (
                <p className="whitespace-pre-line">
                  <b>Description:</b> {post.description}
                </p>
              )}

              <div className="text-xs text-black-500">
              {post.adsId}
                 </div>
            </section>

            {/* DETAILS */}
            {previewKeys.length > 0 && (
              <section>
                <h3 className="font-semibold">Details</h3>

                {previewKeys.map((key) => {
                  const value = post[key];

                  if (
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0)
                  ) {
                    return null;
                  }

                  return (
                    <p key={key}>
                      <b>{formatLabel(key)}:</b>{" "}
                      {renderValue(key, value)}
                    </p>
                  );
                })}
              </section>
            )}

            {/* CONTACT */}
            <section>
              <h3 className="font-semibold">Contact</h3>
              <p><b>Name:</b> {post.seller_info?.name || "—"}</p>
              <p><b>Email:</b> {post.seller_info?.email || "—"}</p>
              <p><b>Phone:</b> {post.seller_info?.phone || "—"}</p>
            </section>

            {/* LOCATION */}
            <section>
              <h3 className="font-semibold">Location</h3>
              <p>{post.location?.address || "—"}</p>

              {post.location?.lat && post.location?.lng && (
                <iframe
                  className="w-full h-64 mt-2 rounded"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${post.location.lat},${post.location.lng}&z=15&output=embed`}
                />
              )}
            </section>

            {/* IMAGES */}
            {post.images?.length > 0 && (
              <section>
                <h3 className="font-semibold">Images</h3>

                <div className="grid grid-cols-3 gap-2">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`img-${i}`}
                      loading="lazy"
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
                <div className="text-xs text-black-1000 mt-1">
  {post.adsId}
</div>
              </section>
            )}

            {/* DEBUG */}
            <details>
              <summary className="cursor-pointer text-sm text-gray-500">
                Debug
              </summary>

              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {debugJson}
              </pre>
            </details>

          </CardContent>
        </Card>
      </div>

      <AppFooter />
    </>
  );
}