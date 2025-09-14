import Link from "next/link";

export default function SecondarySearchArea() {
  return (
<>
 {/* <!-- Search Area --> */}
      <div className="bg-slate-800 py-2">
        {/* <!-- Search Area Group --> */}
        <form
          className="container mx-auto px-4 sm:px-6 lg:px-16 flex-1 relative w-full flex flex-col flex-nowrap sm:flex-row gap-2 max-sm:gap-1.5"
        >
          {/* <!-- Keyword Search --> */}
          <div className="relative flex-1 h-[30px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 absolute left-2 top-[18px] -mt-3 text-slate-500 pointer-events-none group-focus-within:text-blue-500"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>

            {/* <!-- Clear Button --> */}
            <button
              className="absolute flex items-center justify-center w-10 right-0 top-0 bottom-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-slate-300 hover:text-slate-500"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <input
              className="appearance-none w-full h-[30px] py-[2px] sm:py-[4px] pl-7 focus:outline-none rounded-md bg-gray-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-600"
              type="text"
              aria-label="Filter projects"
              placeholder="ex: Toyota Hybrid Car"
            />
          </div>

          {/* <!-- Location Search --> */}
          <div className="flex-1 flex flex-row flex-nowrap items-center gap-0">
            {/* <!-- Location Search --> */}
            <div className="relative flex-1 h-[30px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 absolute left-1.5 top-[6px] text-slate-500 pointer-events-none group-focus-within:text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>

              {/* <!-- Clear Button --> */}
              <button
                className="absolute flex items-center justify-center w-10 right-0 top-0 bottom-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 text-slate-300 hover:text-slate-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* <!-- ring-1 ring-slate-400 bg-slate-50 focus:bg-white 100 focus:ring-1 focus:ring-blue-500         --> */}
              <input
                className="appearance-none w-full h-[30px] py-[2px] sm:py-[4px] pl-7 focus:outline-none rounded-l-md rounded-r-none bg-gray-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-600"
                type="text"
                aria-label="Filter projects"
                placeholder="Dartford, Kent"
              />
            </div>

            {/* <!-- Select Radius -->
            <!-- ring-1 ring-slate-200   focus:ring-1 focus:ring-blue-500 focus:outline-none 
               --> */}
            <button
              className="relative appearance-none flex items-center rounded-r-md border-l-[1px] border-slate-400 bg-slate-200 focus:bg-slate-300 active:bg-slate-300 h-[30px] pl-4 pr-6"
            >
              <span className="text-sm font-semibold text-slate-900"
                >+ 0 miles</span>
              {/* <!-- Dropdown arrow --> */}
              <svg
                className="absolute top-2 right-1 w-4 h-4 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* <!-- Breadcrumb Area --> */}
      <div className="bg-slate-50 py-1 flex items-center flex-wrap">
        <div
          className="container mx-auto h-8 flex items-center px-4 sm:px-6 lg:px-16"
        >
          <ul className="flex items-center">
            <li className="inline-flex items-center">
              <Link href="/" className="text-slate-700 hover:text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
              </Link>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mx-2 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>

            <li className="inline-flex items-center">
              <Link
                href="#"
                className="text-slate-700 hover:text-slate-900 text-sm font-semibold"
              >
                Main Category
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 h-5 w-5 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>

            <li className="inline-flex items-center">
              <Link
                href="#"
                className="text-slate-700 hover:text-slate-900 text-sm font-semibold"
              >
                Sub Category
              </Link>
            </li>
          </ul>

          <div className="flex-1"></div>

          <Link
            href="#"
            className="group flex items-centerg gap-2 text-slate-700 group-hover:text-rose-700 text-sm font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-slate-600 group-hover::text-rose-700 rotate-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>

            <span className="max-sm:hidden">Create Alert</span>
          </Link>
        </div>
      </div>
</>
  );
}