import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Review from "@/models/review";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await connectDB();

  const reviews = await Review.find({ userId: params.userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  });
}