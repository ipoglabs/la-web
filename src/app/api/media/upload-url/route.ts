import { NextRequest } from "next/server";
import { r2 } from "@/config/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const VALID_POST_ID = /^[a-f0-9]{24}$|^draft$/;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, variant = "large", mimeType, size } = await req.json();

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return Response.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (size > MAX_SIZE_BYTES) {
    return Response.json({ error: "File too large. Max 10 MB." }, { status: 400 });
  }

  const rawPostId = postId || "draft";
  if (!VALID_POST_ID.test(rawPostId)) {
    return Response.json({ error: "Invalid postId." }, { status: 400 });
  }

  const timestamp = Date.now();
  const userId = session.userId;

  // Mirror the same key structure as /api/media/upload
  const key = `${userId}/post-images/${rawPostId}/${variant}/${rawPostId}_${timestamp}.jpg`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return Response.json({ uploadUrl, publicUrl });
}
