"use client";

import { useState } from "react";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/components/ui/tabs";

import * as Tabs from "@radix-ui/react-tabs";


import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ReviewForm from "./reviewForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileListingCard from "./ProfileListingCard";
import MessageResponsiveDialog from "../components/responsive-dialog/MessageDrawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function PublicProfile({ user }: any) {
  const [openMessage, setOpenMessage] = useState(false);

  //listing states
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [currentPage, setCurrentPage] = useState(1);


// ================= REVIEW STATES =================

const [showReviewForm, setShowReviewForm] = useState(false);
const [pendingRating, setPendingRating] = useState(0);
const [pendingComment, setPendingComment] = useState("");

const [reviewVotes, setReviewVotes] = useState<
  Record<string, "up" | "down" | null>
>({});

// local UI state (important for instant update)
const [reviews, setReviews] = useState(user.reviews || []);

const [contactRevealed, setContactRevealed] = useState(false);

const handleRevealContact = () => {
  setContactRevealed(true);
};

  const isDesktop = useMediaQuery("(min-width: 768px)");

 async function submitReview() {
  try {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        rating: pendingRating,
        comment: pendingComment,
      }),
    });

    const data = await res.json();

   if (!res.ok) {
  if (data.error === "You already reviewed this user") {
    alert("You have already submitted a review for this user.");
    
    // optional UX improvement
    setShowReviewForm(false);

    return; // ✅ stop execution (important)
  }

  throw new Error(data.error || "Failed");
}

    // ✅ IMPORTANT: ensure UNIQUE ID
    const newReview = {
       id: data.review._id.toString(),
      name: data.review.name,
      rating: data.review.rating,
      comment: data.review.comment,
      createdAt: data.review.createdAt,
    };

    setReviews((prev) => [newReview, ...prev]);

    setShowReviewForm(false);
    setPendingRating(0);
    setPendingComment("");

  } catch (err) {
    console.error(err);
    alert("Failed to submit review");
  }
}

const handleVote = (id: string, dir: "up" | "down") => {
  setReviewVotes((prev) => ({
    ...prev,
    [id]: prev[id] === dir ? null : dir,
  }));
};

