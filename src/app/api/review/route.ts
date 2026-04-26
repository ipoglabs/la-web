import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Review from "@/models/review";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.rating) {
    return NextResponse.json({ error: "Rating required" }, { status: 400 });
  }

  const review = await Review.create({
    userId: body.userId,
    reviewerId: session.userId,
    name: session.firstName || "Anonymous",
    rating: body.rating,
    comment: body.comment || "",
  });

  return NextResponse.json({ success: true, review });
}