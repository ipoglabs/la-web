"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/app/assets/la-logo-symbol-color.svg";
import LogoText from "@/app/assets/la-text-black.svg";

export default function PostHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Safe login detection
  useEffect(() => {
    const checkLogin = () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLogin();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") checkLogin();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handlePostClick = useCallback(() => {
    if (!isLoggedIn) {
      toast.info("Please login to post an ad.");
      localStorage.setItem("redirectAfterLogin", "/post/select-category");
      router.push("/login");
      return;
    }

    router.push("/post/select-category");
  }, [isLoggedIn, router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("You have been logged out.");
    router.push("/");
  }, [router]);

  return (
    <header className="border-b border-slate-200 shadow-md shadow-gray-300">
      <div className="bg-white">
        <div className="container mx-auto h-12 flex items-center px-4 sm:px-6 lg:px-16">
          {/* Logo */}
          <Link className="flex gap-2 items-center" href="/" aria-label="Go to home">
            <Image className="size-10" src={Logo} alt="LA logo" />
            <Image className="w-24 max-sm:hidden" src={LogoText} alt="LA text" />
          </Link>

          <div className="flex-1" />

          <div className="h-full flex items-center gap-2">

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hover:bg-slate-300 flex items-center justify-center w-11 h-full"
                  type="button"
                  aria-label="Open profile menu"
                >
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
                    {isLoggedIn && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/my-ads")}>
                      My Ads
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/chat")}>
                      Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/login")}>
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
