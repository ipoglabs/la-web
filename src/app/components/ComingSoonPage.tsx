'use client';

// import SimpleHeader from './AppHeader/simpleHeader';
import AppHeader from './AppHeader/appHeader';
import AppFooter from './AppFooter/appFooter';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/app/assets/la-logo-symbol-color.svg';
import LogoText from '@/app/assets/la-text-black.svg';

export default function ComingSoonPage({
  title = "Coming Soon",
  description = "We’re working hard to bring something amazing. Stay tuned!",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <>
    <AppHeader/>
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4 text-center">
      <Link className="flex gap-2 items-center mb-6" href="/">
        <Image className="size-10" src={Logo} alt="logo" />
        <div className="relative">
          <Image className="w-24 max-sm:hidden" src={LogoText} alt="logo text" />
        </div>
      </Link>

      <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg sm:text-xl text-slate-300 mb-8">{description}</p>
    </main>
    <AppFooter/>
    </>
  );
}
