export default function Filter() {
  return (
<>
<div className="w-64 flex-none bg-white border-[1px] border-slate-400 rounded-md p-4 pt-2 shadow-md max-sm:hidden max-sm:fixed max-sm:left-0 max-sm:top-0 max-sm:bottom-0">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          <h2 className="text-lg font-semibold text-slate-700">Filters</h2>
        </div>

        <div className="border-b-[1px] border-slate-300 mt-3">
          <p className="text-sm font-semibold text-slate-800">Price Range</p>

          <div
            className="flex flex-row flex-nowrap items-end justify-between gap-1 pt-2 pb-3"
          >
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-semibold text-slate-500"
                >Min Price</span>
              <button className="w-full bg-slate-200 hover:bg-slate-300 rounded-md text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2">
                No Min
              </button>
            </div>
            to
            <div className="flex-1 flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-500"
                >Max Price</span>
              <button
                className="w-full bg-slate-200 hover:bg-slate-300 rounded-md text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
              >
                No Max
              </button>
            </div>
          </div>
        </div>

        <div className="border-b-[1px] border-slate-300 mt-3">
          <p className="text-sm font-semibold text-slate-800">Property type</p>

          <div className="flex flex-row flex-wrap gap-x-1 gap-y-2 pt-2 pb-3">
            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Detached
            </button>

            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Semi Detached
            </button>

            <button
              className="w-auto bg-slate-600 hover:bg-slate-900 rounded-full text-white text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Terraced
            </button>

            <button
              className="w-auto bg-slate-600 hover:bg-slate-900 rounded-full text-white text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Appartment
            </button>

            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Bungalow
            </button>

            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Farm House
            </button>
          </div>
        </div>

        <div className="border-b-[1px] border-slate-300 mt-3">
          <p className="text-sm font-semibold text-slate-800">Number of Bedrooms</p>

          <div
            className="flex flex-row flex-nowrap items-end justify-between gap-1 pt-2 pb-3"
          >
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-semibold text-slate-500">Min Beds</span>
              <button
                className="w-full bg-slate-200 hover:bg-slate-300 rounded-md text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
              >
                No Min
              </button>
            </div>
            to
            <div className="flex-1 flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-500">Max Beds</span>
              <button
                className="w-full bg-slate-200 hover:bg-slate-300 rounded-md text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
              >
                No Max
              </button>
            </div>
          </div>
        </div>

        <div className="border-b-[1px] border-slate-300 mt-3 pb-3">
          <p className="text-sm font-semibold text-slate-800">Added to Site</p>

          <button
            className="w-full bg-slate-200 hover:bg-slate-300 rounded-md text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
          >
            Anytime
          </button>
        </div>

        <div className="border-b-[1px] border-slate-300 mt-3">
          <p className="text-sm font-semibold text-slate-800">Must have</p>

          <div className="flex flex-row flex-wrap gap-x-1 gap-y-2 pt-2 pb-3">
            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Garden
            </button>

            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Parking
            </button>

            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Utility Room
            </button>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm font-semibold text-slate-800">Listed by</p>

          <div className="flex flex-row flex-wrap gap-x-1 gap-y-2 pt-2 pb-3">
            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Owner
            </button>
            <button
              className="w-auto bg-slate-200 hover:bg-slate-300 rounded-full text-slate-800 border-[1px] border-slate-300 text-xs text-center font-medium px-3 pt-1 pb-2"
            >
              Agent
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-4">
          <button
            className="w-full bg-slate-700 hover:bg-slate-900 rounded-full text-white text-sm text-center font-medium px-3 pt-1 pb-2"
          >
            Apply
          </button>
        </div>
      </div>
</>
  );
}