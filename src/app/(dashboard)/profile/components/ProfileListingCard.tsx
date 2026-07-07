import Link from "next/link";

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
    <Link
      href={`/post/${item.id}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
    >
      {/* Thumbnail */}
      {item.image && (
        <div className="relative overflow-hidden h-28 bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
          />

          <span
            className={`absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
              item.status === "active"
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-900/60 text-white"
            }`}
          >
            <span className="size-1.5 rounded-full bg-white/80 shrink-0" />
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      )}

      {/* Header (no image case) */}
      {!item.image && (
        <div className="px-3 pt-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
              item.status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                item.status === "active" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {item.status}
          </span>

          <span className="text-[10px] text-slate-400">
            {item.postedAt}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-2 flex-1">

        <h4 className="text-sm font-medium text-slate-800 line-clamp-2">
          {item.title}
        </h4>

        {/* Price */}
        <div>
          {item.price ? (
            <span className="text-base font-bold text-slate-900">
              ₹ {item.price}
            </span>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Price on request
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-1">

          <span className="text-[10px] font-semibold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
            {item.category}
          </span>

          <div className="flex justify-between text-[11px] text-slate-400">

            <span className="truncate">{item.location}</span>
            <span>{item.postedAt}</span>

          </div>

        </div>
      </div>
    </Link>
  );
}