"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import { Button } from "@/components/ui/button";
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

  {/* PAGE BACKGROUND */}
  <div className="bg-slate-100 min-h-screen py-6">
    <div className="max-w-screen-2xl mx-auto px-4 md:px-12 lg:px-20 xl:px-28">

      <div className="grid md:grid-cols-3 gap-6">

        {/* ================= LEFT COLUMN ================= */}
        <div className="md:col-span-2 space-y-5">

          {/* TITLE + LOCATION */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-5">
            <h1 className="text-xl font-semibold text-slate-800">
              {post.name || "Untitled"}
            </h1>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                📍 {post.location?.address || "—"}
              </div>

              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-4 py-1 text-sm">
                Direction
              </Button>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="bg-lime-400 text-lime-900 text-xs px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>

              {post.subcategory && (
                <span className="bg-lime-400 text-lime-900 text-xs px-3 py-1 rounded-full font-medium">
                  {post.subcategory}
                </span>
              )}
            </div>
          </Card>

          {/* IMAGE + PRICE */}
          {post.images?.length > 0 && (
            <Card className="bg-white border-none shadow-sm rounded-xl p-4 space-y-4">

              <div className="w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
                <img
                  src={post.images[0]}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {post.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {renderValue("price", post.price)}
                </div>

                <div className="flex gap-2">
                  <Button className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full px-3">
                    Share
                  </Button>
                  <Button className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full px-3">
                    ❤️
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* DESCRIPTION */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-slate-800">
                Description
              </h2>
              <span className="text-sm text-slate-400">
                {fmtDate(post.createdAt)}
              </span>
            </div>

            <p className="text-sm text-slate-600 whitespace-pre-line">
              {post.description || "—"}
            </p>
          </Card>

          {/* DETAILS */}
          {previewKeys.length > 0 && (
            <Card className="bg-white border-none shadow-sm rounded-xl p-5">
              <h2 className="text-base font-semibold text-slate-800 mb-4">
                Details
              </h2>

              <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
                {previewKeys.map((key) => {
                  const value = post[key];

                  if (
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0)
                  ) return null;

                  return (
                    <div key={key} className="contents">
                      <div className="p-3 bg-slate-100 border text-sm font-medium text-slate-700">
                        {formatLabel(key)}
                      </div>
                      <div className="p-3 border text-sm text-slate-600">
                        {renderValue(key, value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* MAP */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-3">
            <h3 className="px-3 pt-2 font-semibold text-slate-800">Location</h3>

            {post.location?.lat && post.location?.lng ? (
              <iframe
                className="w-full h-64 mt-2 rounded-lg"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${post.location.lat},${post.location.lng}&z=15&output=embed`}
              />
            ) : (
              <p className="p-4 text-sm text-slate-500">
                No location available
              </p>
            )}
          </Card>

          {/* AD ID */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Ad ID: <span className="font-bold">{post.adsId}</span>
            </p>

            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-4">
              Report
            </Button>
          </Card>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="hidden md:block space-y-5">

          {/* SELLER */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-5 text-center">
            <div className="flex flex-col items-center gap-3">

              <div className="w-24 h-24 rounded-full bg-slate-200" />

              <h3 className="font-semibold text-slate-800">
                {post.seller_info?.name || "Seller"}
              </h3>

              <p className="text-sm text-slate-500">
                {post.location?.address || ""}
              </p>

              <span className="bg-lime-400 text-lime-900 text-xs px-3 py-1 rounded-full font-medium">
                Verified
              </span>

              <div className="w-full mt-4 space-y-2">
                <Button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full">
                  Email
                </Button>
                <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                  Call
                </Button>
              </div>
            </div>
          </Card>

          {/* CONTACT */}
          <Card className="bg-white border-none shadow-sm rounded-xl p-5">
            <h3 className="font-semibold mb-3 text-slate-800">Contact</h3>

            <p className="text-sm text-slate-600">
              <b>Name:</b> {post.seller_info?.name || "—"}
            </p>
            <p className="text-sm text-slate-600">
              <b>Email:</b> {post.seller_info?.email || "—"}
            </p>
            <p className="text-sm text-slate-600">
              <b>Phone:</b> {post.seller_info?.phone || "—"}
            </p>
          </Card>

        </div>

      </div>
    </div>
  </div>

  <AppFooter />
</>
  );
}