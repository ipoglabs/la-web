import imageCompression from "browser-image-compression";
import { VARIANT_SIZES, type ImageVariant } from "./variants";

export async function uploadFileToR2(file: File, title?: string): Promise<string> {
  const uuid = crypto.randomUUID();
  const entries = Object.entries(VARIANT_SIZES) as [ImageVariant, number][];

  let largeUrl = "";

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
      formData.append("uuid", uuid);
      if (title) formData.append("title", title);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (${res.status})`);
      }

      if (variant === "large") {
        const { publicUrl } = await res.json();
        largeUrl = publicUrl;
      }
    })
  );

  return largeUrl;
}
