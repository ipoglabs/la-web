/**
 * lib/mock/mock-searches.tsx
 *
 * Curated/popular search pills for the landing page.
 * Icons use Lucide React — one per category matching the alert config.
 *
 * Note: .tsx extension required because icons are JSX elements.
 *
 * TODO: Replace with a real API call that returns trending/popular searches
 * scoped to the user's active country. Endpoint suggestion:
 *   GET /api/popular-searches?country=IN&limit=8
 * Response should map to the RecentSearchItem shape (id, label, href, icon).
 */

import { History } from "lucide-react";
import type { RecentSearchItem } from "@/components/la-blocks/RecentSearches";

const iconCls = "h-3.5 w-3.5";

export const RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: "rs-1",
    label: "2 BHK · Koramangala",
    href: "/listing?cat=property&sub=to_rent&beds=2&loc=koramangala",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-2",
    label: "Honda City · Bengaluru",
    href: "/listing?cat=vehicles&sub=cars&q=honda+city&loc=bengaluru",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-3",
    label: "React Developer · Remote",
    href: "/listing?cat=jobs&sub=full_time&q=react+developer&work=remote",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-4",
    label: "Home Cleaning · Mumbai",
    href: "/listing?cat=services&sub=home&loc=mumbai",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-5",
    label: "iPhone 14 Pro",
    href: "/listing?cat=for-sale&sub=electronics&q=iphone+14+pro",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-6",
    label: "Golden Retriever · Bengaluru",
    href: "/listing?cat=pets&sub=dogs&q=golden+retriever&loc=bengaluru",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-7",
    label: "Café for Sale · Chennai",
    href: "/listing?cat=business&sub=for_sale&q=cafe&loc=chennai",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-8",
    label: "Startup Events · Bengaluru",
    href: "/listing?cat=community&sub=events&loc=bengaluru",
    icon: <History className={iconCls} />,
  },
  {
    id: "rs-9",
    label: "Diwali Dining Deals",
    href: "/listing?cat=special-offers&sub=food&occasion=diwali",
    icon: <History className={iconCls} />,
  },
];
