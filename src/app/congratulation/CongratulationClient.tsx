// src/app/congratulation/CongratulationClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PostLocation = {
  address?: string;
};

type PostData = {
  _id: string;
  name?: string;
  title?: string; // in case your API uses title
  salePrice?: number;
  rentPrice?: number;
  price?: number;
  location?: PostLocation;
};

// simple formatter – adjust currency if needed
function formatPrice(v?: number) {
  if (v === null || v === undefined || Number.isNaN(v)) return "";
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
  const [loading, setLoading] = useState<boolean>(!!postId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ use your existing API: /api/post-details/[id]
        const res = await fetch(`/api/post-details/${postId}`, {
          method: "GET",
        });

        if (!res.ok) {
          console.error("Failed to load post:", res.status, res.statusText);
          if (!cancelled) {
            setError(
              "We couldn’t load your ad details, but your submission was received."
            );
          }
          return;
        }

        const json = await res.json();
        const p: PostData = (json.post ?? json.data ?? json) as PostData;

        if (!cancelled) {
          setPost(p);
        }
      } catch (e) {
        console.error("Error loading post:", e);
        if (!cancelled) {
          setError(
            "We couldn’t load your ad details, but your submission was received."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const title = useMemo(
    () => post?.name || post?.title || "Your advertisement",
    [post]
  );

  const priceText = useMemo(() => {
    const raw =
      post?.salePrice ??
      post?.rentPrice ??
      post?.price ??
      undefined;

    if (raw === undefined) return "";
    return formatPrice(raw);
  }, [post]);

  const locationText = useMemo(
    () => post?.location?.address || "",
    [post]
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>

      {loading && (
        <p className="text-gray-500 mb-4 text-sm">
          Saving your advertisement and preparing a quick summary…
        </p>
      )}

      {error && (
        <p className="text-red-600 mb-4 text-sm">{error}</p>
      )}

      {/* Advertisement Summary Card */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-4 bg-white border border-gray-200 rounded-lg shadow mb-6 px-4 py-3">
        <img
          src="https://via.placeholder.com/80?text=Ad"
          alt="Ad Preview"
          className="w-20 h-20 rounded object-cover border border-gray-300"
        />

        <div className="flex-1">
          <div className="font-semibold text-lg text-gray-800">
            {title}
          </div>

          <div className="text-sm text-gray-600 mt-1">
            {priceText ? (
              <span>{priceText}</span>
            ) : (
              <span className="text-gray-400">Price not specified</span>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {locationText ? (
              <span>{locationText}</span>
            ) : (
              <span className="text-gray-400">
                Location not specified
              </span>
            )}
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300">
          PENDING
        </span>
      </div>

      <p className="text-gray-600 mb-6 text-lg max-w-xl text-center">
        Your advertisement has been submitted for review! Our team will verify
        your details, and your ad will be live for everyone to see very soon.
        Thank you for being a valued part of our community!
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
