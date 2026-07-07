import { LaSearchBar, type SearchQuery } from "@/components/la-search-bar";
import MasonryGrid from "./components/HomeComponents/masonryGrid";
import StatsSection from "./components/HomeComponents/statsSection";

export default function Home() {
  return (
    <>
    <LaSearchBar/>
    <MasonryGrid/>
    <StatsSection/>
    </>
  );
}
