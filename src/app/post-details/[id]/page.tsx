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
  const [selectedImage, setSelectedImage] = useState(0);
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

  return (
    <>
      <AppHeader />

      {/* TOP BAR */}
      <div className="bg-slate-800">
  <div className="max-w-screen-2xl mx-auto sm:px-6 md:px-12 lg:px-20 xl:px-28 h-9 flex items-center">

    {/* LEFT SIDE (Breadcrumb) */}
    <ul className="flex items-center">

      {/* HOME */}
      <li className="inline-flex items-center">
        <a href="/" className="hover:text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-200"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </a>

        <Chevron />
      </li>

      {/* CATEGORY */}
      <li className="inline-flex items-center">
        <a
          href="#"
          className="text-slate-200 hover:text-slate-50 text-sm font-semibold"
        >
          {post.category || "Category"}
        </a>

        <Chevron />
      </li>

      {/* SUB CATEGORY */}
      <li className="inline-flex items-center">
        <a
          href="#"
          className="text-slate-200 hover:text-slate-50 text-sm font-semibold"
        >
          {post.subcategory || "Sub Category"}
        </a>
      </li>
    </ul>

    {/* RIGHT SIDE */}
    <div className="flex-1" />

    <button className="group flex items-center gap-2 text-slate-200 text-sm font-semibold hover:text-slate-100">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 rotate-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>

      <span className="hidden sm:inline">Create Alert</span>
    </button>
  </div>
</div>

      <div className="max-w-screen-2xl mx-auto sm:px-6 md:px-12 lg:px-20 xl:px-28 flex flex-col gap-y-2">

  {/* ================= TITLE ================= */}
  <div className="
    flex flex-col items-stretch
    bg-white px-4 py-4 
    border-b border-slate-900/25 sm:rounded-b-md
    sm:border-x sm:border-b
    sm:shadow-md sm:shadow-black/10
  ">
    <h2 className="font-semibold text-xl text-gray-800">
      {post.name}
    </h2>

    <div className="mt-0.5 flex items-start sm:gap-6 justify-between sm:justify-start">

      <div className="flex items-center gap-1 text-slate-700">
        📍
        <span>{post.location?.address || "No location available"}</span>
      </div>

      <button className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 rounded-full text-white px-3 pt-[2px] pb-[4px]">
        ➜ <span className="text-sm max-sm:hidden">Direction</span>
      </button>
    </div>
  </div>

  {/* ================= GRID ================= */}
  <div className="md:grid md:grid-cols-3 gap-x-2">

    {/* ================= LEFT ================= */}
    <div className="flex flex-col gap-y-2 col-span-2">

      {/* ================= GALLERY ================= */}
      <section className="
        bg-white px-4 py-5 flex flex-col gap-3
        border-y border-slate-900/25 
        sm:rounded-md sm:border
        sm:shadow-black/10 sm:shadow-md
      ">
        <div className="h-48 bg-slate-300 overflow-hidden">
          {post.images?.[selectedImage] && (
            <img
              src={post.images[selectedImage]}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex gap-1">
          {post.images?.slice(0, 6).map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setSelectedImage(i)}
              className={`size-12 object-cover cursor-pointer ${
                selectedImage === i ? "opacity-100" : "opacity-60"
              }`}
            />
          ))}
        </div>

        <div className="flex items-start gap-2">
          <div className="font-bold text-2xl text-gray-800">
            {renderValue("price", post.price)}
          </div>

          <span className="flex-1" />

          <button className="size-10 bg-slate-50 hover:bg-slate-200">🔗</button>
          <button className="size-10 bg-slate-50 hover:bg-slate-200">♡</button>
        </div>
      </section>

      {/* ================= SELLER (MOBILE) ================= */}
          <section
            className="
              md:hidden
              bg-white px-4 py-5
              border-y border-slate-900/25 
              sm:rounded-md sm:border
              sm:shadow-black/10 sm:shadow-md
              relative flex flex-col
            "
          >
            <h2 className="mb-2 text-xl font-medium text-slate-700">
              Seller Details
            </h2>

            {/* SELLER CONTENT */}
            <div className="flex flex-row gap-2">

              {/* PROFILE IMAGE */}
              <div className="flex-none size-28 border-4 border-white rounded-full overflow-hidden">
                <img
                  src={post.seller_info?.avatar || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"}
                  className="object-cover object-center h-32 w-full"
                  alt="seller"
                />
              </div>

              <div className="flex-1">

                {/* NAME */}
                <h3 className="font-bold text-xl text-gray-800 mb-1">
                  {post.seller_info?.name || "Unknown Seller"}
                </h3>

                {/* ROLE + LOCATION + TAGLINE */}
                <p className="-mt-1 mb-3 text-sm text-slate-600">
                  {post.seller_info?.role || "Seller"}, located in{" "}
                  {post.location?.address} |{" "}
                  <span className="italic">
                    "{post.seller_info?.tagline || "Trusted seller"}"
                  </span>
                </p>

                {/* METRICS */}
                <div className="flex items-center gap-2">

                  {/* VERIFIED */}
                  <div className="text-blue-700 inline-flex items-center text-sm font-semibold mr-3">
                    ✔ <span className="ml-1">Verified</span>
                  </div>

                  {/* LIKES */}
                  <div className="px-2 py-1 flex items-center gap-1 text-xs text-slate-600 bg-slate-100 rounded-md">
                    👍 <span>1.9K</span>
                  </div>

                  {/* REVIEWS */}
                  <div className="px-2 py-1 flex items-center gap-1 text-xs text-slate-600 bg-slate-100 rounded-md">
                    ⭐ <span>0.8K</span>
                  </div>
                </div>

              </div>
            </div>

            {/* KEY FACTS */}
            <div className="my-2 text-[14px] text-slate-700 leading-5">
              <span>Loyal user since 2021</span> |{" "}
              <span>{post.seller_info?.activeListings || 0} active listings</span> |{" "}
              <span>Active: 2d ago</span>
            </div>

          </section>

          {/* ================= MOBILE CTA ================= */}
            <section
              className="
                md:hidden
                bg-slate-700 p-3
                sm:rounded-b-md sm:shadow-black/10 sm:shadow-md
                flex flex-row flex-nowrap items-center gap-3 -mt-4 z-10
              "
            >
              <button className="flex-1 bg-blue-500 rounded-lg h-11 text-white font-semibold">
                <div className="flex gap-3 justify-center items-center">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </span>
                  <span className="text-lg">Email</span>
                </div>
              </button>

              <button className="flex-1 bg-rose-600 rounded-lg h-11 text-white font-semibold">
                <div className="flex gap-3 justify-center items-center">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path
                        fillRule="evenodd"
                        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-lg">Call</span>
                </div>
              </button>
            </section>

      {/* ================= DESCRIPTION ================= */}
      <section className="
        bg-white px-4 py-5
        border-y border-slate-900/25 
        sm:rounded-md sm:border
        sm:shadow-black/10 sm:shadow-md
      ">
        <h2 className="mb-2 text-xl font-medium text-slate-700 flex justify-between">
          <span>Description</span>
          <span className="text-sm font-normal text-slate-800">
            {fmtDate(post.createdAt)}
          </span>
        </h2>

        <p className="text-sm text-slate-700 leading-relaxed">
          {post.description || "No description available"}
        </p>

        <ul className="mt-5 px-3 sm:grid sm:grid-cols-2 md:grid-cols-3">
          {post.tags?.map((tag, i) => (
            <li key={i} className="mb-2 flex items-center">
              ✔ <span className="ml-1">{tag}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= KEY DETAILS ================= */}
        <section
          className="
            bg-white px-4 py-5
            border-y border-slate-900/25 
            sm:rounded-md sm:border
            sm:shadow-black/10 sm:shadow-md
          "
        >
          <h2 className="mb-2 text-xl font-medium text-slate-700">
            <span>Key Details</span>
          </h2>

          <table className="min-w-full border-collapse text-sm">
            <tbody>
              {previewKeys.map((key, i) => {
                const value = post[key];
                const isEven = i % 2 === 0;

                return (
                  <tr
                    key={key}
                    className={isEven ? "bg-slate-50 border-b" : "bg-white border-b"}
                  >
                    {/* KEY */}
                    <td className="
                      text-gray-900 font-normal
                      px-5 py-2
                      whitespace-nowrap
                      border border-slate-300
                    ">
                      {formatLabel(key)}
                    </td>

                    {/* VALUE */}
                    <td className="
                      text-gray-900 font-normal
                      px-5 py-2
                      border border-slate-300
                      break-words
                    ">
                      {value
                        ? Array.isArray(value)
                          ? value.join(", ")
                          : renderValue(key, value)
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

      {/* ================= GOOGLE FACTS ================= */}
      <section className="
        bg-white px-4 py-5
        border-y border-slate-900/25 
        sm:rounded-md sm:border
        sm:shadow-black/10 sm:shadow-md
      ">
        <h2 className="mb-2 text-xl font-medium text-slate-700">
          Facts from Google
        </h2>

        {["Stations nearby", "Schools nearby", "Walkable Shops"].map((item) => (
          <div key={item} className="flex justify-between py-3 border-b">
            {item} <span>+</span>
          </div>
        ))}
      </section>

      {/* ================= MAP (MOBILE) ================= */}
          <section
            className="
              md:hidden
              bg-white
              border-y border-slate-900/25 
              sm:rounded-md sm:border
              sm:shadow-black/10 sm:shadow-md
            "
          >
            <div className="px-4 pt-5 py-3">
              <h2 className="text-xl font-medium text-slate-700">
                Map Snap View
              </h2>
            </div>

            {/* MAP HOLDER */}
            <div className="w-full p-1">
              <div className="p-2 bg-slate-300 h-40 rounded-b-md overflow-hidden">

                {post.location?.lat && post.location?.lng ? (
                  <iframe
                    src={`https://maps.google.com/maps?q=${post.location.lat},${post.location.lng}&z=15&output=embed`}
                    className="w-full h-full rounded-b-md"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-700">
                    Map not available
                  </div>
                )}

              </div>
            </div>
          </section>

      {/* ================= DISCLAIMER ================= */}
      <section className="
        bg-yellow-300 px-4 py-5
        border-y border-yellow-900/25 
        sm:rounded-md sm:border
        sm:shadow-black/10 sm:shadow-md
      ">
        {post.disclaimer || "No disclaimer available"}
      </section>

      {/* ================= AD ID ================= */}
      <section className="
        bg-white px-4 py-5
        border-y border-slate-900/25 
        sm:rounded-md sm:border
        sm:shadow-black/10 sm:shadow-md
        flex items-center
      ">
        <p>Ad ID: <span className="font-bold">{post.adsId}</span></p>

        <button className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full">
          REPORT
        </button>
      </section>

      {/* ================= CHITCHAT (MOBILE) ================= */}
        <section
          className="
            md:hidden
            bg-white px-4 py-5
            border-y border-slate-900/25 
            sm:rounded-md sm:border  
            flex flex-col
          "
        >
          <h2 className="font-bold text-2xl text-gray-700">ChitChat</h2>
          <p className="mb-4">Don't worry this is private message to owner.</p>

          {/* CHAT BOX */}
          <div className="flex-grow overflow-y-auto bg-gray-200 rounded-xl px-4 py-5">
            <div className="flex flex-col gap-3">

              {/* RIGHT MESSAGE */}
              <div className="flex justify-end">
                <div className="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-white text-sm">
                    Hey, how are you?
                  </p>
                </div>
              </div>

              {/* LEFT MESSAGE */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-gray-900 text-sm">
                    I'm good, thanks! How about you?
                  </p>
                </div>
              </div>

              {/* RIGHT MESSAGE */}
              <div className="flex justify-end">
                <div className="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-white text-sm">
                    I am good, thank you! Could you please help share your number to call you over WhatsApp?
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* INPUT */}
          <div className="flex justify-center items-center h-16">
            <input
              type="text"
              className="flex-1 border border-gray-500 rounded-lg py-2 px-4 w-full mr-4"
              placeholder="Type a message..."
            />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded">
              Send
            </button>
          </div>
        </section>

    </div>

    {/* ================= RIGHT ================= */}
    <div className="max-md:hidden md:col-span-1 flex flex-col gap-y-2">

      {/* ================= SELLER ================= */}

          <section className=" bg-white border border-slate-900/25 rounded-md shadow-black/10 shadow-md overflow-hidden">

            {/* COVER IMAGE */}
            <div className="bg-slate-500 h-32 overflow-hidden">
              <img
                src={post.seller_info?.cover || "https://images.unsplash.com/photo-1549880338-65ddcdfd017b"}
                className="object-cover object-top w-full h-full"
                alt="cover"
              />
            </div>

            {/* CONTENT */}
            <div className="max-lg:px-2 px-5 pt-3 mb-2 text-center">

              {/* PROFILE IMAGE */}
              <div className="mx-auto w-32 h-32 relative -mt-28 border-4 border-white rounded-full overflow-hidden">
                <img
                  src={post.seller_info?.avatar || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"}
                  className="object-cover object-center h-32 w-full"
                  alt="profile"
                />
              </div>

              {/* NAME */}
              <h3 className="font-bold max-lg:text-xl text-2xl text-gray-800 mb-1">
                {post.seller_info?.name || "Unknown Seller"}
              </h3>

              {/* ROLE + LOCATION */}
              <p className="-mt-1 mb-1 text-slate-600 text-sm">
                {post.seller_info?.role || "Seller"}, located in{" "}
                <span className="inline">📍</span>{" "}
                {post.location?.address}
              </p>

              {/* TAGLINE */}
              <p className="italic text-lg font-thin text-slate-800 mb-4">
                {post.seller_info?.tagline || "Trusted seller"}
              </p>

              {/* VERIFIED */}
              <div className="bg-blue-200 text-blue-700 inline-flex items-center text-sm px-2 py-1 mb-2 rounded-md font-semibold">
                ✔ <span className="ml-1">Verified Seller</span>
              </div>

              {/* KEY INFO */}
              <div className="mb-4 text-sm text-slate-700">
                <span>Loyal user since 2021</span> |{" "}
                <span>{post.seller_info?.activeListings || 0} listings</span> |{" "}
                <span>Last Active: 2d ago</span>
              </div>

              {/* METRICS */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="px-3 py-1 text-sm text-slate-600 bg-slate-100 rounded-md">
                  👍 1.9K likes
                </div>

                <div className="px-3 py-1 text-sm text-slate-600 bg-slate-100 rounded-md">
                  ⭐ 0.8K reviews
                </div>
              </div>

            </div>

            {/* CTA BUTTONS */}
            <div className="px-6 mb-5 flex flex-col gap-2.5">

              <button className="w-full border-2 border-gray-400 hover:bg-slate-100 rounded-lg py-2 font-semibold">
                <div className="flex gap-3 justify-center items-center">
                  ✉️ <span>Email</span>
                </div>
              </button>

              <button className="w-full bg-rose-600 hover:bg-rose-700 rounded-lg text-white font-semibold py-2">
                <div className="flex gap-3 justify-center items-center">
                  📞 <span>Call</span>
                </div>
              </button>

            </div>

          </section>

      {/* ================= CHITCHAT ================= */}
        <section
          className="
            bg-white px-4 py-5
            border border-slate-900/25 
            rounded-md shadow-black/10 shadow-md
            flex flex-col
          "
        >
          <h2 className="font-bold text-2xl text-gray-700">ChitChat</h2>
          <p className="mb-4">Don't worry this is private message to owner.</p>

          <div className="flex-grow overflow-y-auto bg-gray-200 rounded-xl px-4 py-5">
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <div className="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-white text-sm">Hey, how are you?</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-gray-900 text-sm">
                    I'm good, thanks! How about you?
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-white text-sm">
                    I am good, thank you! Could you please help share your number to
                    call you over WhatsUp ?
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center h-16">
            <input
              type="text"
              className="flex-1 border border-gray-500 rounded-lg py-2 px-4 w-full mr-3"
              placeholder="Type a message..."
            />
            <button className="border border-blue-600 bg-blue-500 hover:bg-blue-700 rounded-lg text-white font-bold py-2 px-5 flex items-center justify-center">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
                  <path
                    fill="currentColor"
                    d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </section>

      {/* ================= MAP ================= */}
        <section
          className="
            bg-white
            border-y border-slate-900/25 
            sm:rounded-md sm:border
            sm:shadow-black/10 sm:shadow-md
          "
        >
          {/* HEADER */}
          <div className="px-4 pt-5 py-3">
            <h2 className="text-xl font-medium text-slate-700">
              Map Snap View
            </h2>
          </div>

          {/* MAP HOLDER */}
          <div className="w-full p-1">
            <div className="p-2 bg-slate-300 h-40 rounded-b-md overflow-hidden">

              {post.location?.lat && post.location?.lng ? (
                <iframe
                  className="w-full h-full rounded-b-md"
                  src={`https://maps.google.com/maps?q=${post.location.lat},${post.location.lng}&z=15&output=embed`}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-600">
                  Map not available
                </div>
              )}

            </div>
          </div>
        </section>

    </div>

  </div>
</div>

      <AppFooter />
    </>
  );
}