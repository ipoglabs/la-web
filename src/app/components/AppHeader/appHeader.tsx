'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/app/assets/la-logo-symbol-color.svg';
import LogoText from '@/app/assets/la-text-black.svg';

export default function AppHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handlePostClick = () => {
    if (!isLoggedIn) {
      toast.info('Please login to post an ad.');
      localStorage.setItem('redirectAfterLogin', '/post/select-category');
      router.push('/login');
    } else {
      router.push('/post/select-category');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="border-b border-slate-200 shadow-md shadow-gray-300">
      <div className="bg-white">
        <div className="container mx-auto h-12 flex items-center px-4 sm:px-6 lg:px-16">
          {/* Logo */}
          <Link className="flex gap-2 items-center" href="/">
            <Image className="size-10" src={Logo} alt="logo" />
            <Image className="w-24 max-sm:hidden" src={LogoText} alt="logo text" />
          </Link>

          <div className="flex-1" />

          {/* BETA Badge */}
          {/* <span className="bg-lime-400 py-0.5 px-4 border-none rounded-full text-xs text-lime-900 font-medium mr-3">
            BETA
          </span> */}

          {/* Right Buttons */}
          <div className="h-full flex items-center gap-2">
            {/* Heart Icon */}
            <button className="hover:bg-slate-300 flex items-center justify-center w-11 h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.687 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>

            {/* POST Button - always visible */}
            <button
              onClick={handlePostClick}
              className="bg-rose-500 hover:bg-rose-600 group flex items-center rounded-full text-white text-sm font-medium pl-2 pr-3 py-1 shadow-sm mr-2"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-0 sm:mr-1"
                aria-hidden="true"
              >
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              <span className="sm:inline">POST</span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-slate-300 flex items-center justify-center w-11 h-full">
                  <div className="relative size-10 bg-indigo-200 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 text-slate-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0A3.75 3.75 0 0 1 15.75 6ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
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
                  <DropdownMenuItem onClick={() => router.push('/login')}>Sign In</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
