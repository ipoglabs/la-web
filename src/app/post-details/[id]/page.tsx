"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ChitChat from "./components/ChitChat";
import AppHeader from "@/app/components/AppHeader/appHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import {
  normalizeCategory,
  normalizeSubcategory,
} from "@/posting/config/normalize";
import { CATEGORY_CONFIG } from "@/posting/config/categoryConfig";

/* ─── Internal DB fields never shown to users in Key Details ─── */
const INTERNAL_FIELDS = new Set([
  "_id", "__v", "ownerId", "adsId", "status", "expiresAt", "lastBumpedAt",
  "deletedAt", "createdAt", "updatedAt", "images", "seller_info", "location",
  "name", "description", "category", "subcategory", "reported", "reports",
  "reportedAt", "reportedBy", "isSuspended", "suspendedAt", "suspendedBy",
]);

/* ─── Helpers (module scope) ─── */

function fmtCurrency(v: unknown): string {
  if (!v) return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const CURRENCY_KEYS = new Set([
  "rentPrice", "salePrice", "deposit", "salary", "price", "budget",
  "budgetAmount", "rateNightly", "rateWeekly", "rateMonthly", "rent",
  "hourlyRate", "stipendAmount",
]);

const DATE_KEYS = new Set([
  "available_from", "startDate", "endDate", "deadline", "insuranceValidTill",
]);

function renderValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (CURRENCY_KEYS.has(key)) return fmtCurrency(value);
  if (DATE_KEYS.has(key)) return fmtDate(value);
  return String(value);
}

function getPostPrice(post: Post): string {
  const raw =
    post.price ?? post.rentPrice ?? post.salePrice ?? post.salary ??
    post.budget ?? post.rateNightly ?? post.budgetAmount ?? post.rent;
  if (!raw) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(Number(raw));
}

/* ─── Chevron — extracted to module scope, not inside render ─── */
function Chevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mx-2 text-slate-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ─── Types ─── */

type Post = {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  category: string;
  subcategory?: string;
  location?: { address?: string; lat?: number; lng?: number };
  seller_info?: { name?: string; email?: string; phone?: string };
  ownerId?: string;
  adsId?: string;
  createdAt?: string;
  [k: string]: any;
};

/* ─── CTA buttons (phone / email) ─── */
function CTAButtons({ phone, email }: { phone?: string; email?: string }) {
  return (
    <div className="flex flex-row flex-nowrap items-center gap-3 p-3 bg-slate-700 sm:rounded-md">
      <a
        href={email ? `mailto:${email}` : undefined}
        className={`flex-1 bg-blue-500 rounded-lg h-11 text-white font-semibold flex gap-3 justify-center items-center ${!email ? "opacity-50 pointer-events-none" : "hover:bg-blue-600"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
        <span className="text-lg">Email</span>
      </a>

      <a
        href={phone ? `tel:${phone}` : undefined}
        className={`flex-1 bg-rose-600 rounded-lg h-11 text-white font-semibold flex gap-3 justify-center items-center ${!phone ? "opacity-50 pointer-events-none" : "hover:bg-rose-700"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
        </svg>
        <span className="text-lg">Call</span>
      </a>
    </div>
  );
}

/* ─── Map embed — single component, reused in both layouts ─── */
function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="p-2 bg-slate-300 h-40 rounded-b-md overflow-hidden">
      <iframe
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
        className="w-full h-full rounded-b-md"
        loading="lazy"
        title="Location map"
      />
    </div>
  );
}

/* ─── Main component ─── */

