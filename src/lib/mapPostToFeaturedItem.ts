import type { IPost } from "@/models/post";

export interface FeaturedListingItem {
  id: string;
  href: string;
  images: { src: string; alt?: string }[];
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: string | number | Date;
  status?: "active" | "closed" | "off-market";
}

type LeanPost = IPost & { _id: unknown; createdAt?: Date };

function buildPriceLabel(p: LeanPost): { priceLabel: string; priceSuffix?: string } {
  if (p.category === "property") {
    if (p.rentPrice) return { priceLabel: formatMoney(p.rentPrice), priceSuffix: "/ mo" };
    if (p.salePrice) return { priceLabel: formatMoney(p.salePrice) };
    if (p.rateNightly) return { priceLabel: formatMoney(p.rateNightly), priceSuffix: "/ night" };
  }
  if (p.category === "vehicles" && p.salePrice) return { priceLabel: formatMoney(p.salePrice) };
  if (p.category === "jobs") {
    if (p.salary) return { priceLabel: formatMoney(p.salary), priceSuffix: "/ yr" };
    if (p.hourlyRate) return { priceLabel: formatMoney(p.hourlyRate), priceSuffix: "/ hr" };
  }
  if (p.category === "services" && p.price) return { priceLabel: formatMoney(p.price), priceSuffix: "/ hr" };
  return { priceLabel: "POA" };
}

function formatMoney(n: number): string {
  return `£${n.toLocaleString("en-GB")}`; // TODO: use per-country currency symbol from @/config once wired
}

function buildDetailsLabel(p: LeanPost): string {
  if (p.category === "property") {
    return [
      p.beds ? `${p.beds} BEDS` : null,
      p.baths ? `${p.baths} BATHS` : null,
      p.propertyType?.toUpperCase(),
    ].filter(Boolean).join(" • ") || p.subcategory?.toUpperCase() || "";
  }
  if (p.category === "vehicles") {
    return [p.year, p.kms ? `${p.kms.toLocaleString()} MILES` : null, p.fuelType?.toUpperCase()]
      .filter(Boolean).join(" • ");
  }
  if (p.category === "jobs") {
    return [p.jobType?.toUpperCase(), p.workMode?.toUpperCase(), p.company]
      .filter(Boolean).join(" • ");
  }
  return `${p.category?.toUpperCase() ?? ""}${p.subcategory ? " • " + p.subcategory.toUpperCase() : ""}`;
}

export function mapPostToFeaturedItem(p: LeanPost): FeaturedListingItem {
  const { priceLabel, priceSuffix } = buildPriceLabel(p);
  return {
    id: String(p._id),
    // TODO: switch to `/${countryCode}/listings/${id}` once the new country-scoped
    // listing detail route is wired to real data — pointing at the working real
    // detail page for now so links don't 404.
    href: `/post-details/${String(p._id)}`,
    images: (p.images ?? []).map((src) => ({ src, alt: p.name })),
    priceLabel,
    priceSuffix,
    title: p.name,
    detailsLabel: buildDetailsLabel(p),
    locationLabel: p.location?.address ?? "",
    postedAt: p.createdAt ?? new Date(),
    status: p.status === "active" ? "active" : "closed",
  };
}