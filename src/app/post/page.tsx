// src/app/post/upload-photo/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { usePostFormStore } from '../post/store/postFormStore';
import { Button } from '@/components/ui/button';
import AppHeader from '@/app/components/AppHeader/appHeader';
import AppFooter from '@/app/components/AppFooter/appFooter';
import { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

export default function UploadPhotoPage() {
  const router = useRouter();
  const images = usePostFormStore((s) => s.images);
  const addImages = usePostFormStore((s) => s.addImages);
  const removeImageAt = usePostFormStore((s) => s.removeImageAt);

  const previews = useMemo(() => {
    return images.map((item) => (item instanceof File ? URL.createObjectURL(item) : item));
  }, [images]);

  useEffect(() => {
    // cleanup object URLs
    return () => {
      previews.forEach((url, i) => {
        if (images[i] instanceof File) URL.revokeObjectURL(url);
      });
    };
  }, [previews, images]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImages(Array.from(e.target.files || []));
  };

  const handleNext = () => {
    if (images.length === 0) {
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

        <input type="file" multiple accept="image/*" onChange={handleChange} className="w-full border p-2" />

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Image ${index + 1}`} className="h-28 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImageAt(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleNext} className="mt-6">Next</Button>
      </div>
      <AppFooter />
    </>
  );
}
