'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/app/assets/la-logo-symbol-color.svg';
import LogoText from '@/app/assets/la-text-black.svg';

export default function SimpleHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real auth check

  const handlePostClick = () => {
    if (!isLoggedIn) {
      alert('You need to login first to post an ad.');
      router.push('/login');
    } else {
      router.push('/post');
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="border-b border-slate-200 shadow-md shadow-gray-300">
      <div className="bg-white">
        <div className="container mx-auto h-16 flex items-center px-4 max-w-screen-lg">
          {/* Logo */}
          <Link className="flex gap-2 items-center" href="/">
            <Image className="size-10" src={Logo} alt="logo" />
            <div className="relative">
              <Image className="w-24 max-sm:hidden" src={LogoText} alt="logo" />
            </div>
          </Link>

          <div className="flex-1" />

          <div className="h-full flex items-center gap-2">
            {/* Heart Icon */}
            <button className="hover:bg-slate-300 flex items-center justify-center flex-none w-11 max-sm:w-9 h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-8 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            {/* POST Button */}
            <button
              onClick={handlePostClick}
              className="bg-rose-500 hover:bg-rose-600 group flex items-center rounded-full text-white text-sm font-medium pl-2 pr-3 py-1 shadow-sm max-sm:hidden mr-2"
            >
              <svg width="20" height="20" fill="currentColor" className="max-sm:mr-1">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              POST
            </button>

            {/* Profile Icon + Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-slate-300 flex items-center justify-center flex-none w-11 max-sm:w-9 h-full">
                  <div className="relative size-10 bg-indigo-200 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 text-slate-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/my-ads')}>My Ads</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/chat')}>Chat</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>Your Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push('/register')}>Sign Up</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
