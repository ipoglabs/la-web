"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PostHeader from "../components/PostHeader";
import AppFooter from "@/app/components/AppFooter/appFooter";
import PostFooter from "../components/PostFooter";
import SectionHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePostFormStore } from "../store/postFormStore";
import { useRouter } from "next/navigation";

export default function UploadPhotos() {
  const router = useRouter();
  const { images, setField } = usePostFormStore();
  const [localImages, setLocalImages] = useState<(File | string)[]>(images || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const urls = localImages.map((i) => (i instanceof File ? URL.createObjectURL(i) : i));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url, idx) => {
        if (localImages[idx] instanceof File) URL.revokeObjectURL(url);
      });
    };
  }, [localImages]);

  const hasAtLeastOne = localImages.length > 0;

  const addFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files || []);
    if (!newFiles.length) return;
    const updated = [...localImages, ...newFiles];
    setLocalImages(updated);
    setField("images", updated);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files || []);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = (index: number) => {
    const updated = [...localImages];
    updated.splice(index, 1);
    setLocalImages(updated);
    setField("images", updated);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  // optional: ensure Next goes to /post/preview from this page
  const STEPS = ["select-category", "details", "pick-location", "upload-photo", "preview"];

  return (
    <>
      <PostHeader /> 
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <SectionHeader title="Upload Photos" description="Add photos to make your advertisement stand out." />

        <div className="w-full max-w-xl">
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
            <svg className="w-8 h-8 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10V6a4 4 0 10-8 0v4M12 16v-4m0 0l-3 3m3-3l3 3" />
            </svg>
            <p className="text-gray-500 mb-2 text-center">Drag &amp; drop photos here, or click to browse</p>
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleInputChange} className="hidden" />
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
                    onClick={() => handleDelete(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-xl mt-12">
          <PostFooter
  showBack
  showNext
  showSubmit={false}
  basePath="/post"
  steps={["select-category", "details", "upload-photo", "pick-location", "preview"]}
  isNextDisabled={!hasAtLeastOne}
/>

        </div>
      </main>
      <AppFooter />
    </>
  );
}
