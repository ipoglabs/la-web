import { NextRequest } from "next/server";
import { r2 } from "@/config/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";
import type { ImageVariant } from "@/lib/media/variants";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function slugify(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "untitled"
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized — please log in again." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e: any) {
    return Response.json({ error: `Failed to parse upload: ${e?.message}` }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null) || "untitled";
  const variant = ((formData.get("variant") as string | null) || "large") as ImageVariant;
  const uuid = (formData.get("uuid") as string | null) || randomUUID();

  if (!file || file.size === 0) {
    return Response.json({ error: "No file provided or file is empty." }, { status: 400 });
  }

  const mimeType = (file.type || "image/jpeg").toLowerCase();

  if (!ALLOWED_TYPES.has(mimeType)) {
    return Response.json(
      { error: `File type "${mimeType}" is not allowed. Accepted: JPEG, PNG, WebP, GIF.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: "File too large. Max 10 MB." }, { status: 400 });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (e: any) {
    return Response.json({ error: `Could not read file data: ${e?.message}` }, { status: 400 });
  }

  if (buffer.length === 0) {
    return Response.json({ error: "File buffer is empty." }, { status: 400 });
  }

  const folder = slugify(title);
  const key = `Post-Image/${folder}/${variant}/${uuid}.jpg`;

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
        ContentLength: buffer.length,
      })
    );
  } catch (err: any) {
    const code = err?.Code || err?.code || err?.name || "";
    const message = err?.message || String(err);

    console.error("[R2 Upload] code:", code, "| message:", message);

    if (code === "AccessDenied" || code === "Forbidden") {
      return Response.json(
        {
          error: `R2 permission denied — make sure your API token has "Object Write" access on bucket "${process.env.R2_BUCKET_NAME}".`,
        },
        { status: 403 }
      );
    }

    if (code === "NoSuchBucket") {
      return Response.json(
        {
          error: `R2 bucket "${process.env.R2_BUCKET_NAME}" not found — create it in the Cloudflare dashboard.`,
        },
        { status: 404 }
      );
    }

    return Response.json({ error: `Upload failed: ${message}` }, { status: 502 });
  }

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return Response.json({ publicUrl });
}
