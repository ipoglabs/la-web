export default function StatsSection() {
  return (
<>
{/* <!-- Stats Section | Media Below SM--> */}
    <div className="sm:hidden bg-slate-300 py-5 border-2 border-t border-slate-400">
      <div className="container mx-auto max-w-screen-lg grid grid-cols-2 items-stretch justify-center gap-3 px-5">
        
        <div className="rounded-[15px] bg-white px-5 p-3">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          
          <h2 className="text-2xl font-bold"><span>128</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">Super Categories</p>
        </div>

        <div className="rounded-[15px] bg-white px-5 p-3">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
          
          <h2 className="text-2xl font-bold"><span>2680</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">User Clicks Daily</p>
        </div>

        <div className="rounded-[15px] bg-white px-5 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          
          <h2 className="text-2xl font-bold"><span>100</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">Avg Onboarding</p>
        </div>

        <div className="rounded-[15px] bg-white px-5 p-3">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          

          <h2 className="text-2xl font-bold"><span>268M</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">User Search</p>
        </div>

      </div>
    </div>

    {/* <!-- Stats Section | Media Above SM --> */}
    <div className="max-sm:hidden bg-slate-300 py-5 border-2 border-t border-slate-400">
      <div className="container mx-auto max-w-screen-lg flex flex-row items-center justify-center gap-x-4">
        
        <div className="w-fit rounded-[25px] bg-white px-7 p-6 aspect">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          
          <h2 className="text-3xl font-bold"><span>128</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">Super Categories</p>
        </div>

        <div className="w-fit rounded-[25px] bg-white px-7 p-6 aspect">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
          
          <h2 className="text-3xl font-bold"><span>2680</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">User Clicks Daily</p>
        </div>

        <div className="w-fit rounded-[25px] bg-white px-7 p-6 aspect">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          
          <h2 className="text-3xl font-bold"><span>100</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">Avg Onboarding</p>
        </div>

        <div className="w-fit rounded-[25px] bg-white px-7 p-6 aspect">
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-11 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          

          <h2 className="text-3xl font-bold"><span>268M</span> +</h2>
          <p className="font-sans text-base font-medium text-gray-500">User Search</p>
        </div>

      </div>
    </div>
</>
  );
}