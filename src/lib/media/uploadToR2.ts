import imageCompression from "browser-image-compression";
import { VARIANT_SIZES, type ImageVariant } from "./variants";

export async function uploadFileToR2(file: File, postId: string): Promise<string> {
  // One timestamp shared across all 4 variant uploads for this image.
  // This ensures all variants of the same image share an identical filename
  // and getVariantUrl() can swap the folder name to navigate between them.
  const timestamp = Date.now();
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
      formData.append("timestamp", String(timestamp));

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (${res.status})`);
      }

      // Store the extra-large URL as the canonical reference in post.images[].
      // Smaller variants are derived via getVariantUrl() wherever needed.
      if (variant === "extra-large") {
        const { publicUrl } = await res.json();
        extraLargeUrl = publicUrl;
      }
    })
  );

  return extraLargeUrl;
}
