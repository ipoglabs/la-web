'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/app/assets/la-logo-symbol-color.svg';
import LogoText from '@/app/assets/la-text-black.svg';


export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4 text-center">
      {/* Logo */}
      <Link className="flex gap-2 items-center mb-6" href="/">
        <Image className="size-10" src={Logo} alt="logo" />
        <div className="relative">
          <Image className="w-24 max-sm:hidden" src={LogoText} alt="logo text" />
        </div>
      </Link>

      {/* Coming Soon Text */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Coming Soon</h1>
      <p className="text-lg sm:text-xl text-slate-300 mb-8">
        We’re working hard to bring something amazing. Stay tuned!
      </p>

      {/* Optional: Email signup or CTA */}
      {/* <form className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          className="px-4 py-2 rounded-l-md border-none outline-none text-slate-900"
        />
        <button className="px-4 py-2 bg-yellow-400 text-slate-900 font-semibold rounded-r-md hover:bg-yellow-500">
          Notify Me
        </button>
      </form> */}
    </main>
  );
}
