"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { DESIGN_SYSTEM_MENU } from "@/lib/design-system-menu";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetCloseButton,
} from "@/components/ui/sheet";
import { LaText } from "@/components/la";
import { cn } from "@/lib/utils";

function SidebarContent({ onClose }: { onClose: () => void }) {
    const pathname = usePathname();

    return (
        <SheetContent side="left" className="w-72 max-w-[85vw]">
            <SheetHeader>
                <div>
                    <SheetTitle>
                        <Link href="/design-system" onClick={onClose} className="hover:text-slate-600 transition-colors">
                            Design System
                        </Link>
                    </SheetTitle>
                    <SheetDescription>Navigate the living design system</SheetDescription>
                </div>
                <SheetCloseButton />
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-3">
                <nav className="space-y-5">
                    {DESIGN_SYSTEM_MENU.map((section) => (
                        <div key={section.title}>
                            {/* Section label */}
                            <p className="mb-2 px-2 text-sm font-semibold text-slate-900">
                                {section.title}
                            </p>
                            <ul className="space-y-0.5">
                                {section.items.map((it) => {
                                    const isActive = pathname === it.href;
                                    return (
                                        <li key={it.href}>
                                            <Link
                                                href={it.href}
                                                onClick={onClose}
                                                className={cn(
                                                    "flex items-center rounded-lg px-2 py-1.5 text-sm transition-colors",
                                                    isActive
                                                        ? "bg-slate-900 font-medium text-white"
                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                                                )}
                                            >
                                                {it.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-slate-100 px-5 py-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">la · Design System</span>
                    <span className="text-[10px] text-slate-400">v0.1.0</span>
                </div>
            </div>
        </SheetContent>
    );
}

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <main className="min-h-screen bg-white">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            aria-label="Open menu"
                            className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 absolute left-2 top-2"
                        >
                            <Menu className="w-5 h-5 text-slate-800" />
                        </button>
                    </SheetTrigger>

                    <SidebarContent onClose={() => setOpen(false)} />
                </Sheet>

                <div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
                    <div>
                        <LaText type="h1">la - Design System</LaText>
                        <LaText type="body" className="mt-1 text-xl text-slate-600">
                            Living reference — rendered components, not screenshots.
                        </LaText>
                    </div>

                    {children}

                </div>
            </main>
        </div>
    );
}

