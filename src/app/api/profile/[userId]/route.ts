import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/user";
import Post from "@/models/post";
import Review from "@/models/review";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    /* ================= USER ================= */
    const user = await User.findOne({
      userId,
      isDeleted: { $ne: true },
    }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* ================= POSTS + REVIEWS (parallel) ================= */
    const [posts, reviews] = await Promise.all([
      Post.find({
        ownerId: user._id,
        status: { $in: ["active", "expired"] },
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),

      Review.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    /* ================= MASK DATA ================= */
    const maskedEmail = user.email
      ? user.email.replace(/(.{2}).+(@.+)/, "$1***$2")
      : "";

    const maskedPhone = user.primaryNumber
      ? user.primaryNumber.replace(/\d(?=\d{2})/g, "*")
      : "";

    /* ================= RATING ================= */
    const totalReviews = reviews.length;

    const avgRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      user: {
        userId: user.userId,
        name: user.fullName || "",
        role: user.roleTitle || user.role,

        location:
          user.address?.city ||
          user.locality ||
          user.address?.country ||
          "",

        /* ✅ MASKED (DEFAULT VIEW) */
        emailMasked: maskedEmail,
        phoneMasked: maskedPhone,

        /* ✅ FULL (FOR TOGGLE) */
        emailFull: user.email || "",
        phoneFull: user.primaryNumber || "",

        avatar: user.image || "",
        cover: "",

        createdAt: user.createdAt,

        activeListings: posts.filter(p => p.status === "active").length,

        /* ⭐ NEW */
        avgRating,
        totalReviews,
      },

      listings: posts.map(p => ({
        id: p._id.toString(),
        title: p.name,
        image: p.images?.[0] || "",
        status: p.status,
        category: p.category || "",
        subcategory: p.subcategory || "",
        createdAt: p.createdAt,
      })),

      /* ✅ REVIEWS FIXED */
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        name: r.name || "Anonymous",
        rating: r.rating || 0,
        comment: r.comment || "",
        createdAt: r.createdAt,
      })),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}