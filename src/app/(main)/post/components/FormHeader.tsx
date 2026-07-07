import React from "react";
// import { useAppStore } from "@/store/appStore";

export default function FormHeader() {
  // const country = useAppStore((state) => state.country);
  return (
    <header className="w-full py-4 px-6 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">Form Header</h2>
      <span className="text-sm text-gray-600">
        {/* Country: <strong>{country.toUpperCase()}</strong> */}
      </span>
    </header>
  );
}
