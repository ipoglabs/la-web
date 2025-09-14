'use client';
import Image from 'next/image';
import Link from 'next/link';
import LogoWhite from '@/app/assets/la-logo-symbol-black.svg';
import LogoTextWhite from '@/app/assets/la-text-white.svg';

export default function AppFooter() {
  return (
    <footer className="bg-slate-800 border-t-4 border-rose-500">
      {/* Company Info & Collapsable Footer */}
      <details className="group container mx-auto flex max-sm:flex-col flex-row flex-nowrap gap-2 px-4 py-4 max-w-screen-lg">
        <summary className="cursor-pointer flex flex-col items-stretch justify-center">
          <div className="flex items-center justify-between">
            <Link className="flex gap-2 items-center" href="/">
              <Image className="size-11" src={LogoWhite} alt="logo" />
              <div className="relative">
                <Image className="w-24" src={LogoTextWhite} alt="logo text" />
                <span className="absolute right-1 -bottom-4 text-[11px] font-semibold text-white">India</span>
              </div>
            </Link>

            <div className="size-10 flex items-center justify-center text-white bg-slate-800 hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="block h-5 w-5 group-open:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="hidden h-5 w-5 group-open:block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </div>
          </div>

          <p className="text-slate-300 text-sm font-normal mt-2">
            Find anything with lokalads, it's just secure..
          </p>
        </summary>

        <div className="flex-1 pt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          {/* Resources */}
          <div className="flex-1 mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">Resources</div>
            <Link className="my-1 block text-sm text-slate-200" href="/tutorials">Tutorials</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/faq">Frequent Questions (FAQ)</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/support">Support <span className="text-teal-200 text-xs p-1">New</span></Link>
          </div>

          {/* Popular Category */}
          <div className="flex-1 mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">Popular Category</div>
            <Link className="my-1 block text-sm text-slate-200" href="/property">Property</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/jobs">Jobs</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/for-sale">For Sale <span className="text-teal-200 text-xs p-1">New</span></Link>
          </div>

          {/* Top Locations */}
          <div className="flex-1 mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">Top Locations</div>
            <Link className="my-1 block text-sm text-slate-200" href="/london">London</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/bristol">Bristol</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/scotland">Scotland <span className="text-teal-200 text-xs p-1">New</span></Link>
          </div>

          {/* About Us */}
          <div className="flex-1 mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">About Us</div>
            <Link className="my-1 block text-sm text-slate-200" href="/about">About lokalads</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/why-advertise">Why Advertise With Us?</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/careers">Careers</Link>
            <Link className="my-1 block text-sm text-slate-200" href="/contact">Contact <span className="text-teal-200 text-xs p-1">New</span></Link>
          </div>
        </div>
      </details>

      {/* Social Icons */}
      <div className="relative flex pb-5 px-4 sm:px-12 m-auto text-gray-800 text-sm flex-col max-w-screen-lg items-center">
        <hr className="absolute w-48 h-px border-slate-500" />
        <div className="md:flex-auto mt-4 flex-row flex max-sm:px-4">
          {['/coming-soon', '/coming-soon', '/coming-soon', '/coming-soon'].map((href, i) => (
            <Link key={i} href={href} className="w-6 mx-1">
              <svg className="fill-current cursor-pointer text-slate-400 hover:text-slate-200" width="100%" height="100%" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" /> {/* Placeholder SVG */}
              </svg>
            </Link>
          ))}
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center p-2 text-slate-300 text-center">
          <p className="inline-block py-1 text-nowrap">
            © 2025 lokalads | Co. Reg. No. 8765412345.
          </p>
          <svg viewBox="0 0 2 2" width="3" height="3" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
          <Link className="py-1 text-nowrap" href="/privacy-policy">Privacy Policy</Link>
          <svg viewBox="0 0 2 2" width="3" height="3" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
          <Link className="py-1 text-nowrap" href="/conditions">Conditions</Link>
          <svg viewBox="0 0 2 2" width="3" height="3" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
          <Link className="py-1 text-nowrap" href="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>

      {/* Donation Section */}
      <div className="bg-white">
        <div className="container mx-auto bg-white px-12 py-3 flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center text-center max-w-screen-lg">
          <p className="text-lg text-slate-700 italic">"Your support makes lokalads possible. Let's grow together!"</p>
          <Link
            href="/donate"
            className="pl-4 pr-1.5 py-1 border bg-yellow-400 hover:bg-yellow-500 rounded-full border-yellow-500 text-lg text-yellow-900 font-semibold flex items-center justify-center gap-2"
          >
            <span>Support Lokalads</span>
            <span className="p-1 rounded-full bg-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="size-6 text-white" viewBox="0 0 24 24">
                <path d="M11.645 20.91a.752.752 0 0 1-.704 0l-.007-.004a15.3 15.3 0 0 1-.383-.219 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17c-.132.082-.26.154-.383.219l-.007.003Z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
