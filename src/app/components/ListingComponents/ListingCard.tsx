import Image from "next/image";
import Link from "next/link";

type Props = {
  _id: string;
  name: string;
  description: string;
  images?: string[];
  category: string;
  subcategory: string;
  beds?: number;
  baths?: number;
  rentPrice?: number;
  salePrice?: number;
  createdAt?: string | Date;
  location?: { address?: string };
};

export default function ListingCard(p: Props) {
  const price =
    p.rentPrice ?? p.salePrice ?? 0; // choose whichever is present
  const created = new Date(p.createdAt || Date.now());
  const ago = timeAgo(created);
  const img = (p.images && p.images[0]) || "/placeholder.jpg";

  return (
    <Link
      className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300"
      href={`/post-details/${p._id}`}
      prefetch={false}
    >
      <div className="relative overflow-hidden">
        <span className="inline-block absolute left-1.5 bottom-1.5 bg-gray-900/75 text-white py-0.5 px-2 text-xs rounded-full uppercase font-semibold tracking-tight">
          {p.images?.length ? `1 / ${p.images.length}` : "1 / 1"}
        </span>
        {/* If your images are remote URLs, be sure to set remotePatterns in next.config.js */}
        <Image
          className="h-40 w-full object-cover transition duration-200"
          src={img}
          alt={p.name}
          width={800}
          height={320}
          priority={false}
        />
      </div>

      <div className="px-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl text-gray-700">
            {price ? (
              <>
                ${price}
                {p.rentPrice ? <span className="text-gray-600 text-sm">/mo</span> : null}
              </>
            ) : (
              <span className="text-sm text-gray-500">Price on request</span>
            )}
          </div>
          <span className="flex-1" />
          <button className="size-8 flex items-center justify-center bg-slate-50 hover:bg-slate-200 -mr-2" aria-label="favourite">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth="1.5" stroke="currentColor" className="size-6 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
            </svg>
          </button>
        </div>

        <h4 className="text-sm font-normal line-clamp-2">{p.name}</h4>

        <div className="text-gray-500 text-[11px] uppercase font-semibold tracking-wide pt-1.5 pb-1 -mt-0.5">
          {(p.beds ?? 0) > 0 || (p.baths ?? 0) > 0
            ? `${p.beds ?? 0} beds • ${p.baths ?? 0} baths`
            : `${p.category}${p.subcategory ? " • " + p.subcategory : ""}`}
        </div>

        <div className="flex items-end text-xs font-normal text-slate-700 pt-2 pb-3">
          <span className="flex-1 pr-4 leading-normal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                 fill="currentColor" className="size-4 inline text-slate-500 -translate-y-0.5">
              <path fillRule="evenodd"
                    d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    clipRule="evenodd"/>
            </svg>
            {p.location?.address ?? "—"}
          </span>
          <span className="text-slate-900">{ago}</span>
        </div>
      </div>
    </Link>
  );
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
