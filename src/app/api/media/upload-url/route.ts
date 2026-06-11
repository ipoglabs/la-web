import { NextRequest } from "next/server";
import { r2 } from "@/config/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, mimeType, size } = await req.json();

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return Response.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (size > MAX_SIZE_BYTES) {
    return Response.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  const ext = mimeType.split("/")[1] || "jpg";
  const key = `posts/${session.userId}/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: mimeType,
    // ContentLength intentionally omitted: including it adds content-length to
    // signed headers, which breaks CORS preflight for browser-direct uploads.
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return Response.json({ uploadUrl, publicUrl });
}
