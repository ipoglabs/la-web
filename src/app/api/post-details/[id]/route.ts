import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Post from '@/models/post';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await connectDB();

  // Get the id from the URL
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // gets the [id] from /api/post-details/[id]

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const post = await Post.findById(id).lean();

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}
