"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import PostHeader from "../components/PostHeader";
import PageHeader from "../components/PageHeader";
import PostFooter from "../components/PostFooter";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

export default function UploadPhotoPage() {
  useWizardGuard("upload-photo");

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const images = usePostFormStore((s) => s.images);
  const addFiles = usePostFormStore((s) => s.addFiles);
  const removeImage = usePostFormStore((s) => s.removeImage);

  const [isDragging, setIsDragging] = useState(false);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // build previews + revoke
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) await addFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) await addFiles(e.dataTransfer.files);
  };

  return (
    <>
      <PostHeader />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <PageHeader title="Upload Photos" description="Add photos to make your advertisement stand out." />

        <div className="w-full max-w-xl mt-6">
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
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
            <Button type="button" className="mt-2" onClick={() => inputRef.current?.click()}>
              Browse Files
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
            isNextDisabled={!hasAtLeastOne}
            onBack={() => router.push("/post/details")}
            onNext={() => router.push("/post/pick-location")}
          />
        </div>
      </main>
    </>
  );
}
