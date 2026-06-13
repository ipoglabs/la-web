import { r2 } from "@/config/r2";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { VARIANT_NAMES, VARIANT_SIZES } from "./variants";

export type { ImageVariant } from "./variants";
export { VARIANT_SIZES };

/** Replace any variant segment in the URL with the requested one. */
export function getVariantUrl(imageUrl: string, variant: ImageVariant): string {
  return imageUrl.replace(
    /\/(thumbnail|small|medium|large)\//,
    `/${variant}/`
  );
}

/** Returns all 4 variant URLs derived from any variant URL of the same image. */
export function getAllVariantUrls(imageUrl: string): Record<ImageVariant, string> {
  return Object.fromEntries(
    VARIANT_NAMES.map((v) => [v, getVariantUrl(imageUrl, v)])
  ) as Record<ImageVariant, string>;
}

/** Convert a public R2 URL to a bucket object key. Returns null for unrecognised URLs. */
function urlToKey(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL;
  if (!base || !url.startsWith(base + "/")) return null;
  return url.slice(base.length + 1);
}

/**
 * Delete all 4 size variants of one or more images from R2 in a single batch call.
 * Silently skips URLs that do not match the R2 public URL base.
 */
export async function deleteImageVariants(imageUrls: string[]): Promise<void> {
  if (!imageUrls.length) return;

  const objects: { Key: string }[] = [];

  for (const url of imageUrls) {
    for (const variant of VARIANT_NAMES) {
      const key = urlToKey(getVariantUrl(url, variant));
      if (key) objects.push({ Key: key });
    }
  }

  if (!objects.length) return;

  try {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Delete: { Objects: objects, Quiet: true },
      })
    );
  } catch (err) {
    console.error("R2 batch delete error:", err);
  }
}