export default function PostDetailPageClient() {
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch ── */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/post-details/${id}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => setPost(json?.data ?? json))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Key details (safe fallback filters internal fields) ── */
  const previewKeys = useMemo(() => {
    if (!post) return [];

    const normCat = normalizeCategory(post.category);
    const normSub = normalizeSubcategory(post.subcategory ?? "");
    const categoryConfig = CATEGORY_CONFIG[normCat];

    const safeKeys = (keys: string[]) =>
      keys.filter((k) => {
        if (INTERNAL_FIELDS.has(k)) return false;
        const v = post[k];
        if (v === undefined || v === null || v === "") return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      });

    if (!categoryConfig) return safeKeys(Object.keys(post));

    const matchedKey = Object.keys(categoryConfig).find(
      (key) => normalizeSubcategory(key) === normSub
    );

    const config = matchedKey ? categoryConfig[matchedKey] : null;
    if (!config) return safeKeys(Object.keys(post));

    return (config as { key: string }[]).map((f) => f.key).filter(
      (k) => !INTERNAL_FIELDS.has(k)
    );
  }, [post]);

  /* ── Loading / not found ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-slate-400">Loading…</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Post not found or deleted.</p>
      </div>
    );
  }

  const price = getPostPrice(post);
  const phone = post.seller_info?.phone;
  const email = post.seller_info?.email;
  const sellerName = post.seller_info?.name || "Unknown Seller";
  const hasMap = !!(post.location?.lat && post.location?.lng);

  /* Images — served from Cloudflare R2 public URL stored in DB */
  const images: string[] = Array.isArray(post.images) ? post.images.filter(Boolean) : [];

  return (
    <>
      <AppHeader />

      {/* ── Breadcrumb bar ── */}
      <div className="bg-slate-800">
        <div className="max-w-screen-2xl mx-auto sm:px-6 md:px-12 lg:px-20 xl:px-28 h-9 flex items-center">
          <ul className="flex items-center">
            <li className="inline-flex items-center">
              <a href="/" className="hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </a>
              <Chevron />
            </li>
            <li className="inline-flex items-center">
              <a
                href={`/?category=${encodeURIComponent(post.category)}`}
                className="text-slate-200 hover:text-slate-50 text-sm font-semibold"
              >
                {post.category}
              </a>
              <Chevron />
            </li>
            <li>
              <span className="text-slate-200 text-sm font-semibold">
                {post.subcategory}
              </span>
            </li>
          </ul>

          <div className="flex-1" />

          <button className="flex items-center gap-2 text-slate-200 text-sm font-semibold hover:text-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 rotate-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="hidden sm:inline">Create Alert</span>
          </button>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto sm:px-6 md:px-12 lg:px-20 xl:px-28 flex flex-col gap-y-2">

        {/* ── Title bar ── */}
        <div className="flex flex-col items-stretch bg-white px-4 py-4 border-b border-slate-900/25 sm:rounded-b-md sm:border-x sm:border-b sm:shadow-md sm:shadow-black/10">
          <h2 className="font-semibold text-xl text-gray-800">{post.name}</h2>
          <div className="mt-0.5 flex items-start sm:gap-6 justify-between sm:justify-start">
            <div className="flex items-center gap-1 text-slate-700">
              📍 <span>{post.location?.address || "No location"}</span>
            </div>
            {hasMap && (
              <a
                href={`https://www.google.com/maps?q=${post.location!.lat},${post.location!.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 rounded-full text-white px-3 pt-[2px] pb-[4px] text-sm"
              >
                ➜ <span className="max-sm:hidden">Direction</span>
              </a>
            )}
          </div>
        </div>

        {/* ── Mobile: seller summary + CTA (shows above grid on mobile only) ── */}
        <div className="md:hidden flex flex-col gap-y-2">
          <section className="bg-white px-4 py-5 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-md sm:shadow-black/10">
            <h2 className="mb-2 text-xl font-medium text-slate-700">Seller Details</h2>
            <div className="flex flex-row gap-4 items-center">
              <div className="flex-none size-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{sellerName}</h3>
                <p className="text-sm text-slate-500">{post.location?.address}</p>
              </div>
            </div>
          </section>
          <CTAButtons phone={phone} email={email} />
        </div>

        {/* ── Main grid ── */}
        <div className="md:grid md:grid-cols-3 gap-x-2">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-y-2 col-span-2">

            {/* Gallery */}
            <section className="bg-white px-4 py-5 flex flex-col gap-3 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-black/10 sm:shadow-md">
              <div className="h-72 bg-slate-200 overflow-hidden rounded">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${post.name} photo ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                    No photos
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-1 flex-wrap">
                  {images.slice(0, 8).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`size-14 overflow-hidden rounded border-2 transition ${selectedImage === i ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <div className="font-bold text-2xl text-gray-800">
                  {price || "—"}
                </div>
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => navigator.share?.({ title: post.name, url: window.location.href }).catch(() => {})}
                  className="size-10 bg-slate-50 hover:bg-slate-200 rounded flex items-center justify-center"
                  title="Share"
                >
                  🔗
                </button>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white px-4 py-5 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-black/10 sm:shadow-md">
              <h2 className="mb-2 text-xl font-medium text-slate-700 flex justify-between">
                <span>Description</span>
                <span className="text-sm font-normal text-slate-500">
                  {fmtDate(post.createdAt)}
                </span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {post.description || "No description available."}
              </p>
            </section>

            {/* Key Details */}
            {previewKeys.length > 0 && (
              <section className="bg-white px-4 py-5 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-black/10 sm:shadow-md">
                <h2 className="mb-3 text-xl font-medium text-slate-700">Key Details</h2>
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    {previewKeys.map((key, i) => {
                      const value = post[key];
                      return (
                        <tr key={key} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                          <td className="text-gray-700 font-medium px-4 py-2 whitespace-nowrap border border-slate-200 w-40">
                            {formatLabel(key)}
                          </td>
                          <td className="text-gray-800 px-4 py-2 border border-slate-200 break-words">
                            {renderValue(key, value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}

            {/* Ad ID + Report */}
            <section className="bg-white px-4 py-4 border-y border-slate-900/25 sm:rounded-md sm:border sm:shadow-black/10 sm:shadow-md flex items-center gap-4">
              <p className="text-sm text-slate-600">
                Ad ID: <span className="font-bold text-slate-800">{post.adsId || "—"}</span>
              </p>
              <button
                type="button"
                className="ml-auto bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-full"
              >
                REPORT
              </button>
            </section>

          </div>

          {/* ── Right column ── */}
          <div className="md:col-span-1 flex flex-col gap-y-2">

            {/* Seller card — desktop only */}
            <section className="max-md:hidden bg-white border border-slate-900/25 rounded-md shadow-black/10 shadow-md overflow-hidden">
              <div className="bg-slate-200 h-24" />
              <div className="px-5 pt-3 pb-4 text-center">
                <div className="mx-auto w-20 h-20 -mt-12 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-indigo-600">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mt-2">{sellerName}</h3>
                <p className="text-sm text-slate-500 mb-1">{post.location?.address}</p>
                <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold mb-4">
                  ✔ Verified Seller
                </div>
                <div className="flex flex-col gap-2 px-2">
                  <a
                    href={email ? `mailto:${email}` : undefined}
                    className={`w-full border-2 border-gray-300 rounded-lg py-2 text-sm font-semibold flex gap-2 justify-center items-center ${!email ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"}`}
                  >
                    ✉️ Email
                  </a>
                  <a
                    href={phone ? `tel:${phone}` : undefined}
                    className={`w-full bg-rose-600 text-white rounded-lg py-2 text-sm font-semibold flex gap-2 justify-center items-center ${!phone ? "opacity-50 pointer-events-none" : "hover:bg-rose-700"}`}
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            </section>

            {/* ChitChat — single instance, shown on both mobile and desktop */}
            <section className="bg-white px-4 py-5 border border-slate-900/25 rounded-md shadow-black/10 shadow-md flex flex-col">
              <h2 className="font-bold text-xl text-gray-700 mb-1">ChitChat</h2>
              <p className="mb-4 text-sm text-slate-500">Private message to the owner.</p>
              <ChitChat
                postId={post._id}
                postTitle={post.name}
                postPrice={price}
                postImage={images[0] || ""}
                sellerId={post.ownerId?.toString() || ""}
              />
            </section>

            {/* Map — single instance */}
            <section className="bg-white border border-slate-900/25 rounded-md shadow-black/10 shadow-md overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-lg font-medium text-slate-700">Map View</h2>
              </div>
              <div className="p-1">
                {hasMap ? (
                  <MapEmbed lat={post.location!.lat!} lng={post.location!.lng!} />
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-slate-400">
                    Map not available
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>

      <AppFooter />
    </>
  );
}
