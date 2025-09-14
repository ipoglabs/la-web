'use client';

import { useRouter } from 'next/navigation';
import { usePostFormStore } from '../store/postFormStore';
import { Button } from '@/components/ui/button';
import AppHeader from '@/app/components/AppHeader/appHeader';
import AppFooter from '@/app/components/AppFooter/appFooter';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function UploadPhotoPage() {
  const { images, setField } = usePostFormStore();
  const router = useRouter();

  // Can be File[] or string[] (already uploaded URLs)
  const [localImages, setLocalImages] = useState<(File | string)[]>(images || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Generate preview URLs for both File and string
  useEffect(() => {
    const urls = localImages.map((item) => {
      if (item instanceof File) {
        return URL.createObjectURL(item);
      }
      return item; // already a URL string
    });

    setPreviewUrls(urls);

    // Cleanup object URLs created from File objects
    return () => {
      urls.forEach((url, index) => {
        if (localImages[index] instanceof File) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [localImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updated = [...localImages, ...newFiles];
    setLocalImages(updated);
    setField('images', updated); // Save in store
  };

  const handleDelete = (index: number) => {
    const updatedFiles = [...localImages];
    updatedFiles.splice(index, 1);
    setLocalImages(updatedFiles);
    setField('images', updatedFiles); // Save in store
  };

  const handleNext = () => {
    if (localImages.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    router.push('/post/pick-location');
  };

  return (
    <>
      <AppHeader />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Upload Photos</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2"
        />

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-28 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleNext} className="mt-6">
          Next
        </Button>
      </div>
      <AppFooter />
    </>
  );
}
