"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo     from "@/app/assets/la-logo-symbol-color.svg";
import LogoText from "@/app/assets/la-text-black.svg";
import { getSocket, disconnectSocket } from "@/lib/wsClient";
import type { Socket } from "socket.io-client";

export default function AppHeader() {
  const router   = useRouter();
  const pathname = usePathname();

  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Ref so socket handlers always see the latest pathname without stale closure
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // ── Auth check ─────────────────────────────────────────────────────────────

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handler = () => checkAuth();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, [checkAuth]);

  // ── Unread count helpers ───────────────────────────────────────────────────

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const { conversations = [] } = await res.json();
      const total: number = conversations.reduce(
        (sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount ?? 0),
        0
      );
      setUnreadCount(total);
    } catch {}
  }, []);

  // Fetch on login / logout
  useEffect(() => {
    if (isLoggedIn) fetchUnreadCount();
    else            setUnreadCount(0);
  }, [isLoggedIn, fetchUnreadCount]);

  // Re-fetch whenever leaving /chat (user may have read messages there)
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (prev === "/chat" && pathname !== "/chat" && isLoggedIn) {
      fetchUnreadCount();
    }
  }, [pathname, isLoggedIn, fetchUnreadCount]);

  // ── Socket.io — real-time unread updates + in-app toast ───────────────────

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    getSocket().then((sock: Socket) => {
      if (cancelled) return;

      const onUpdated = (data: {
        conversationId: string;
        lastMessage:    string;
        senderName?:    string;
      }) => {
        // Chat page manages its own badge and message list — skip toast there
        if (pathnameRef.current === "/chat") return;

        setUnreadCount((prev) => prev + 1);

        const preview = data.lastMessage?.length > 60
          ? data.lastMessage.slice(0, 60) + "…"
          : data.lastMessage;

        toast.info(
          data.senderName ? `${data.senderName}: ${preview}` : preview ?? "New message",
          {
            action: {
              label:   "Open",
              onClick: () => router.push("/chat"),
            },
            duration: 6000,
          }
        );
      };

      // On reconnect re-fetch for an accurate count
      const onReconnect = () => fetchUnreadCount();

      sock.on("conversation:updated", onUpdated);
      sock.on("connect",              onReconnect);

      cleanup = () => {
        sock.off("conversation:updated", onUpdated);
        sock.off("connect",              onReconnect);
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanup?.(); };
  }, [isLoggedIn, fetchUnreadCount, router]);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    disconnectSocket();
    setUnreadCount(0);

    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-changed"));
    toast.success("You have been logged out.");
    router.push("/");
    router.refresh();
  };

  // ── Post button ────────────────────────────────────────────────────────────

  const handlePostClick = () => {
    if (!isLoggedIn) {
      toast.info("Please login to post an ad.");
      router.push("/login");
    } else {
      router.push("/post/select-category");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

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

          {/* Right section */}
          <div className="h-full flex items-center gap-2">

            {/* Heart / wishlist */}
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

            {/* POST button */}
            <button
              onClick={handlePostClick}
              className="bg-rose-500 hover:bg-rose-600 flex items-center rounded-full text-white text-sm font-medium pl-2 pr-3 py-1 shadow-sm mr-2"
            >
              <svg width="20" height="20" fill="currentColor" className="mr-1">
                <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
              </svg>
              <span>POST</span>
            </button>

            {/* Profile dropdown */}
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

                    {/* Online dot */}
                    {isLoggedIn && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}

                    {/* Unread badge on avatar — shows even before opening dropdown */}
                    {isLoggedIn && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white leading-none px-0.5">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      </span>
                    )}

                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/my-ads")}>
                      My Ads
                    </DropdownMenuItem>

                    {/* Chat — with unread badge */}
                    <DropdownMenuItem onClick={() => router.push("/chat")}>
                      <span className="flex items-center justify-between w-full">
                        Chat
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/switch-country")}>
                      Switch Country
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
