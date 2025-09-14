import Image from "next/image";
import Link from "next/link";
import ListImage from "@/app/assets/img/img6.jpg"

export default function Listing() {
  return (
<>
{/* <!-- Right Listing Container --> */}
      <div className="flex-1 max-sm:w-full">
        {/* <!-- List Heading Details --> */}
        <div className="container mx-auto flex items-center">
          <button
            className="flex items-center justify-center flex-none w-9 h-9 bg-slate-300 hover:bg-slate-50 rounded-lg mr-2 sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-slate-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>

          <p className="text-medium font-normal">
            <span className="text-lg font-semibold">918</span> results
          </p>
          <div className="flex-1"></div>

          {/* <!-- Listing Header Info --> */}
          <div className="text-sm">
            <span>Sort by: </span>
            <div className="min-w-24 dropdown inline-block relative">
              <button
                type="button"
                className="relative w-full inline-flex items-center text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border-[1px] border-slate-400 rounded-full px-3 pb-1 pt-[2px]"
              >
                Newest
                {/* <!-- Dropdown arrow --> */}
                <svg
                  className="absolute top-1.5 right-2 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
                </svg>
              </button>

              <ul
                className="hidden min-w-full dropdown-menu absolute bg-gray-200 text-gray-700 dark:text-gray-300 shadow-lg"
              >
                <li className="hover:bg-gray-400">
                  <Link className="block px-4 py-1 whitespace-no-wrap" href="#"
                    >Newest</Link>
                </li>
                <li className="hover:bg-gray-400">
                  <Link className="block px-4 py-1 whitespace-no-wrap" href="#"
                    >Oldest</Link>
                </li>
                <li className="hover:bg-gray-400">
                  <Link className="block px-4 py-1 whitespace-no-wrap" href="#"
                    >High Price</Link>
                </li>
                <li className="hover:bg-gray-400">
                  <Link className="block px-4 py-1 whitespace-no-wrap" href="#"
                    >Low Price</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <!-- Grid Listing --> */}
        <div className="w-full mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link
            className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300"
            href="/postDetails"
          >
            {/* <!-- Mini Carousel --> */}
            <div className="relative overflow-hidden">
              <span
                className="inline-block absolute left-1.5 bottom-1.5 bg-gray-900 bg-opacity-75 text-white py-0.5 px-2 text-xs rounded-full uppercase font-semibold tracking-tight"
                >1/ 18</span>
              <Image
                className="h-40 w-full object-cover transition duration-200"
                src={ListImage}
                alt="Home in Countryside"
                loading="lazy"
              />
            </div>

            <div className="px-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-xl text-gray-700">
                  $4500<span className="text-gray-600 text-sm">pcm</span>
                </div>
                <span className="flex-1"></span>

                <button
                  className="size-8 flex items-center justify-center bg-slate-50 hover:bg-slate-200 -mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-slate-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
              </div>

              {/* <!-- Key Facts - leading-tight truncate --> */}
              <h4 className="text-sm font-normal line-clamp-2">
                Beautiful 5 Bed Room Villa Home in the dartford countryside, 3
                mins walks to station.
              </h4>

              <div
                className="text-gray-500 text-[11px] uppercase font-semibold tracking-wide pt-1.5 pb-1 -mt-0.5"
              >
                3 beds &bull; 2 baths &bull; Apartment
              </div>

              <div
                className="flex items-end text-xs font-normal text-slate-700 pt-2 pb-3"
              >
                <span className="flex-1 pr-4 leading-normal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 inline text-slate-500 -translate-y-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dartford, Kent, DA99JW</span
                >
                <span className="text-slate-900">2d ago</span>
              </div>
            </div>
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300"
            href="/postDetails"
          >
            {/* <!-- Mini Carousel --> */}
            <div className="relative">
              <span
                className="inline-block absolute left-1.5 bottom-1.5 bg-gray-900 bg-opacity-75 text-white py-0.5 px-2 text-xs rounded-full uppercase font-semibold tracking-tight"
                >1/ 18</span>
              <Image
                className="h-40 w-full object-cover object-end"
                src={ListImage}
                alt="Home in Countryside"
              />
            </div>

            <div className="px-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-xl text-gray-700">
                  $4500<span className="text-gray-600 text-sm">pcm</span>
                </div>
                <span className="flex-1"></span>

                <button
                  className="size-8 flex items-center justify-center bg-slate-50 hover:bg-slate-200 -mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-slate-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
              </div>

              {/* <!-- Key Facts - leading-tight truncate --> */}
              <h4 className="text-sm font-normal line-clamp-2">
                Beautiful 5 Bed Room Villa Home in the dartford countryside, 3
                mins walks to station.
              </h4>

              <div
                className="text-gray-500 text-[11px] uppercase font-semibold tracking-wide pt-1.5 pb-1 -mt-0.5"
              >
                3 beds &bull; 2 baths &bull; Apartment
              </div>

              <div
                className="flex items-end text-xs font-normal text-slate-700 pt-2 pb-3"
              >
                <span className="flex-1 pr-4 leading-normal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 inline text-slate-500 -translate-y-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dartford, Kent, DA99JW</span
                >
                <span className="text-slate-900">2d ago</span>
              </div>
            </div>
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300"
            href="/postDetails"
          >
            {/* <!-- Mini Carousel --> */}
            <div className="relative">
              <span
                className="inline-block absolute left-1.5 bottom-1.5 bg-gray-900 bg-opacity-75 text-white py-0.5 px-2 text-xs rounded-full uppercase font-semibold tracking-tight"
                >1/ 18</span
              >
              <Image
                className="h-40 w-full object-cover object-end"
                src={ListImage}
                alt="Home in Countryside"
              />
            </div>

            <div className="px-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-xl text-gray-700">
                  $4500<span className="text-gray-600 text-sm">pcm</span>
                </div>
                <span className="flex-1"></span>

                <button
                  className="size-8 flex items-center justify-center bg-slate-50 hover:bg-slate-200 -mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-slate-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
              </div>

              {/* <!-- Key Facts - leading-tight truncate --> */}
              <h4 className="text-sm font-normal line-clamp-2">
                Beautiful 5 Bed Room Villa Home in the dartford countryside, 3
                mins walks to station.
              </h4>

              <div
                className="text-gray-500 text-[11px] uppercase font-semibold tracking-wide pt-1.5 pb-1 -mt-0.5"
              >
                3 beds &bull; 2 baths &bull; Apartment
              </div>

              <div
                className="flex items-end text-xs font-normal text-slate-700 pt-2 pb-3"
              >
                <span className="flex-1 pr-4 leading-normal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 inline text-slate-500 -translate-y-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dartford, Kent, DA99JW</span
                >
                <span className="text-slate-900">2d ago</span>
              </div>
            </div>
          </Link>

          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>

          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>

          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>

          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
          <Link
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg border-[1px] border-slate-300 h-52"
            href="/post-details.html"
          >
          </Link>
        </div>

        {/* <!-- Pagination --> */}
        <div className="w-full mt-3 flex items-center">
          <div className="mx-auto py-2">
            <button
              className="h-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900 px-2"
            >
              back
            </button>
            <button
              className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900"
            >
              1
            </button>
            <button
              className="size-7 bg-slate-800 hover:bg-slate-900 rounded-md text-sm font-semibold text-slate-100"
            >
              2
            </button>
            <button
              className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900"
            >
              3
            </button>
            <button
              className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900"
            >
              4
            </button>
            <button
              className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900"
            >
              ...
            </button>
            <button
              className="size-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900"
            >
              18
            </button>
            <button
              className="h-7 bg-slate-300 hover:bg-slate-100 rounded-md text-sm font-normal text-slate-900 px-2"
            >
              next
            </button>
          </div>
        </div>
      </div>
</>
  );
}