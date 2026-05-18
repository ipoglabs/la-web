import PublicProfile from "../components/PublicProfile";
import { notFound } from "next/navigation";
import connectDB from "@/config/database";
import User from "@/models/user";
import Post from "@/models/post";
import Review from "@/models/review";

export default async function Page({
  params,
}: {
  params: { userId: string };
}) {
  await connectDB();

  /* ================= USER ================= */
  const userData: any = await User.findOne({
    userId: params.userId,
    isDeleted: { $ne: true },
  }).lean();

  if (!userData) {
    notFound();
  }

  /* ================= POSTS ================= */
  const posts: any = await Post.find({
    ownerId: userData._id,
    status: { $in: ["active", "expired"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  /* ================= REVIEWS ================= */
  const reviews: any = await Review.find({
    userId: userData.userId,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  /* ================= SERIALIZE ================= */
  const safeUser = JSON.parse(JSON.stringify(userData));
  const safePosts = JSON.parse(JSON.stringify(posts));
  const safeReviews = JSON.parse(JSON.stringify(reviews));

  /* ================= RATING CALC ================= */
  const totalReviews = safeReviews.length;

  const avgRating =
    totalReviews > 0
      ? (
          safeReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  /* ================= BUILD RESPONSE ================= */
  const user = {
    userId: safeUser.userId,
    name: safeUser.fullName || "",
    role: safeUser.roleTitle || safeUser.role,

    location:
      safeUser.address?.city ||
      safeUser.locality ||
      safeUser.address?.country ||
      "",

    emailMasked: safeUser.email?.replace(/(.{2}).+(@.+)/, "$1***$2") || "",
    phoneMasked: safeUser.primaryNumber?.replace(/\d(?=\d{2})/g, "*") || "",

      emailFull: safeUser.email || "",
      phoneFull: safeUser.primaryNumber || "",

    avatar: safeUser.image || "",
    cover: "",

    createdAt: safeUser.createdAt,

    /* ================= STATS ================= */
    activeListings: safePosts.filter((p: any) => p.status === "active").length,

    totalReviews,
    avgRating, // ⭐ NEW

    /* ================= LISTINGS ================= */
    listings: safePosts.map((p: any) => ({
      id: p._id.toString(),
      title: p.name,
      image: p.images?.[0] || "",
      category: p.category || "",
      subcategory: p.subcategory || "",
      status: p.status,
      createdAt: p.createdAt,
    })),

    /* ================= REVIEWS ================= */
    reviews: safeReviews.map((r: any) => ({
      id: r._id.toString(),
      name: r.name || "Anonymous",
      rating: r.rating || 0,
      comment: r.comment || "",
      createdAt: r.createdAt,
    })),
  };

  return <PublicProfile user={user} />;
}