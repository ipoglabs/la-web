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
    noWrap?: boolean; // If true, this field will be full width
  }>;
  imageProvider?: Array<{ imageUrl: string }>;
  routeBackTo?: string;
  isLastItem?: boolean;
  allowedToWrap?: boolean;
  mapData?: { lat: number; lng: number } | null;
}

// ReviewSection groups multiple review fields and provides a change link
function ReviewDetailsSection({
  title,
  dataProvider,
  imageProvider,
  routeBackTo,
  isLastItem = false,
  allowedToWrap = true,
  mapData,
}: ReviewSectionProps) {
  const router = useRouter();
  const country =
    typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
  // Responsive grid classes: mobile 1 col, tablet 2 col, desktop+ 3 col
  const gridClass = allowedToWrap
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "flex flex-col w-full";
  return (
    <section className="mb-8">
      {title && (
        <div className="font-bold text-base text-gray-800 mb-4">{title}</div>
      )}

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

      {dataProvider && dataProvider.length > 0 && (
        <div className={gridClass}>
          {dataProvider.map((field, idx) => {
            // If type is 'bullets' and value is a string, split by comma and pass as array
            const isBullets = field.type === "bullets";
            const value =
              isBullets && typeof field.value === "string"
                ? field.value.split(/,\s*/)
                : field.value;
            // If noWrap is true, render full width
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

      {/* Section: Map Placeholder (conditionally rendered) */}
      {mapData && (
        <div className="w-full h-64 bg-gray-200 border border-gray-300 flex items-center justify-center mb-6">
          <span className="text-gray-500">Map Placeholder</span>
        </div>
      )}

      {routeBackTo && (
        <button
          className="text-blue-600 underline"
          onClick={() => router.push(`/${country}${routeBackTo}`)}
        >
          Change
        </button>
      )}

      {!isLastItem && <hr className="h-px my-8 bg-gray-300 border-0" />}
    </section>
  );
}

export default ReviewDetailsSection;
