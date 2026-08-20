import imageCompression from "browser-image-compression";

/**
 * Compress and upload a profile picture to R2, returning a cache-busted
 * public URL (the object key is fixed per user, so re-uploads overwrite the
 * same file — the query param forces the browser/CDN to fetch the new one).
 */
export async function uploadAvatarToR2(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.85,
  });

  const formData = new FormData();
  formData.append("file", compressed);

  const res = await fetch("/api/media/upload-avatar", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed (${res.status})`);
  }

  const { publicUrl } = await res.json();
  return `${publicUrl}?v=${Date.now()}`;
}
