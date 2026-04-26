export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold text-red-500">
        Profile not found
      </h2>
      <p className="text-slate-500 mt-2">
        The user you are looking for does not exist.
      </p>
    </div>
  );
}