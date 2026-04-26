"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

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
import { useMediaQuery } from "@/hooks/use-media-query";

export default function PublicProfile({ user }: any) {
  const [openMessage, setOpenMessage] = useState(false);

  // ✅ REVIEW STATES (MUST BE INSIDE COMPONENT)
  const [openReview, setOpenReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showContact, setShowContact] = useState(false);

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
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit review");
    }

    // ✅ Close modal
    setOpenReview(false);

    // ✅ Reset form
    setRating(0);
    setComment("");

    // ✅ Refresh (simple way)
    location.reload();

  } catch (err) {
    console.error("Review submit failed:", err);
    alert("Something went wrong while submitting review");
  }
}

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">

      {/* ================= PROFILE HEADER ================= */}
      <section className="bg-white border border-slate-900/25 rounded-md shadow-md overflow-hidden">

        {/* COVER */}
        <div className="bg-slate-500 h-32">
          <img
            src={
              user.cover ||
              "https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
            }
            className="object-cover w-full h-full"
          />
        </div>

       {/* CONTENT */}
        <div className="px-4 pt-3 text-center">

        {/* AVATAR */}
        <div className="mx-auto w-28 h-28 -mt-20 border-4 border-white rounded-full overflow-hidden">
            <img
            src={
                user.avatar ||
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
            }
            className="object-cover w-full h-full"
            />
        </div>

        {/* NAME */}
        <h3 className="font-bold text-xl text-gray-800 mt-3">
            {user.name}
        </h3>

        {/* PROFILE ID (INLINE STYLE - CLEAN) */}
        <div className="text-xs text-slate-500 mt-1">
            Public ID: <span className="font-medium text-slate-700">{user.userId}</span>
        </div>

        {/* ROLE + LOCATION */}
        <p className="text-sm text-slate-600 mt-2">
            {user.role} • 📍 {user.location || "Unknown"}
        </p>

        {/* TAGLINE */}
        <p className="italic text-sm text-slate-700 mt-1">
            {user.tagline || "Trusted seller"}
        </p>

        {/* VERIFIED */}
        <div className="mt-2 inline-flex bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
            ✔ Verified Seller
        </div>

        {/* RATING */}
        <div className="mt-3 flex justify-center items-center gap-1 text-yellow-500">
            ⭐⭐⭐⭐☆ 
            <span className="text-slate-600 text-sm ml-1">(4.2)</span>
        </div>

        {/* META */}
        <div className="text-xs text-slate-500 mt-2 mb-4">
            Joined{" "}
            {user.createdAt
            ? new Date(user.createdAt).getFullYear()
            : "—"}{" "}
            • {user.activeListings || 0} listings
        </div>

        </div>
      </section>

      {/* ================= TABS ================= */}
      <Tabs defaultValue="listing" className="mt-4">

        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="listing">Listings</TabsTrigger>
          <TabsTrigger value="review">Reviews</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

       {/* ================= LISTINGS ================= */}
        <TabsContent value="listing">

        {/* FILTERS */}
        <div className="flex gap-3 mt-3 mb-4 flex-wrap">

            {/* TIME FILTER */}
            <Select>
            <SelectTrigger className="w-[160px] text-sm">
                Last 30 days
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3mo">Last 3 months</SelectItem>
                <SelectItem value="6mo">Last 6 months</SelectItem>
                <SelectItem value="1yr">Last 1 year</SelectItem>
                <SelectItem value="all">All</SelectItem>
            </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select>
            <SelectTrigger className="w-[140px] text-sm">
                Active
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
            </Select>

        </div>

        {/* LIST VIEW */}
        <div className="space-y-3">

            {user.listings?.length ? (
            user.listings.map((item: any) => (
                <div
                key={item.id}
                className="flex gap-3 border rounded-md p-3 hover:shadow-md transition bg-white"
                >

                {/* IMAGE */}
                <img
                    src={item.image || "/placeholder.png"}
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />

                {/* CONTENT */}
                <div className="flex flex-col justify-between flex-1 min-w-0">

                    <div>

                    {/* CATEGORY BADGES */}
                    <div className="flex gap-2 mb-1 flex-wrap">
                        {item.category && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {item.category}
                        </span>
                        )}
                        {item.subcategory && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {item.subcategory}
                        </span>
                        )}
                    </div>

                    {/* TITLE */}
                    <div className="font-semibold text-sm text-gray-800 truncate">
                        {item.title}
                    </div>

                    {/* STATUS */}
                    <div className="text-xs text-slate-500 mt-1">
                        Status:{" "}
                        <span
                        className={
                            item.status === "active"
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }
                        >
                        {item.status}
                        </span>
                    </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">
                        {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </span>

                    <button className="text-blue-600 text-xs font-medium hover:underline">
                        View →
                    </button>
                    </div>

                </div>
                </div>
            ))
            ) : (
            <div className="text-center text-slate-500">
                No listings available
            </div>
            )}

        </div>
        </TabsContent>

        {/* ================= REVIEWS ================= */}
        <TabsContent value="review">
  <div className="mt-3 space-y-3">

    {/* REVIEW LIST */}
    {user.reviews?.length ? (
      user.reviews.map((r: any) => (
        <div key={r.id} className="border p-3 rounded-md">
          <div className="text-sm font-semibold">{r.name}</div>

          <div className="text-yellow-500 text-xs">
            {"⭐".repeat(r.rating)}
          </div>

          <p className="text-sm text-slate-600 mt-1">
            {r.comment}
          </p>
        </div>
      ))
    ) : (
      <div className="text-center text-slate-500">
        No reviews yet
      </div>
    )}

    {/* ✅ BOTTOM ACTION BUTTONS */}
    <div className="flex gap-3 pt-2">

      {/* WRITE REVIEW */}
      <button
        onClick={() => setOpenReview(true)}
        className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        ⭐ Write Review
      </button>

      {/* LOAD MORE */}
      <button className="flex-1 bg-slate-100 py-2 rounded-md text-sm font-medium hover:bg-slate-200 transition">
        Load More
      </button>

    </div>

  </div>


  {/* ================= REVIEW FORM ================= */}
 {isDesktop ? (
  <Dialog open={openReview} onOpenChange={setOpenReview}>
    <DialogContent className="p-4">

      {/* ✅ REQUIRED */}
      <DialogHeader>
        <DialogTitle>Write Review</DialogTitle>
      </DialogHeader>

      <ReviewForm
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        submitReview={submitReview}
      />
    </DialogContent>
  </Dialog>
) : (
  <Drawer open={openReview} onOpenChange={setOpenReview}>
    <DrawerContent className="p-4">

      <DrawerHeader>
        <DrawerTitle>Write Review</DrawerTitle>
      </DrawerHeader>

      <ReviewForm
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        submitReview={submitReview}
      />
    </DrawerContent>
  </Drawer>
)}
</TabsContent>

        {/* ================= CONTACT ================= */}
       <TabsContent value="contact">
        <div className="mt-3 space-y-3">

          {/* EMAIL */}
          <div className="border p-3 rounded-md text-sm">
            📧 {showContact ? user.emailFull : user.emailMasked}
          </div>

          {/* PHONE */}
          <div className="border p-3 rounded-md text-sm">
            📞 {showContact ? user.phoneFull : user.phoneMasked}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            {/* SHOW CONTACT */}
            <button
              onClick={() => setShowContact(true)}
              className="flex-1 bg-slate-100 py-2 rounded-md text-sm font-medium hover:bg-slate-200"
            >
              {showContact ? "Contact Visible" : "Show Contact"}
            </button>

            {/* SEND MESSAGE */}
            <button
              onClick={() => setOpenMessage(true)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              💬 Send Message
            </button>

          </div>

        </div>
      </TabsContent>
      </Tabs>

      {/* ================= MESSAGE DRAWER ================= */}
      <Drawer open={openMessage} onOpenChange={setOpenMessage}>
        <DrawerContent className="p-4">

          <DrawerHeader>
            <DrawerTitle>Send Message</DrawerTitle>
          </DrawerHeader>

          <input
            placeholder="Subject"
            className="w-full border p-2 rounded mb-3"
          />

          <textarea
            placeholder="Write your message..."
            className="w-full border p-2 rounded h-32 mb-3"
          />

          <button className="w-full bg-green-600 text-white py-2 rounded">
            Send
          </button>

        </DrawerContent>
      </Drawer>
    </div>
  );
}