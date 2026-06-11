"use client";

import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: "image/jpeg" as const,
};

export async function processImage(file: File): Promise<File> {
  let processed = file;

  // Convert HEIC/HEIF (default iPhone camera format) to JPEG
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.85,
    });
    const blob = Array.isArray(converted) ? converted[0]! : converted;
    const newName = file.name
      .replace(/\.heic$/i, ".jpg")
      .replace(/\.heif$/i, ".jpg");
    processed = new File([blob], newName, { type: "image/jpeg" });
  }

  // Compress: reduce size and dimensions
  const compressed = await imageCompression(processed, COMPRESSION_OPTIONS);

  return new File([compressed], processed.name, {
    type: compressed.type || "image/jpeg",
  });
}
