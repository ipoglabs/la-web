import imageCompression from "browser-image-compression";
import { VARIANT_SIZES, type ImageVariant } from "./variants";

/**
 * Upload one image file to R2 in all 4 size variants.
 *
 * @param file   - The File to upload (already pre-processed/compressed by processImage)
 * @param postId - Pre-generated MongoDB ObjectId hex string for this post
 * @param index  - 1-based position of this image within the post (1, 2, 3 …)
 *                 Becomes the zero-padded 3-digit suffix: 1 → "001", 12 → "012"
 *
 * Returns the extra-large variant public URL, which is stored in post.images[].
 * All other variants are derived from it via getVariantUrl().
 */
export async function uploadFileToR2(
  file: File,
  postId: string,
  index: number
): Promise<string> {
  const seq = String(index).padStart(3, "0"); // e.g. 1 → "001"
  const entries = Object.entries(VARIANT_SIZES) as [ImageVariant, number][];

  let extraLargeUrl = "";

  await Promise.all(
    entries.map(async ([variant, maxWidthOrHeight]) => {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.85,
      });

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("variant", variant);
      formData.append("postId", postId);
      formData.append("seq", seq);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (${res.status})`);
      }

      // extra-large is the canonical URL stored in post.images[].
      // Smaller variants are derived via getVariantUrl() wherever needed.
      if (variant === "extra-large") {
        const { publicUrl } = await res.json();
        extraLargeUrl = publicUrl;
      }
    })
  );

  return extraLargeUrl;
}
