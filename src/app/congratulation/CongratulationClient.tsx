"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PostLocation = {
  address?: string;
};

type PostData = {
  _id: string;
  name?: string;
  title?: string;
  category?: string;
  subcategory?: string;
  salePrice?: number;
  rentPrice?: number;
  price?: number;
  images?: string[];
  location?: PostLocation;
};

function formatPrice(v?: number) {
  if (!v) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function CongratulationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const res = await fetch(`/api/post-details/${postId}`, {
          cache: "no-store",
        });

        const json = await res.json();
        setPost(json.data);
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  const title = useMemo(() => {
    return post?.name || post?.title || "Your advertisement";
  }, [post]);

  const priceText = useMemo(() => {
    const raw =
      post?.salePrice ??
      post?.rentPrice ??
      post?.price;

    return formatPrice(raw);
  }, [post]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">

      <h1 className="text-3xl font-bold mb-2">
        Congratulations!
      </h1>

      {loading && (
        <p className="text-gray-500 mb-6">
          Preparing your advertisement summary...
        </p>
      )}

      {!loading && post && (
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-4 bg-white border border-gray-200 rounded-lg shadow mb-6 px-4 py-4">

          {/* Image Preview */}
          <img
            src={post.images?.[0] || "https://via.placeholder.com/80"}
            alt="Ad preview"
            className="w-24 h-24 rounded object-cover border"
          />

          {/* Ad Details */}
          <div className="flex-1">

            {/* Title */}
            <div className="font-semibold text-lg text-gray-800">
              {title}
            </div>

            {/* Category */}
            <div className="text-sm text-gray-500 mt-1">
              {post.category} • {post.subcategory}
            </div>

            {/* Price */}
            {priceText && (
              <div className="text-sm text-gray-700 mt-1">
                {priceText}
              </div>
            )}

            {/* Location */}
            {post.location?.address && (
              <div className="text-xs text-gray-500 mt-1">
                {post.location.address}
              </div>
            )}
          </div>

          {/* Status */}
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300">
            PENDING
          </span>

        </div>
      )}

      <p className="text-gray-600 mb-6 text-lg max-w-xl text-center">
        Your advertisement has been submitted for review! Our team will verify
        your details, and your ad will be live for everyone to see very soon.
      </p>

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push("/my-ads")}
        >
          Go to Manage Ads
        </button>

        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>

      {postId && (
        <p className="mt-4 text-xs text-gray-400">
          Reference ID: {postId}
        </p>
      )}
    </main>
  );
}