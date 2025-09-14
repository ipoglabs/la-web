'use client';

import { usePostFormStore } from '../store/postFormStore';
import { useRouter } from 'next/navigation';
import LocationPickerMap from '@/app/components/LocationPickerMap';
import { Button } from '@/components/ui/button';
import AppHeader from '@/app/components/AppHeader/appHeader';
import AppFooter from '@/app/components/AppFooter/appFooter';

export default function PickLocationPage() {
  const router = useRouter();
  const location = usePostFormStore((state) => state.location);
  const setField = usePostFormStore((state) => state.setField);

  const handleNext = () => {
    if (!location?.address) return;
    router.push('/post/preview');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full space-y-6">
        <h2 className="text-2xl font-semibold">Select Location</h2>

        <div className="w-full h-[60vh] md:h-[75vh] rounded-lg overflow-hidden shadow-md">
          <LocationPickerMap
            onLocationSelect={(loc) => setField('location', loc)}
          />
        </div>

        {location?.address && (
          <p className="text-gray-700">
            Selected: <span className="font-medium">{location.address}</span>
          </p>
        )}

        <Button onClick={handleNext} disabled={!location?.address}>
          Next
        </Button>
      </main>

      <AppFooter />
    </div>
  );
}
