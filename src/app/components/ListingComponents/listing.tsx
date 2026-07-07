import connectDB from "@/lib/db";
import Post from "@/models/post";
import ListingCard from "@/app/components/ListingComponents/ListingCard";
import SortDropdown from "@/app/components/ListingComponents/SortDropdown";
import Pagination from "@/app/components/ListingComponents/Pagination";

export const revalidate = 0; // always fresh
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

function getSort(sort?: string) {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "price_desc":
      // prefer rentPrice, then salePrice
      return { rentPrice: -1, salePrice: -1, createdAt: -1 } as any;
    case "price_asc":
      return { rentPrice: 1, salePrice: 1, createdAt: -1 } as any;
    default:
      return { createdAt: -1 };
  }
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; q?: string; category?: string; subcategory?: string };
}) {
  await connectDB();

  // filters
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const sort = getSort(searchParams?.sort);
  const filter: any = {};

  if (searchParams?.q) {
    filter.$or = [
      { name: { $regex: searchParams.q, $options: "i" } },
      { description: { $regex: searchParams.q, $options: "i" } },
      { category: { $regex: searchParams.q, $options: "i" } },
      { subcategory: { $regex: searchParams.q, $options: "i" } },
      { "location.address": { $regex: searchParams.q, $options: "i" } },
    ];
  }
  if (searchParams?.category) filter.category = searchParams.category;
  if (searchParams?.subcategory) filter.subcategory = searchParams.subcategory;

  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort(sort as any)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean()
      .exec(),
    Post.countDocuments(filter).exec(),
  ]);

  return (
    <div className="flex-1 max-sm:w-full">
      {/* heading row */}
      <div className="container mx-auto flex items-center">
        <button className="flex items-center justify-center flex-none w-9 h-9 bg-slate-300 hover:bg-slate-50 rounded-lg mr-2 sm:hidden" aria-label="open filters">
          {/* icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth="1.5" stroke="currentColor" className="size-6 text-slate-800">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
          </svg>
        </button>

        <p className="text-medium font-normal">
          <span className="text-lg font-semibold">{total}</span> results
        </p>
        <div className="flex-1" />
        <SortDropdown />
      </div>

      {/* grid */}
      <div className="w-full mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-sm text-slate-500 py-10">No posts found.</div>
        ) : (
          items.map((p: any) => (
            <ListingCard
              key={p._id.toString()}
              _id={p._id.toString()}
              name={p.name}
              description={p.description}
              images={p.images}
              category={p.category}
              subcategory={p.subcategory}
              beds={p.beds}
              baths={p.baths}
              rentPrice={p.rentPrice}
              salePrice={p.salePrice}
              createdAt={p.createdAt}
              location={p.location}
            />
          ))
        )}
      </div>

      {/* pagination */}
      <Pagination total={total} pageSize={PAGE_SIZE} />
    </div>
  );
}