function ContactRow({
  label,
  icon,
  maskedValue,
  revealedValue,
  revealed,
  onReveal,
}: {
  label: string;
  icon: ReactNode;
  maskedValue?: string;
  revealedValue?: string;
  revealed: boolean;
  onReveal: () => void;
}) {
  const value = revealed ? revealedValue : maskedValue;

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-slate-100 last:border-0">
      <div className="shrink-0 size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </div>

        <div className="text-sm text-slate-800 font-medium tabular-nums mt-0.5 truncate">
          {value || "Not available"}
        </div>
      </div>

      {revealed ? (
        <a
          href={
            label === "Email"
              ? `mailto:${revealedValue || ""}`
              : `tel:${revealedValue || ""}`
          }
          className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          {label === "Email" ? "Send email" : "Call"}
        </a>
      ) : (
        <button
          type="button"
          onClick={onReveal}
          className="shrink-0 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:border-slate-400 hover:text-slate-800 transition-colors"
        >
          Show
        </button>
      )}
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">

      {/* ================= PROFILE HEADER ================= */}
      <section className="w-full bg-white px-4 pt-5 pb-4 border-y border-slate-900/20 sm:rounded-xl sm:border sm:shadow-sm">

  {/* Avatar + Core Info */}
  <div className="flex gap-3 items-start">
    <div className="relative shrink-0 size-16 sm:size-20">
      <div className="size-full rounded-full overflow-hidden border-2 border-slate-200">
        <img
          className="w-full h-full object-cover object-center"
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
          }
          alt={user.name}
        />
      </div>

      {/* Online / Offline */}
      <span
        className={`absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-white ${
          user.isOnline ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6">

      {/* LEFT */}
      <div className="min-w-0">

        {/* NAME + VERIFIED */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            {user.name}
          </h1>

          {/* Verified badge */}
          {user.isVerified && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 text-blue-500 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* ROLE + LOCATION */}
        <p className="text-sm text-slate-500 mt-0.5">
          {user.role || "Seller"} · 📍 {user.location || "Unknown"}
        </p>

        {/* TAGLINE */}
        <p className="text-xs text-slate-400 italic mt-0.5">
          {user.tagline || "Trusted seller"}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-yellow-500">⭐⭐⭐⭐☆</span>
          <span className="text-sm font-bold text-slate-700">
            {user.rating || "4.2"}
          </span>
          <span className="text-sm text-slate-400">
            ({user.reviewsCount || 0} reviews)
          </span>
        </div>

        {/* PUBLIC ID */}
        <div className="text-xs text-slate-400 mt-1">
          ID: <span className="font-medium">{user.userId}</span>
        </div>
      </div>

      {/* RIGHT (Desktop stats) */}
      <div className="hidden sm:flex flex-col items-center justify-center gap-3 shrink-0 self-stretch border-l border-slate-100 pl-6">
        <div className="flex items-center gap-5">

          <div className="text-center">
            <div className="text-base font-bold text-slate-900">
              {user.activeListings || 0}
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Listings
            </div>
          </div>

          <div className="w-px h-7 bg-slate-100" />

          <div className="text-center">
            <div className="text-base font-bold text-slate-900">
              {user.likes || 0}
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Likes
            </div>
          </div>

          <div className="w-px h-7 bg-slate-100" />

          <div className="text-center">
            <div className="text-base font-bold text-slate-900">
              {user.followers || 0}
            </div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">
              Followers
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  {/* MOBILE STATS */}
  <div className="sm:hidden mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 divide-x text-center">
    <div>
      <div className="text-base font-bold">{user.activeListings || 0}</div>
      <div className="text-[10px] text-slate-400 uppercase">Listings</div>
    </div>
    <div>
      <div className="text-base font-bold">{user.likes || 0}</div>
      <div className="text-[10px] text-slate-400 uppercase">Likes</div>
    </div>
    <div>
      <div className="text-base font-bold">{user.followers || 0}</div>
      <div className="text-[10px] text-slate-400 uppercase">Followers</div>
    </div>
  </div>

  {/* META */}
  <div className="mt-3 flex flex-wrap gap-x-2 text-xs text-slate-400">
    <span>
      Member since{" "}
      {user.createdAt
        ? new Date(user.createdAt).getFullYear()
        : "—"}
    </span>
    <span>·</span>
    <span>{user.lastActive || "Recently active"}</span>
  </div>
</section>

      {/* ================= TABS ================= */}
      <section className="w-full bg-white border-y sm:border border-slate-900/10 sm:rounded-xl sm:shadow-sm overflow-hidden">

  <Tabs.Root defaultValue="listing">

  {/* TAB HEADER */}
  <Tabs.List
    className="flex border-b border-slate-200 overflow-x-auto"
    aria-label="Profile tabs"
  >
    {[
      {
        value: "listing",
        label: "Listings",
        count: user.listings?.length || 0,
      },
      {
        value: "review",
        label: "Reviews",
        count: user.reviews?.length || 0,
      },
      {
        value: "contact",
        label: "Contact",
      },
    ].map(({ value, label, count }) => (
      <Tabs.Trigger
        key={value}
        value={value}
        className="flex-1 sm:flex-none px-5 py-3 text-sm font-medium 
        text-slate-500 border-b-2 border-transparent transition-colors
        data-[state=active]:text-slate-900 
        data-[state=active]:border-slate-900"
      >
        {label}
        {count !== undefined && (
          <span className="ml-1.5 text-[11px] text-slate-400">
            {count}
          </span>
        )}
      </Tabs.Trigger>
    ))}
  </Tabs.List>

  {/* CONTENT WRAPPER (important for layout stability) */}
  <div className="min-h-96">

    {/* LISTINGS */}
    <Tabs.Content
        value="listing"
        forceMount
        className="p-4 data-[state=inactive]:hidden"
      >

          {/* FILTER PILLS */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {(["all", "active", "closed"] as const).map((f) => {
              const count =
                f === "all"
                  ? user.listings?.length || 0
                  : user.listings?.filter((l: any) => l.status === f).length || 0;

              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f.charAt(0).toUpperCase() + f.slice(1)}

                  <span className="ml-1 opacity-60 font-normal">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FILTERED DATA */}
          {(() => {
            const filtered =
              filter === "all"
                ? user.listings || []
                : user.listings?.filter((l: any) => l.status === filter) || [];

            return (
              <>
                {/* GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                  {filtered.length ? (
                    filtered.map((item: any) => (
                      <ProfileListingCard key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="col-span-full text-center text-slate-500">
                      No listings
                    </div>
                  )}

                </div>

                {/* PAGINATION (UI only for now) */}
                <div className="mt-5 flex justify-center items-center gap-1.5">

                  <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-600">
                    ←
                  </button>

                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      className={`size-8 rounded-lg text-sm font-medium ${
                        p === currentPage
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}

                  <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-600">
                    →
                  </button>

                </div>
              </>
            );
          })()}

    </Tabs.Content>

    {/* REVIEWS */}
   <Tabs.Content
  value="review"
  forceMount
  className="p-4 data-[state=inactive]:hidden"
