import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils"; // Shadcn UI's class merge util
import { Inter } from "next/font/google";

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
        {children}
      </body>
    </html>
  );
}
