import AppFooter from "@/components/la-blocks/AppFooter";
import AppHeader from "@/components/la-blocks/AppHeader";
import { CountryProvider } from "@/components/country/CountryProvider";
import type { AuthUser } from "@/types/auth";

// ── Mock users ─────────────────────────────────────────────────────────────
const MOCK_MEMBER: AuthUser = {
  id: "u1",
  name: "Gopinath Krishnamoorthi",
  initials: "GK",
  role: "member",
  status: "online",
};

const MOCK_ADMIN: AuthUser = {
  id: "u2",
  name: "Admin User",
  initials: "AU",
  role: "admin",
  status: "busy",
};

// ── Snippet strings ─────────────────────────────────────────────────────────

const SNIPPET_IMPORT = `import AppHeader from "@/components/la-blocks/AppHeader";
import type { AuthUser } from "@/types/auth";`;

const SNIPPET_SESSION = `// app/layout.tsx  (Server Component)
import { getSession } from "@/lib/session";

const user = await getSession(); // AuthUser | null
// Pass it down — no client context needed
<AppHeader variant="default" user={user} />`;

const SNIPPET_AUTH_WIRE = `// lib/session.ts
// Swap the stub for your real provider:

// NextAuth v5
import { auth } from "@/auth";
export async function getSession() {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id:       session.user.id,
    name:     session.user.name ?? "",
    initials: (session.user.name ?? "?").slice(0, 2).toUpperCase(),
    avatarUrl: session.user.image ?? undefined,
    role:     "member",
    status:   "online",
  } satisfies AuthUser;
}

// Lucia / better-auth — same shape, different source:
export async function getSession() {
  const { user } = await validateRequest();
  if (!user) return null;
  return { id: user.id, name: user.name, initials: "...", role: "member", status: "none" };
}`;

const SNIPPET_FAV_ADD = `// Any listing card, page, or component — add to favourites:
import { useFavouritesStore } from "@/lib/stores/favouritesStore";

const add = useFavouritesStore((s) => s.add);

add({
  id:            listing.id,
  image:         { src: listing.coverImage, alt: listing.title },
  priceLabel:    listing.price,
  priceSuffix:   listing.priceSuffix,   // optional e.g. "pcm"
  title:         listing.title,
  detailsLabel:  listing.details,
  locationLabel: listing.location,
  postedAt:      listing.createdAt,     // string | number | Date
  status:        listing.status,        // "active" | "closed" | "off-market"
});`;

const SNIPPET_FAV_SYNC = `// After login — merge server favourites with local ones:
import { useFavouritesStore } from "@/lib/stores/favouritesStore";

const serverFavs = await fetchUserFavourites(userId); // your API call
useFavouritesStore.getState().syncFromServer(serverFavs);
// Server items take priority; any local-only items are appended.`;

const indiaCategories = [
  { label: "Property", href: "/listings?cat=property" },
  { label: "Jobs",     href: "/listings?cat=jobs" },
  { label: "For Sale", href: "/listings?cat=for-sale", badge: "New" },
];
const indiaLocations = [
  { label: "Bengaluru", href: "/listings?loc=bengaluru" },
  { label: "Mumbai",    href: "/listings?loc=mumbai" },
  { label: "Delhi",     href: "/listings?loc=delhi", badge: "New" },
];
const ukCategories = [
  { label: "Property", href: "/listings?cat=property" },
  { label: "Motors",   href: "/listings?cat=motors" },
  { label: "Services", href: "/listings?cat=services", badge: "New" },
];
const ukLocations = [
  { label: "London",   href: "/listings?loc=london" },
  { label: "Bristol",  href: "/listings?loc=bristol" },
  { label: "Scotland", href: "/listings?loc=scotland", badge: "New" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-4 pt-8 pb-3 text-sm font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200">
      {children}
    </h2>
  );
}

function StateLabel({ title, code }: { title: string; code: string }) {
  return (
    <div className="px-4 pt-3 pb-2 bg-slate-100 border-b border-slate-200">
      <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
      <pre className="text-sm font-mono text-slate-500 whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-relaxed text-slate-200">
      <code>{code}</code>
    </pre>
  );
}

function PropsTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="px-3 py-2 font-semibold text-slate-700">Prop</th>
            <th className="px-3 py-2 font-semibold text-slate-700">Type</th>
            <th className="px-3 py-2 font-semibold text-slate-700">Default</th>
            <th className="px-3 py-2 font-semibold text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="odd:bg-white even:bg-slate-50">
              <td className="px-3 py-2 font-mono text-sky-700">{prop}</td>
              <td className="px-3 py-2 font-mono text-violet-700 whitespace-nowrap">{type}</td>
              <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{def}</td>
              <td className="px-3 py-2 text-slate-700">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AppShellPage() {
  return (
    <div className="min-h-screen bg-slate-100 pb-20">

      {/* Page header */}
      <div className="container-app pt-8 pb-4">
        <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Snippet</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-1">App Shell</h1>
        <p className="mt-2 text-base text-slate-600">
          AppHeader + AppFooter — all states. Auth is server-driven; favourites are local-first with post-login sync.
        </p>
      </div>

      {/* ── Developer Guide ──────────────────────────────────────────────── */}
      <div className="container-app">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Developer Guide</p>
            <h2 className="text-lg font-semibold text-slate-800 mt-0.5">Integration</h2>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Import</p>
            <CodeBlock code={SNIPPET_IMPORT} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">AppHeader Props</p>
            <PropsTable rows={[
              ["variant",  '"default" | "simple"',  '"default"', 'default = full header. simple = logo + avatar only.'],
              ["user",     "AuthUser | null",        "null",      "Pass from getSession() in your server layout. null = logged-out state."],
            ]} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">AuthUser type — <code className="font-mono text-violet-700">types/auth.ts</code></p>
            <PropsTable rows={[
              ["id",        "string",                                        "—",      "Unique user identifier from your auth provider."],
              ["name",      "string",                                        "—",      "Full display name."],
              ["initials",  "string",                                        "—",      "1–2 chars for avatar fallback e.g. \"GK\"."],
              ["avatarUrl", "string",                                        "—",      "Optional avatar image URL."],
              ["role",      '"member" | "admin"',                            "—",      "Controls subtitle in avatar dropdown."],
              ["status",    '"online" | "busy" | "offline" | "none"',        "—",      "Status dot colour on avatar."],
            ]} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Step 1 — Wire getSession() in layout.tsx</p>
            <CodeBlock code={SNIPPET_SESSION} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Step 2 — Replace the stub in lib/session.ts</p>
            <CodeBlock code={SNIPPET_AUTH_WIRE} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Favourites — add from any listing card</p>
            <p className="text-sm text-slate-500">Stored in localStorage. Works for all users, logged in or not.</p>
            <CodeBlock code={SNIPPET_FAV_ADD} />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Favourites — sync after login</p>
            <CodeBlock code={SNIPPET_FAV_SYNC} />
          </div>
        </div>
      </div>

      {/* ── AppHeader states ─────────────────────────────────────────────── */}
      <SectionTitle>AppHeader — all states</SectionTitle>

      <CountryProvider country="IN">
        <StateLabel
          title="Unauthenticated (default)"
          code={`<AppHeader variant="default" user={null} />`}
        />
        <AppHeader variant="default" user={null} />

        <StateLabel
          title="Authenticated — member · online"
          code={`<AppHeader variant="default" user={user} />  // user.role = "member", user.status = "online"`}
        />
        <AppHeader variant="default" user={MOCK_MEMBER} />

        <StateLabel
          title="Authenticated — admin · busy"
          code={`<AppHeader variant="default" user={user} />  // user.role = "admin", user.status = "busy"`}
        />
        <AppHeader variant="default" user={MOCK_ADMIN} />

        <StateLabel
          title="Simple — unauthenticated"
          code={`<AppHeader variant="simple" user={null} />`}
        />
        <AppHeader variant="simple" user={null} />

        <StateLabel
          title="Simple — authenticated member"
          code={`<AppHeader variant="simple" user={user} />`}
        />
        <AppHeader variant="simple" user={MOCK_MEMBER} />
      </CountryProvider>

      {/* ── AppFooter states ─────────────────────────────────────────────── */}
      <SectionTitle>AppFooter — all states</SectionTitle>

      <StateLabel
        title='variant="default" — India'
        code={`<AppFooter countryCode="in" countryLabel="India" popularCategories={[...]} topLocations={[...]} />`}
      />
      <AppFooter countryCode="in" countryLabel="India" popularCategories={indiaCategories} topLocations={indiaLocations} />

      <StateLabel
        title='variant="simple" — UK'
        code={`<AppFooter countryCode="gb" countryLabel="UK" variant="simple" popularCategories={[...]} topLocations={[...]} />`}
      />
      <AppFooter countryCode="gb" countryLabel="UK" variant="simple" popularCategories={ukCategories} topLocations={ukLocations} />

    </div>
  );
}
