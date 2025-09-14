import Link from "next/link";

export default function MasonryGrid() {
  return (
    <>
    <div className="container mx-auto px-4 py-6
    grid sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-5 
    max-w-screen-lg
    ">

    {/* <!-- Property Section --> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
  <h2 className="text-lg font-bold text-slate-700">Property</h2>
  <p className="text-sm font-normal leading-tight text-slate-600">
    Find your perfect home, rental or commercial space.
  </p>
</div>

        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>

      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>To Rent</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>To Buy</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Room Rental</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>For Students</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Commercial</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Holiday Rental</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Land for Sale/Lease</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Wanted List</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>

    </details>

    {/* <!-- Jobs Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Jobs</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Discover full-time, part-time, and freelance opportunities.</p>
        </div>

        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>

      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Full Time</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Part Time</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Freelance</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Internship</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Temporary & Seasonal</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Wanted</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>

    </details>

    {/* <!-- Vehicles Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Vehicles</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Buy, Sell, or rent cars, bikes and more.</p>
        </div>

        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>

      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Car</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Motorcycle</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Van</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Truck</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Parts & Accessories</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>

    </details>

    {/* <!-- Services Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Services</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Skilled professionals for every need. from home repairs to tutoring.</p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Home Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Business Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Health & Fitness</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Tutoring</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Education & Learning</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Travel & Tourism</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Food & Dining</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Technology & Gadgets</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Other Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>
    
    </details>

    {/* <!-- Pets Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Pets</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Adopt, buy or find pet services near you.</p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>For Sale</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Adoption</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Service</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Accessories</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Lost & Found</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>
    
    </details>

    {/* <!-- For Sale Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">For Sale</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Great deals on electronics, furniture, and more.</p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Electronics</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Home & Furniture</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Office Supplies</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Fashion & Accessories</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Sports & Fitness</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Toys & Games</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Book, Music & Media</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Book, Music & Media</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Baby & Kids</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
          </li>
          <li className="block">
            <Link href="/listing" 
              className="flex items-center justify-between pl-5 pr-2 py-1 
              font-normal text-slate-900
              hover:font-semibold hover:text-emerald-800
              hover:bg-emerald-100 rounded-md
              cursor-pointer 
              ">
              <span>Health & Beauty</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>          
            </Link>
          </li>
          <li className="block">
            <Link href="/listing" 
              className="flex items-center justify-between pl-5 pr-2 py-1 
              font-normal text-slate-900
              hover:font-semibold hover:text-emerald-800
              hover:bg-emerald-100 rounded-md
              cursor-pointer 
              ">
              <span>Garden & Outdoors</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>          
            </Link>
          </li>
          <li className="block">
            <Link href="/listing" 
              className="flex items-center justify-between pl-5 pr-2 py-1 
              font-normal text-slate-900
              hover:font-semibold hover:text-emerald-800
              hover:bg-emerald-100 rounded-md
              cursor-pointer 
              ">
              <span>Hobbies & Collections</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>          
            </Link>
          </li>
          <li className="block">
            <Link href="/listing" 
              className="flex items-center justify-between pl-5 pr-2 py-1 
              font-normal text-slate-900
              hover:font-semibold hover:text-emerald-800
              hover:bg-emerald-100 rounded-md
              cursor-pointer 
              ">
              <span>Miscellaneous</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>          
            </Link>
          </li>
      </ul>
    </details>

    {/* <!-- Business Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Business</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Promote, buy or sell businesses and franchises.</p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Business for Sale/Lease</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>B2B Service</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Freelance / Contractors</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Partnership Opportunities</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Equipment and Supplies</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Start-up Support</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Training Opportunities</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Franchise Opportunities</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Business Events</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Financial Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Miscellaneous</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>
    
    </details>

    {/* <!-- Community & Events Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Community & Events</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Connect through local events and activities.</p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Lost & Found</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Events</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>classNamees</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Volunteering & Charity</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>classNamees & Courses</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Announcement</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Child & Family Activities</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>General / Other</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>
    
    </details>

    {/* <!-- Offers Section ---> */}
    <details className="break-inside-avoid group cursor-pointer">
      <summary className="cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-3
      bg-white group-open:bg-slate-50 border border-slate-400
      shadow-sm rounded-lg
      group-open:rounded-b-none min-h-[90px]
      ">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-700">Special Offers</h2>
          <p className="text-sm font-normal leading-tight text-slate-600">Exclusive deals, discounts, and limited-time Offers </p>
        </div>
    
        <div className="flex-none mr-3">
          {/* <!-- Down Arrow | Closed --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block size-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          
          {/* <!-- Up Arrow | Open --> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden size-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>
    
      {/* <!-- Collapsable Items --> */}
      <ul className="
        bg-white rounded-lg border-[1px] border-slate-400 
        divide-y divide-dashed divide-slate-300
        p-1 group-open:rounded-t-none -mt-1
        ">
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Banking & Financial Deals</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Travel & Tourism</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Retail & Shopping</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Food & Dining</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Electronics & Gadgets</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Health & Wellness</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Education & Learning</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Holiday & Seasonal Offers</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Entertainment</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Home & Living</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Automotive</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
        <li className="block">
          <Link href="/listing" 
            className="flex items-center justify-between pl-5 pr-2 py-1 
            font-normal text-slate-900
            hover:font-semibold hover:text-emerald-800
            hover:bg-emerald-100 rounded-md
            cursor-pointer 
            ">
            <span>Miscellaneous</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-slate-400">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>          
          </Link>
        </li>
      </ul>
    
    </details>

    </div>
    </>
  );
}