>
  {/* ===== SUMMARY ===== */}
  {(() => {
    const avg =
      reviews.length > 0
        ? (
            reviews.reduce((s, r) => s + r.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    const counts = [5, 4, 3, 2, 1].map((s) => ({
      star: s,
      count: reviews.filter((r) => r.rating === s).length,
    }));

    return (
      <>
        <div className="flex gap-5 pb-5 mb-5 border-b">

          <div className="text-center">
            <div className="text-4xl font-bold">{avg}</div>
            <div className="text-yellow-500">
              {"⭐".repeat(Math.round(Number(avg)))}
            </div>
            <div className="text-xs text-slate-400">
              {reviews.length} reviews
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {counts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs w-3">{star}</span>

                <div className="flex-1 h-1.5 bg-slate-100">
                  <div
                    className="h-full bg-amber-400"
                    style={{
                      width: reviews.length
                        ? `${(count / reviews.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>

                <span className="text-xs text-slate-400 w-4">
                  {count}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* ===== LIST ===== */}
        <div className="space-y-5">
  {reviews.length ? (
    reviews.map((review: any, index: number) => (
      <div
        key={`${review.id}-${index}`} // ✅ SAFE KEY
        className="flex gap-3"
      >
        <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
          {review.name?.charAt(0)}
        </div>

        <div className="flex-1">

          <div className="flex justify-between">
            <span className="text-sm font-semibold">
              {review.name || "Anonymous"}
            </span>

            <span className="text-xs text-slate-400">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <div className="text-yellow-500 text-xs mt-1">
            {"⭐".repeat(review.rating)}
          </div>

          <p className="text-sm text-slate-600 mt-1">
            {review.comment}
          </p>

          <div className="flex gap-2 mt-2 text-xs">

            <button
              onClick={() => handleVote(review.id, "up")}
              className={
                reviewVotes[review.id] === "up"
                  ? "text-green-600"
                  : "text-slate-400"
              }
            >
              👍
            </button>

            <button
              onClick={() => handleVote(review.id, "down")}
              className={
                reviewVotes[review.id] === "down"
                  ? "text-red-600"
                  : "text-slate-400"
              }
            >
              👎
            </button>

          </div>

        </div>
      </div>
    ))
  ) : (
    <div className="text-center text-slate-500">
      No reviews yet
    </div>
  )}
</div>

        {/* ===== WRITE REVIEW ===== */}
        {showReviewForm ? (
          <div className="mt-6 border-t pt-4">

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setPendingRating(s)}
                >
                  {s <= pendingRating ? "⭐" : "☆"}
                </button>
              ))}
            </div>

            <textarea
              value={pendingComment}
              onChange={(e) => setPendingComment(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2">
              <button onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>

              <button
                onClick={submitReview}
                disabled={!pendingRating || !pendingComment}
                className="bg-black text-white px-4 py-1 rounded"
              >
                Submit
              </button>
            </div>

          </div>
        ) : (
          <button
            onClick={() => setShowReviewForm(true)}
            className="mt-6 w-full border border-dashed py-3 rounded"
          >
            + Write a review
          </button>
        )}

      </>
    );
  })()}
</Tabs.Content>

    {/* CONTACT */}
        <Tabs.Content
      value="contact"
      forceMount
      className="p-4 data-[state=inactive]:hidden"
    >
      <div className="max-w-sm">

        {/* INFO TEXT */}
        {!contactRevealed && (
          <p className="text-xs text-slate-400 mb-3">
            Contact details are hidden. Tap{" "}
            <strong className="text-slate-600 font-semibold">
              Show
            </strong>{" "}
            to reveal.
          </p>
        )}

        {/* EMAIL */}
        <ContactRow
          label="Email"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          }
          maskedValue={user.emailMasked}
          revealedValue={user.emailFull}
          revealed={contactRevealed}
          onReveal={handleRevealContact}
        />

        {/* PHONE */}
        <ContactRow
          label="Phone"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" />
            </svg>
          }
          maskedValue={user.phoneMasked}
          revealedValue={user.phoneFull}
          revealed={contactRevealed}
          onReveal={handleRevealContact}
        />

        {/* OPTIONAL: SECONDARY PHONE */}
        {user.secondaryPhone && (
          <ContactRow
            label="Mobile"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                <path d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75A3.375 3.375 0 0 0 18.75 19.875V4.125A3.375 3.375 0 0 0 15.375.75h-6.75Z" />
              </svg>
            }
            maskedValue={user.secondaryPhoneMasked}
            revealedValue={user.secondaryPhone}
            revealed={contactRevealed}
            onReveal={handleRevealContact}
          />
        )}

        {/* ACTIONS */}
       <div className="mt-5 pt-4 border-t border-slate-100">

        <MessageResponsiveDialog sellerName={user.name} />

        <p className="mt-3 text-xs text-slate-400">
          Usually replies within 24 hours
        </p>

      </div>

      </div>
    </Tabs.Content>

  </div>

</Tabs.Root>
      
      </section>

    </div>
  );
}