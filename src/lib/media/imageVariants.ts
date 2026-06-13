import { r2 } from "@/config/r2";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { VARIANT_NAMES } from "./variants";

export type { ImageVariant } from "./variants";
export { VARIANT_SIZES } from "./variants";

// Matches all current and legacy variant folder names
const VARIANT_SEGMENT = /\/(thumbnail|small|medium|large|extra-large)\//;

/** Replace any variant segment in the URL with the requested variant. */
export function getVariantUrl(imageUrl: string, variant: string): string {
  return imageUrl.replace(VARIANT_SEGMENT, `/${variant}/`);
}

/** Returns all current variant URLs derived from any variant URL of the same image. */
export function getAllVariantUrls(imageUrl: string): Record<string, string> {
  return Object.fromEntries(
    VARIANT_NAMES.map((v) => [v, getVariantUrl(imageUrl, v)])
  );
}

/** Convert a public R2 URL to a bucket object key. Returns null for unrecognised URLs. */
function urlToKey(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL;
  if (!base || !url.startsWith(base + "/")) return null;
  return url.slice(base.length + 1);
}

/**
 * Delete all size variants of one or more images from R2 in a single batch call.
 *
 * Handles both:
 *   - New format: {userId}/post-images/{postId}/{variant}/{postId}_{ts}.jpg
 *     → deletes small, medium, large, extra-large
 *   - Old format: Post-Image/{slug}/{variant}/{uuid}.jpg
 *     → deletes thumbnail, small, medium, large
 *
 * Silently skips URLs that do not match the R2 public URL base.
 */
export async function deleteImageVariants(imageUrls: string[]): Promise<void> {
  if (!imageUrls.length) return;

  const objects: { Key: string }[] = [];

  for (const url of imageUrls) {
    // Determine which variant set applies by inspecting the URL
    const isLegacy = url.includes("/Post-Image/");
    const variantsToDelete = isLegacy
      ? ["thumbnail", "small", "medium", "large"]
      : ["small", "medium", "large", "extra-large"];

    for (const variant of variantsToDelete) {
      const variantUrl = getVariantUrl(url, variant);
      const key = urlToKey(variantUrl);
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
