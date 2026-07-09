"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";

import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";

import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

const IMAGE_LIMITS: Record<string, number> = {
  property: 15,
  vehicles: 10,
  jobs: 3,
  services: 5,
  pets: 8,
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif"]);

function isImageFile(file: File): boolean {
  if (ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) return true;
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export default function UploadPhotoPage() {
  useWizardGuard("upload-photo");

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const images = usePostFormStore((s) => s.images);
  const addFiles = usePostFormStore((s) => s.addFiles);
  const removeImage = usePostFormStore((s) => s.removeImage);
  const category = usePostFormStore((s) => s.category);

  const maxImages = IMAGE_LIMITS[category?.toLowerCase()] ?? 10;
  const canAddMore = (images?.length || 0) < maxImages;

  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = (images || []).map((i) => (i instanceof File ? URL.createObjectURL(i) : i));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((u, idx) => {
        if (images?.[idx] instanceof File) URL.revokeObjectURL(u);
      });
    };
  }, [images]);

  const hasAtLeastOne = useMemo(() => Array.isArray(images) && images.length > 0, [images]);
  const isNextDisabled = !hasAtLeastOne || processing;

  function filterAndWarn(files: File[]): File[] {
    const valid: File[] = [];
    const rejected: string[] = [];

    for (const f of files) {
      if (isImageFile(f)) {
        valid.push(f);
      } else {
        rejected.push(f.name);
      }
    }

    if (rejected.length > 0) {
      setTypeError(
        rejected.length === 1
          ? `"${rejected[0]}" is not an allowed image format.`
          : `${rejected.length} files were skipped — only images are allowed.`
      );
    } else {
      setTypeError(null);
    }

    return valid;
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const remaining = maxImages - (images?.length || 0);
    if (remaining <= 0) {
      alert(`Maximum ${maxImages} photos allowed for this category.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const valid = filterAndWarn(Array.from(files));
    if (!valid.length) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const limited = valid.slice(0, remaining);
    setProcessing(true);
    try {
      await addFiles(limited);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;

    const remaining = maxImages - (images?.length || 0);
    if (remaining <= 0) return;

    const valid = filterAndWarn(Array.from(e.dataTransfer.files));
    if (!valid.length) return;

    const limited = valid.slice(0, remaining);
    setProcessing(true);
    try {
      await addFiles(limited);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <PageHeader title="Upload Photos" description="Add photos to make your advertisement stand out." />

        <div className="w-full max-w-xl mt-6">

          {/* Allowed formats info */}
          <div className="flex items-start gap-2 mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
            <span>
              <span className="font-medium">Allowed formats: </span>
              JPG, PNG, WebP, GIF, HEIC / HEIF (iPhone photos).
              Videos, documents, and other file types are not accepted.
            </span>
          </div>

          {/* Processing indicator */}
          {processing && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing photos… please wait
            </div>
          )}

          {/* Invalid file type error */}
          {typeError && (
            <div className="flex items-center gap-2 mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <X size={15} className="shrink-0" />
              {typeError} Only JPG, PNG, WebP, GIF, and HEIC files are allowed.
            </div>
          )}

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg px-8 py-6 flex flex-col items-center justify-center bg-white transition ${
              isDragging ? "border-gray-500 bg-gray-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          >
            <p className="text-gray-500 mb-2 text-center">
              Drag &amp; drop photos here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mb-2">
              {images?.length || 0} / {maxImages} photos
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,.heic,.heif"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
            <Button
              type="button"
              className="mt-2"
              disabled={!canAddMore || processing}
              onClick={() => inputRef.current?.click()}
            >
              {processing ? "Processing…" : canAddMore ? "Browse Files" : `Limit reached (${maxImages})`}
            </Button>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Image ${index + 1}`} className="h-28 w-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <PostFooter
            step="upload-photo"
            showBack
            showNext
            showSubmit={false}
            isNextDisabled={isNextDisabled}
            onBack={() => router.push("/post/details")}
            onNext={() => router.push("/post/pick-location")}
          />
        </div>
      </main>
    </>
  );
}
