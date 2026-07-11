"use client";

import { useState, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import MessageResponsiveDialog from "@/components/responsive-dialog/MessageDrawer";
import ProfileListingCard from "./ProfileListingCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const LISTINGS = Array.from({ length: 11 }).map((_, i) => ({
  id: String(i + 1),
  title:
    "Beautiful 5 Bed Room Villa Home in the Dartford countryside, 3 mins walk to station.",
  price: i % 4 === 0 ? null : "$4,500",
  category: (["Apartment", "House", "Villa", "Studio"] as const)[i % 4],
  location: "Dartford, Kent",
  postedAt: (["2d ago", "5d ago", "1w ago", "3w ago"] as const)[i % 4],
  status: (i % 4 === 0 ? "closed" : "active") as "active" | "closed",
  image: "/assets/img/img6.jpg",
}));

const REVIEWS = [
  {
    id: "1",
    name: "Marcus T.",
    rating: 5,
    date: "Mar 2026",
    comment:
      "Jannet was incredibly helpful throughout the whole process. Found us exactly what we were looking for within a week.",
  },
  {
    id: "2",
    name: "Priya S.",
    rating: 4,
    date: "Feb 2026",
    comment:
      "Very responsive and knowledgeable. Would highly recommend for anyone looking in the Kent area.",
  },
  {
    id: "3",
    name: "Oliver B.",
    rating: 5,
    date: "Jan 2026",
    comment:
      "Professional, to the point, and no time-wasting. Exactly what you want in an agent.",
  },
  {
    id: "4",
    name: "Sarah K.",
    rating: 3,
    date: "Dec 2025",
    comment:
      "Good overall experience. Communication could be a bit faster but solid knowledge of listings.",
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "size-4" : "size-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={s <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={`${cls} ${s <= rating ? "text-amber-400" : "text-slate-300"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.601a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </div>
  );
}

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
  maskedValue: string;
  revealedValue: string;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-slate-100 last:border-0">
      <div className="shrink-0 size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </div>
        <div className="text-sm text-slate-800 font-medium tabular-nums mt-0.5">
          {revealed ? revealedValue : maskedValue}
        </div>
      </div>
      {revealed ? (
        <a
          href={label === "Email" ? `mailto:${revealedValue}` : `tel:${revealedValue}`}
          className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          {label === "Email" ? "Send email" : "Call"}
        </a>
      ) : (
        <button
          onClick={onReveal}
          className="shrink-0 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:border-slate-400 hover:text-slate-800 transition-colors"
        >
          Show
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const isOnline = true;

  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [contactRevealed, setContactRevealed] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [pendingComment, setPendingComment] = useState("");
  const [reviewVotes, setReviewVotes] = useState<Record<string, "up" | "down" | null>>({});

  const handleVote = (id: string, dir: "up" | "down") => {
    setReviewVotes((prev) => ({ ...prev, [id]: prev[id] === dir ? null : dir }));
  };

  const filtered =
    filter === "all" ? LISTINGS : LISTINGS.filter((l) => l.status === filter);

  const avgRating = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: REVIEWS.filter((r) => r.rating === s).length,
  }));

  const handleRevealContact = () => {
    // TODO: replace with API call to fetch full contact details
    setContactRevealed(true);
  };

  return (
    <>
      <header className="shadow-md">
        <div className="bg-white min-h-7" />
        <div className="bg-slate-800 min-h-5" />
      </header>

      <main className="max-w-7xl mx-auto sm:px-6 md:px-10 lg:px-16 flex flex-col gap-y-4 py-6">

        {/* ── Profile Card ── */}
        <section className="w-full bg-white px-4 pt-5 pb-4 border-y border-slate-900/20 sm:rounded-xl sm:border sm:shadow-sm">

          {/* Avatar + Core Info */}
          <div className="flex gap-3 items-start">
            <div className="relative shrink-0 size-16 sm:size-20">
              <div className="size-full rounded-full overflow-hidden border-2 border-slate-200">
                <img
                  className="w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max"
                  alt="Jannet Willson"
                />
              </div>
              <span className={`absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
            </div>

            {/* Info + desktop stats side by side */}
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {/* Text info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    Jannet Willson
                  </h1>
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
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  Property Agent · Dartford, Kent
                </p>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  &ldquo;Specializes in premium property listings&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <StarRating rating={4} size="md" />
                  <span className="text-sm font-bold text-slate-700">4.3</span>
                  <span className="text-sm text-slate-400">({REVIEWS.length} reviews)</span>
                </div>
              </div>

              {/* Stats — desktop: right of info; mobile: hidden here */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-3 shrink-0 self-stretch border-l border-slate-100 pl-6">
                <div className="flex items-center gap-5">
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900">37</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Listings</div>
                  </div>
                  <div className="w-px h-7 bg-slate-100" />
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900">1.9K</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Likes</div>
                  </div>
                  <div className="w-px h-7 bg-slate-100" />
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-900">0.8K</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row — mobile only */}
          <div className="sm:hidden mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div className="py-1">
              <div className="text-base font-bold text-slate-900">37</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Listings</div>
            </div>
            <div className="py-1">
              <div className="text-base font-bold text-slate-900">1.9K</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Likes</div>
            </div>
            <div className="py-1">
              <div className="text-base font-bold text-slate-900">0.8K</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">Followers</div>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap gap-x-2 text-xs text-slate-400">
            <span>Member since 2021</span>
            <span>·</span>
            <span>Active 2d ago</span>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section className="w-full bg-white border-y sm:border border-slate-900/10 sm:rounded-xl sm:shadow-sm overflow-hidden">
          <Tabs.Root defaultValue="listing">

            {/* Tab list */}
            <Tabs.List
              className="flex border-b border-slate-200 overflow-x-auto"
              aria-label="Profile tabs"
            >
              {(
                [
                  { value: "listing", label: "Listings", count: 37 },
                  { value: "reviews", label: "Reviews", count: REVIEWS.length },
                  { value: "contact", label: "Contact" },
                ] as { value: string; label: string; count?: number }[]
              ).map(({ value, label, count }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="flex-1 sm:flex-none px-5 py-3 text-sm font-medium text-slate-500 border-b-2 border-transparent transition-colors data-[state=active]:text-slate-900 data-[state=active]:border-slate-900 whitespace-nowrap"
                >
                  {label}
                  {count !== undefined && (
                    <span className="ml-1.5 text-[11px] text-slate-400 font-normal">
                      {count}
                    </span>
                  )}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* ── Tab panels (min-h prevents section reflow when switching) ── */}
            <div className="min-h-96">

            {/* ── Listings tab ── */}
            <Tabs.Content value="listing" forceMount className="p-4 data-[state=inactive]:hidden">
              {/* Filter pills */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {(["all", "active", "closed"] as const).map((f) => (
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
                    {f === "all" && (
                      <span className="ml-1 text-slate-400 font-normal">
                        {LISTINGS.length}
                      </span>
                    )}
                    {f === "active" && (
                      <span className="ml-1 opacity-60 font-normal">
                        {LISTINGS.filter((l) => l.status === "active").length}
                      </span>
                    )}
                    {f === "closed" && (
                      <span className="ml-1 opacity-60 font-normal">
                        {LISTINGS.filter((l) => l.status === "closed").length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Grid — 2 cols mobile, grows on wider screens */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((item) => (
                  <ProfileListingCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-5 flex justify-center items-center gap-1.5">
                <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-600">
                  ←
                </button>
                {([1, 2, 3, "…", 18] as (number | string)[]).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === "number" && setCurrentPage(p)}
                    className={`size-8 rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage
                        ? "bg-slate-900 text-white"
                        : p === "…"
                        ? "text-slate-400 cursor-default"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-600">
                  →
                </button>
              </div>
            </Tabs.Content>

            {/* ── Reviews tab ── */}
            <Tabs.Content value="reviews" forceMount className="p-4 data-[state=inactive]:hidden">
              {/* Rating summary */}
              <div className="flex gap-5 items-start pb-5 mb-5 border-b border-slate-100">
                <div className="text-center shrink-0">
                  <div className="text-4xl font-bold text-slate-900 leading-none">
                    {avgRating}
                  </div>
                  <div className="mt-1.5">
                    <StarRating
                      rating={Math.round(parseFloat(avgRating))}
                      size="md"
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {REVIEWS.length} reviews
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingCounts.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-2.5 shrink-0">
                        {star}
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        {/* inline style required for dynamic % width */}
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${(count / REVIEWS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-3 text-right shrink-0">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-5">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <div className="shrink-0 size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">
                          {review.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-0.5 mb-1.5">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="text-[11px] text-slate-400">Helpful?</span>
                        <button
                          type="button"
                          onClick={() => handleVote(review.id, "up")}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                            reviewVotes[review.id] === "up"
                              ? "bg-emerald-50 text-emerald-600"
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777Z" />
                          </svg>
                          <span>{reviewVotes[review.id] === "up" ? 1 : 0}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote(review.id, "down")}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                            reviewVotes[review.id] === "down"
                              ? "bg-rose-50 text-rose-500"
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                            <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23Z" />
                          </svg>
                          <span>{reviewVotes[review.id] === "down" ? 1 : 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Write a review */}
              {showReviewForm ? (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Your rating</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                        onClick={() => setPendingRating(s)}
                        className="p-0.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={s <= pendingRating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`size-7 transition-colors ${
                            s <= pendingRating
                              ? "text-amber-400"
                              : "text-slate-300 hover:text-amber-300"
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.601a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                      </button>
                    ))}
                    {pendingRating > 0 && (
                      <span className="ml-2 text-sm text-slate-500">
                        {["" , "Poor", "Fair", "Good", "Very good", "Excellent"][pendingRating]}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={pendingComment}
                    onChange={(e) => setPendingComment(e.target.value)}
                    placeholder="Share your experience with this agent…"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder:text-slate-400"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setPendingRating(0);
                        setPendingComment("");
                      }}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={pendingRating === 0 || pendingComment.trim() === ""}
                      className="px-4 py-1.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit review
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="mt-6 w-full py-3 text-sm font-medium text-slate-500 border border-dashed border-slate-300 rounded-xl hover:border-slate-500 hover:text-slate-700 transition-colors"
                >
                  + Write a review
                </button>
              )}
            </Tabs.Content>

            {/* ── Contact tab ── */}
            <Tabs.Content value="contact" forceMount className="p-4 data-[state=inactive]:hidden">
              <div className="max-w-sm">
                {!contactRevealed && (
                  <p className="text-xs text-slate-400 mb-3">
                    Contact details are hidden. Tap{" "}
                    <strong className="text-slate-600 font-semibold">
                      Show
                    </strong>{" "}
                    to reveal.
                  </p>
                )}
                <ContactRow
                  label="Email"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  }
                  maskedValue="w••••••@gmail.com"
                  revealedValue="wrjwillson@gmail.com"
                  revealed={contactRevealed}
                  onReveal={handleRevealContact}
                />
                <ContactRow
                  label="Phone"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                    </svg>
                  }
                  maskedValue="+65 •••• •••84"
                  revealedValue="+65 9103 1184"
                  revealed={contactRevealed}
                  onReveal={handleRevealContact}
                />
                <ContactRow
                  label="Mobile"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                      <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                      <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clipRule="evenodd" />
                    </svg>
                  }
                  maskedValue="+65 •••• •••34"
                  revealedValue="+65 8821 4534"
                  revealed={contactRevealed}
                  onReveal={handleRevealContact}
                />
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <MessageResponsiveDialog sellerName="Jannet Willson" />
                  <p className="mt-3 text-xs text-slate-400">
                    Usually replies within 24 hours · English
                  </p>
                </div>
              </div>
            </Tabs.Content>

            </div>{/* end min-h wrapper */}

          </Tabs.Root>
        </section>
      </main>

      <footer className="bg-slate-800 border-t-4 border-rose-500 min-h-40" />
    </>
  );
}
