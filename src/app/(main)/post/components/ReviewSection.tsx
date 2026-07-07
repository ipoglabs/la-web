"use client";

import Image from "next/image";
import ReviewFields from "./ReviewFields";
import { useRouter } from "next/navigation";

interface ReviewSectionProps {
  title?: string;
  dataProvider?: Array<{
    title: string;
    value: string | string[];
    type?: "text" | "bullets";
    noWrap?: boolean;
  }>;
  imageProvider?: Array<{ imageUrl: string }>;
  routeBackTo?: string;
  isLastItem?: boolean;
  allowedToWrap?: boolean;
  mapData?: { lat: number; lng: number } | null;

  hideChange?: boolean;
  showAutoFillHint?: boolean;

  // ✅ NEW: callback from parent
  onChange?: (route: string) => void;
}

function ReviewDetailsSection({
  title,
  dataProvider,
  imageProvider,
  routeBackTo,
  isLastItem = false,
  allowedToWrap = true,
  mapData,
  hideChange = false,
  showAutoFillHint = false,
  onChange,
}: ReviewSectionProps) {
  const router = useRouter();

  const country =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "";

  const gridClass = allowedToWrap
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "flex flex-col w-full";

  const handleChange = () => {
    if (!routeBackTo) return;

    // ✅ delegate to parent if provided
    if (onChange) {
      onChange(`/${country}${routeBackTo}`);
    } else {
      window.scrollTo(0, 0);
      router.push(`/${country}${routeBackTo}`);
    }
  };

  return (
    <section className="mb-8">
      {/* Header */}
      {title && (
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-base text-gray-800">{title}</div>

          {routeBackTo && !hideChange && (
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={handleChange}
            >
              Change
            </button>
          )}
        </div>
      )}

      {/* Images */}
      {imageProvider && imageProvider.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {imageProvider.map((img, idx) => (
            <Image
              key={idx}
              src={img.imageUrl}
              alt={`Photo ${idx + 1}`}
              width={80}
              height={80}
              className="rounded border border-gray-300 object-cover"
            />
          ))}
        </div>
      )}

      {/* Fields */}
      {dataProvider && dataProvider.length > 0 && (
        <div className={gridClass}>
          {dataProvider.map((field, idx) => {
            const isBullets = field.type === "bullets";

            const value =
              isBullets && typeof field.value === "string"
                ? field.value.split(/,\s*/)
                : field.value;

            const fieldClass = field.noWrap
              ? "col-span-1 sm:col-span-2 lg:col-span-3 w-full"
              : "";

            return (
              <div key={idx} className={fieldClass}>
                <ReviewFields
                  {...field}
                  value={value}
                  type={field.type ?? "text"}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Map */}
      {mapData && (
        <div className="w-full h-64 mb-6 rounded overflow-hidden border border-gray-300">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${mapData.lat},${mapData.lng}&z=15&output=embed`}
          />
        </div>
      )}

      {/* Autofill hint */}
      {hideChange && showAutoFillHint && (
        <div className="text-xs text-gray-400 mt-2">
          Auto-filled from your profile
        </div>
      )}

      {!isLastItem && <hr className="h-px my-8 bg-gray-300 border-0" />}
    </section>
  );
}

export default ReviewDetailsSection;