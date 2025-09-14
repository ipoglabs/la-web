import AppHeader from "../components/AppHeader/appHeader";
import SecondarySearchArea from "../components/AppHeader/secondarySearchArea";
import Filter from "../components/ListingComponents/filter";
import Listing from "../components/ListingComponents/listing";
import AppFooter from "../components/AppFooter/appFooter";

export default function ListingPage() {
  return (
<>
<AppHeader/>
<SecondarySearchArea/>
    <div className="container mx-auto flex flex-row items-start flex-nowrap gap-4 px-4 sm:px-6 lg:px-16 py-4">
<Filter/>
<Listing/>
</div>
<AppFooter/>
</>
  );
}