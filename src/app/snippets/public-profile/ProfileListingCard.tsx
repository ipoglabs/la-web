type ProfileListing = {
  id: string;
  title: string;
  price: string | null;
  category: string;
  location: string;
  postedAt: string;
  status: "active" | "closed";
  image?: string;
};

export default function ProfileListingCard({ item }: { item: ProfileListing }) {
  return (
    <a
      href="/post-details"
      className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
    >
      {/* Thumbnail */}
      {item.image && (
        <div className="relative overflow-hidden h-28 bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <span
            className={`absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
              item.status === "active"
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-900/60 text-white"
            }`}
          >
            <span className="size-1.5 rounded-full bg-white/80 shrink-0" />
            {item.status}
          </span>
        </div>
      )}

      {/* Header: status (no image fallback) + time */}
      {!item.image && (
        <div className="px-3 pt-3 flex items-center justify-between gap-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
              item.status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <span
              className={`size-1.5 rounded-full shrink-0 ${
                item.status === "active" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {item.status}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0">{item.postedAt}</span>
        </div>
      )}

      {/* Body */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-2 flex-1">
        {/* Title — max 2 lines */}
        <h4 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
          {item.title}
        </h4>

        {/* Price */}
        {item.price ? (
          <div className="text-base font-bold text-slate-900 leading-none">
            {item.price}
            <span className="text-xs font-normal text-slate-400"> pcm</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">Price on request</div>
        )}

        {/* Category + Location + time — pushed to bottom */}
        <div className="mt-auto flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
            {item.category}
          </span>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{item.location}</span>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">{item.postedAt}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
