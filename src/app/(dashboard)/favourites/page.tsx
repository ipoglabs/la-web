import FavouritesGrid from "./FavouritesGrid";

export default function FavouritesPage() {
  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-slate-900">My Favourites</h1>
      <p className="mt-1 text-base text-slate-600">
        Listings you&apos;ve saved. Signed-in favourites follow you across devices.
      </p>

      <FavouritesGrid />
    </div>
  );
}
