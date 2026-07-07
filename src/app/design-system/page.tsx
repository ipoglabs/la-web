"use client";

/**
 * /design-system — la design system living reference
 * Each section renders real components, no screenshots.
 */
import { LaText, LaSeparator } from "@/components/la";
import LaSection from "@/components/la/la-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DESIGN_SYSTEM_MENU } from "@/lib/design-system-menu";

// Token row moved to components/la/la-token-row.tsx (LaTokenRow)

// (Group helper removed — not currently used)

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DesignSystemPage() {
  // Use the menu config grouped by section
  const sections = DESIGN_SYSTEM_MENU;

  return (
    <>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="text-center">
            <LaText type="h3" className="font-regular mb-4">{section.title}</LaText>
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
                {section.items.map((it) => (
                  <Link key={`${section.title}__${it.label}`} href={it.href} className="inline-block">
                    <Button className="bg-slate-100 hover:bg-slate-200 text-lg text-slate-800">{it.label}</Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </>
  );
}
