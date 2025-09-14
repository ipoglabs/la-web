import Link from "next/link";

export default function SearchArea() {
  return (
<>
<div className="bg-slate-800 pt-4 pb-1 shadow-gray-200 shadow-lg">

        {/* Bold Info to World */}
        <div className="container max-w-screen-sm mx-auto px-4 text-center pb-4">
          <h1 className="text-white text-2xl sm:text-4xl leading-tight font-bold mb-3">You can find anything with lokalads, just start...</h1>
          <h3 className="text-slate-300">Search from 3.2M posts</h3>
        </div>
       
        {/* Search Area Group */}
        <form className="container mx-auto px-4 flex-1 relative w-full flex flex-col flex-nowrap sm:flex-row gap-2 max-w-screen-lg">
          
          {/* Keyword Search */}
          <div className="relative flex-1">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 absolute left-2 top-[20px] -mt-3 text-slate-500 pointer-events-none group-focus-within:text-blue-500">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>

            {/* Clear Button */}
              <button type="submit"
                className="
                flex-none absolute top-[1px] right-[2px]
                rounded-md w-auto h-[35px] px-6 py-0 ml-0 sm:ml-1
                text-base leading-6 font-semibold text-pink-200 hover:text-white
                bg-pink-500 hover:bg-pink-600 
                focus:outline-none
                transition duration-150 ease-in-out
                focus:ring-opacity-50
                ">
              GO
            </button>

            <input
              className="appearance-none 
              w-full h-[38px] py-[2px] sm:py-[4px] pl-10
              focus:outline-none rounded-md
              bg-gray-100 focus:bg-white
              text-md text-slate-900 placeholder:text-slate-400"
              type="text"
              aria-label="Filter projects"
              placeholder="ex: Toyota Hybrid Car in Vehicles"
            />
          </div>
          
          {/* Location Search */}
          <div className="flex-1 flex flex-row flex-nowrap items-center gap-0">
            
            {/* Location Search */}
            <div className="relative flex-1">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 absolute left-2 top-[6px] text-slate-400 pointer-events-none group-focus-within:text-blue-500">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>

              {/* <!-- Clear Button --> */}
              <button className="absolute flex items-center justify-center w-10 right-0 top-0 bottom-0 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-slate-300 hover:text-slate-500">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
                
              </button>

              <input
                className="appearance-none w-full h-[38px] py-[2px] sm:py-[4px] pl-10
                focus:outline-none rounded-l-md rounded-r-none
                bg-gray-100 focus:bg-white
                text-md text-slate-900 placeholder:text-slate-400
                "
                type="text"
                aria-label="Filter projects"
                placeholder="ex: Dartford, Kent"
              />
            </div>

            {/* <!-- Select Radius --> */}
            <button className="relative appearance-none flex items-center rounded-r-md border-l-[1px] border-slate-400
            bg-slate-200 focus:bg-slate-300 active:bg-slate-300
            h-[38px] pl-4 pr-9
            "
            >
              
             <span className="text-sm font-semibold text-slate-900">+ 0 miles</span>
              {/* <!-- Dropdown arrow --> */}
              <svg className="absolute size-6 top-2.5 right-1 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </button>

          </div>
        </form>

        <div className="relative container mx-auto flex justify-end px-4 pt-2 pb-1 max-w-screen-lg">

          <Link href="#" className="group flex items-centerg gap-2 text-slate-100 group-hover:text-rose-700 text-sm font-semibold">
                
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-slate-100 group-hover::text-rose-700 rotate-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
            <span>Create Alert</span>
          </Link>
        </div>

      </div>
</>
  );
}