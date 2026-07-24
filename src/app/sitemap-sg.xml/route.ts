import { NextResponse } from "next/server";
import { buildCountrySitemapXml } from "@/lib/seo/sitemap-country";

export async function GET() {
  return new NextResponse(buildCountrySitemapXml("sg"), {
    headers: { "Content-Type": "application/xml" },
  });
}
