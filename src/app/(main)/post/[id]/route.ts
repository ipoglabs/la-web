// src/app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Post from "@/models/post";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post id" },
        { status: 400 }
      );
    }

    const post = await Post.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/posts/[id] error:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
