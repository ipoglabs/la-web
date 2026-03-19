import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import SiteGate from "@/app/components/SiteGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LokalAds | Classifieds",
  description: "Find or post ads easily. Buy, sell, rent, hire, or connect locally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-white min-h-screen text-slate-900", inter.className)}>
        <Toaster position="top-center" richColors />

        <SiteGate>
          {children}
        </SiteGate>

      </body>
    </html>
  );
}