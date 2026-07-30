import { LaSkeleton } from "@/components/la";

const card = "bg-white px-4 py-5 border-y border-slate-200 sm:rounded-xl sm:border sm:shadow-sm";
const imgGalleryCard = "bg-white px-1.5 py-1.5 border border-slate-200 sm:rounded-xl sm:border sm:shadow-sm";

export default function ListingDetailLoading() {
  return (
    <>
      {/* Dark nav band placeholder */}
      <div className="bg-slate-800">
        <div className="container-app h-9" />
      </div>

      <div className="bg-slate-950/15 min-h-screen pb-10">
        <div className="container-app flex flex-col gap-3">

          {/* Title bar */}
          <div className="flex flex-col items-stretch bg-white px-4 py-4 border-b border-slate-900/25 gap-2 sm:rounded-b-md sm:border-x sm:border-b sm:shadow-md sm:shadow-black/10">
            <LaSkeleton shape="text" className="h-6 w-2/3" />
            <LaSkeleton shape="text" className="h-4 w-1/3" />
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-3 md:items-start">
            {/* Left column */}
            <div className="flex flex-col gap-3 md:col-span-2">
              {/* Gallery */}
              <section className={imgGalleryCard}>
                <LaSkeleton shape="block" className="aspect-4/3 w-full" />
              </section>

              {/* Seller card — mobile */}
              <section className={`${card} md:hidden flex items-center gap-3`}>
                <LaSkeleton shape="circle" className="size-12 shrink-0" />
                <div className="flex-1 space-y-2">
                  <LaSkeleton shape="text" className="w-1/2" />
                  <LaSkeleton shape="text" className="w-1/3" />
                </div>
              </section>

              {/* Description */}
              <section className={`${card} space-y-2`}>
                <LaSkeleton shape="text" className="h-5 w-1/4 mb-2" />
                <LaSkeleton shape="text" className="w-full" />
                <LaSkeleton shape="text" className="w-full" />
                <LaSkeleton shape="text" className="w-2/3" />
              </section>

              {/* Details table */}
              <section className={`${card} space-y-2`}>
                <LaSkeleton shape="text" className="h-5 w-1/3 mb-2" />
                <LaSkeleton shape="text" className="w-full" />
                <LaSkeleton shape="text" className="w-5/6" />
                <LaSkeleton shape="text" className="w-3/4" />
              </section>
            </div>

            {/* Right column */}
            <div className="hidden md:flex flex-col gap-3">
              <section className={`${card} flex items-center gap-3`}>
                <LaSkeleton shape="circle" className="size-12 shrink-0" />
                <div className="flex-1 space-y-2">
                  <LaSkeleton shape="text" className="w-1/2" />
                  <LaSkeleton shape="text" className="w-1/3" />
                </div>
              </section>
              <LaSkeleton shape="block" className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
