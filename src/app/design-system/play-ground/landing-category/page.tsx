"use client";

import React, { useEffect, useState } from "react";
import CollapsiblePanel from "@/components/collapsible/CollapsiblePanel";

// Recreated 9 tiles: use the mid color as top and dark color as bottom (2-stop)
const tiles = [
  { name: "Blue", top: "#a3c2fa", bottom: "#8bb3f5", className: "tile-blue" },
  { name: "Orange", top: "#ffb74d", bottom: "#ffa726", className: "tile-orange" },
  { name: "Green", top: "#69f0ae", bottom: "#00e676", className: "tile-green" },
  { name: "Purple", top: "#b39ddb", bottom: "#9575cd", className: "tile-purple" },
  { name: "Coral/Red", top: "#ff8a65", bottom: "#ff7043", className: "tile-coral" },
  { name: "Light Green", top: "#d4e157", bottom: "#cddc39", className: "tile-lightgreen" },
  { name: "Peach", top: "#ffcc80", bottom: "#ffb74d", className: "tile-peach" },
  { name: "Lavender", top: "#ce93d8", bottom: "#ba68c8", className: "tile-lavender" },
  { name: "Aqua/Teal", top: "#4dd0e1", bottom: "#00bcd4", className: "tile-aqua" },
  { name: "Muted Coral", top: "#f3d2cc", bottom: "#e58a7d", className: "tile-muted-coral" },
];

export default function LandingCategoryPage() {
  const shuffleColourOnLoad = true; // set to false to keep array order

  // keep the className on each palette item so headers can use the CSS class
  const colours = tiles.map((t) => ({ ...t }));

  function shuffle<T>(arr: T[]) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const [palette, setPalette] = useState(() => colours);

  useEffect(() => {
    if (shuffleColourOnLoad) {
      setPalette(shuffle(colours));
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Landing Category — 2‑stop Tiles</h1>
      <p className="text-gray-600 mb-6">Each tile uses a mild 2-stop gradient (top: mid, bottom: darker). Titles are white with a 1px non-blur shadow for crisp separation.</p>

      <div className="flex flex-wrap gap-4 mb-6">
        {tiles.map((t) => (
          <div
            key={t.name}
            className={`w-56 h-36 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden ${t.className}`}
            title={t.name}
          >
            <span className="text-lg font-semibold title-shadow">{t.name}</span>
            <div className="flex gap-2">
              <span className="text-xs text-white/90 bg-white/10 rounded px-2 py-1">{t.top}</span>
              <span className="text-xs text-white/90 bg-white/10 rounded px-2 py-1">{t.bottom}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Title dark shades removed — titles remain white with a subtle 1px shadow */}

      {/* Additional proposed tones removed */}

      {/* Masonry Grid of Collapsible Panels - placed at bottom */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        <div data-shuffle-colour={shuffleColourOnLoad} className="container mx-auto px-4 py-6 columns-1 sm:columns-2 md:columns-3 max-w-5xl column-gap-md">
          {(() => {
            const categories = [
              "Property",
              "Jobs",
              "Automotive",
              "Services",
              "Security",
              "Electronics",
              "Home & Garden",
              "Fashion",
              "Health",
              "Hobbies",
              "Education",
              "Travel",
              "Food & Drink",
            ];

            const iconFor = (title: string) => {
              switch (title) {
                case "Property":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" />
                    </svg>
                  );
                case "Jobs":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M6 7V6a4 4 0 0 1 8 0v1h4v12H2V7h4zm2 0h8V6a2 2 0 0 0-4 0v1H8V6a2 2 0 0 0-4 0v1h4z" />
                    </svg>
                  );
                case "Automotive":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M3 11l1.5-4.5A2 2 0 0 1 6.4 5h11.2a2 2 0 0 1 1.9 1.5L21 11v6a1 1 0 0 1-1 1h-1.5a1.5 1.5 0 1 1-3 0H9.5a1.5 1.5 0 1 1-3 0H5a1 1 0 0 1-1-1v-6z" />
                    </svg>
                  );
                case "Services":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2a2 2 0 0 0-2 2v3H7a2 2 0 0 0-2 2v3h14V9a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2zM5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4H5z" />
                    </svg>
                  );
                case "Electronics":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6l-2 2-2-2H5a2 2 0 0 1-2-2V5z" />
                    </svg>
                  );
                case "Home & Garden":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 3l9 7-1 1v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8l-1-1 9-7z" />
                    </svg>
                  );
                case "Fashion":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2l3 5h5v2l-2 9H6L4 9V7h5l3-5z" />
                    </svg>
                  );
                case "Health":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2v6h16v-6a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                    </svg>
                  );
                case "Hobbies":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2l2 5h5l-4 3 1 5-4-3-4 3 1-5-4-3h5l2-5z" />
                    </svg>
                  );
                case "Education":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 3L2 7l10 4 10-4-10-4zm0 6.2L4 8v6l8 3 8-3V8l-8 1.2z" />
                    </svg>
                  );
                case "Travel":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M2 12l20-7-4 14-6-3-6 3-4-7z" />
                    </svg>
                  );
                case "Food & Drink":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M7 2v11a5 5 0 0 0 10 0V2h-2v11a3 3 0 0 1-6 0V2H7zM3 18h18v2H3v-2z" />
                    </svg>
                  );
                case "Security":
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2l8 4v6c0 5-3.6 9.7-8 11-4.4-1.3-8-6-8-11V6l8-4zM11 10h2v5h-2v-5zM11 16h2v2h-2v-2z" />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return categories.map((title, i) => (
              <div key={`panel-${i}`} className="mb-4 avoid-column-break">
                <CollapsiblePanel
                  title={title}
                  description={`Explore ${title} listings`}
                  headerClass={palette[i % palette.length].className}
                  icon={iconFor(title)}
                >
                  <ul className="list-none m-0 p-0">
                    {title === "Security" ? (
                      <li className="block">
                        <a
                          href="/snippets/security-blocked"
                          className="flex items-center justify-between pl-5 pr-2 py-2 font-medium text-slate-900 hover:font-semibold hover:text-emerald-800 hover:bg-emerald-100 rounded-md"
                        >
                          <span>Open security block</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </li>
                    ) : (
                      <>
                        <li className="block">
                          <a
                            href="#"
                            className="flex items-center justify-between pl-5 pr-2 py-1 font-normal text-slate-900 hover:font-semibold hover:text-emerald-800 hover:bg-emerald-100 rounded-md cursor-pointer"
                          >
                            <span>Popular</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </li>
                        <li className="block">
                          <a
                            href="#"
                            className="flex items-center justify-between pl-5 pr-2 py-1 font-normal text-slate-900 hover:font-semibold hover:text-emerald-800 hover:bg-emerald-100 rounded-md cursor-pointer"
                          >
                            <span>New</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </li>
                        <li className="block">
                          <a
                            href="#"
                            className="flex items-center justify-between pl-5 pr-2 py-1 font-normal text-slate-900 hover:font-semibold hover:text-emerald-800 hover:bg-emerald-100 rounded-md cursor-pointer"
                          >
                            <span>Top Rated</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </CollapsiblePanel>
              </div>
            ));
          })()}
        </div>
      </section>
    </main>
  );
}

