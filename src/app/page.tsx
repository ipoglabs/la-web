import AppHeader from "./components/AppHeader/appHeader";
import SearchArea from "./components/AppHeader/searchArea";
import MasonryGrid from "./components/HomeComponents/masonryGrid";
import StatsSection from "./components/HomeComponents/statsSection";
import AppFooter from "./components/AppFooter/appFooter";

export default function Home() {
  return (
    <>
    <AppHeader/>
    <SearchArea/>
    <MasonryGrid/>
    <StatsSection/>
    <AppFooter/>
    </>
  );
}
