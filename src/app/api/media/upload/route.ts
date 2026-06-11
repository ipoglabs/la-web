import { NextRequest } from "next/server";
import sharp from "sharp";
import { r2 } from "@/config/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";
import { VARIANT_SIZES, type ImageVariant } from "@/lib/media/imageVariants";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const VARIANTS = (Object.entries(VARIANT_SIZES) as [ImageVariant, number][]).map(
  ([name, size]) => ({ name, size })
);

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
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null) || "untitled";

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: `File type not allowed: ${file.type}` }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: "File too large. Max 10 MB." }, { status: 400 });
  }

  const uuid = randomUUID();
  const folder = slugify(title);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await Promise.all(
      VARIANTS.map(async ({ name, size }) => {
        const resized = await sharp(buffer)
          .resize(size, size, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();

        const key = `Post-Image/${folder}/${name}/${uuid}.jpg`;

        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: resized,
            ContentType: "image/jpeg",
            ContentLength: resized.length,
          })
        );
      })
    );
  } catch (err: any) {
    const code = err?.Code || err?.code || "";
    if (code === "AccessDenied") {
      console.error("R2 AccessDenied — API token lacks Object Write permission.");
      return Response.json(
        { error: "Storage not configured: API token lacks write permission on the R2 bucket." },
        { status: 403 }
      );
    }
    console.error("R2 upload error:", err);
    return Response.json({ error: "File storage error. Please try again." }, { status: 502 });
  }

  const publicUrl = `${process.env.R2_PUBLIC_URL}/Post-Image/${folder}/large/${uuid}.jpg`;
  return Response.json({ publicUrl });
}
