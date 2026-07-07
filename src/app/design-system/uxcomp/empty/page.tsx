"use client";

import {
  Car,
  Smartphone,
  Home,
  Heart,
  Briefcase,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Dog,
  Bike,
  Search,
  MessageCircle,
} from "lucide-react";
import LaSection from "@/components/la/la-section";
import { LaEmpty } from "@/components/la-blocks/la-empty";
import { LaSeparator } from "@/components/la";

export default function EmptyPage() {
  return (
    <div className="space-y-14">

      {/* ── Default (md) — full showcase grid ── */}
      <LaSection title="Empty State — Categories">
        <p className="text-sm text-slate-500 -mt-2">
          Used when a category or search result has zero listings. Each intent maps to a category colour.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Car}
              intent="blue"
              category="Cars & Vehicles"
              subcategory="Sedans"
              title="No cars listed yet"
              description="Be the first seller in this category. Buyers are already searching — your listing could be the first they see."
              action={{ label: "Post a Car", onClick: () => {} }}
              secondaryAction={{ label: "Browse Other Vehicles", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Smartphone}
              intent="purple"
              category="Electronics"
              subcategory="Mobile Phones"
              title="No phones listed"
              description="Got an old phone to sell? List it in under 2 minutes and reach thousands of local buyers."
              action={{ label: "Post a Phone", onClick: () => {} }}
              secondaryAction={{ label: "View All Electronics", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Home}
              intent="amber"
              category="Property"
              subcategory="Apartments for Rent"
              title="No apartments available"
              description="No rentals in this area right now. Try nearby locations or set an alert to be notified when new listings appear."
              action={{ label: "Set an Alert", onClick: () => {} }}
              secondaryAction={{ label: "Expand Search Area", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Briefcase}
              intent="green"
              category="Jobs"
              subcategory="Tech & IT"
              title="No jobs posted here"
              description="Hiring? Post a job and find your next great hire. Candidates in this category are actively looking."
              action={{ label: "Post a Job", onClick: () => {} }}
              secondaryAction={{ label: "Browse All Jobs", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Heart}
              intent="rose"
              category="Favourites"
              title="Nothing saved yet"
              description="Tap the heart on any listing to save it here. Your shortlist lives in one place, ready when you are."
              action={{ label: "Browse Listings", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              icon={Search}
              intent="default"
              category="Search Results"
              title="No results found"
              description={
                <>
                  Try different keywords, broaden your filters, or{" "}
                  <span className="font-medium text-slate-700">clear the search</span>{" "}
                  to see everything available.
                </>
              }
              action={{ label: "Clear Filters", onClick: () => {} }}
              secondaryAction={{ label: "Browse All Categories", onClick: () => {} }}
            />
          </div>

        </div>
      </LaSection>

      <LaSeparator />

      {/* ── Small size ── */}
      <LaSection title="Small Size — Compact Contexts">
        <p className="text-sm text-slate-500 -mt-2">
          Use <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">size="sm"</code> inside sidebars, panels, or widget cards.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              size="sm"
              icon={MessageCircle}
              intent="blue"
              category="Messages"
              title="No messages"
              description="Start a conversation by contacting a seller."
              action={{ label: "Browse Listings", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              size="sm"
              icon={ShoppingBag}
              intent="amber"
              category="My Ads"
              title="No active ads"
              description="Your posted listings will appear here."
              action={{ label: "Post an Ad", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              size="sm"
              icon={Dog}
              intent="green"
              category="Pets"
              title="No pets listed"
              description="Adorable listings coming soon."
              action={{ label: "Post a Pet", onClick: () => {} }}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <LaEmpty
              size="sm"
              icon={Bike}
              intent="purple"
              category="Sports"
              subcategory="Cycling"
              title="No bikes here"
              description="Be the first to list in cycling."
              action={{ label: "Post Now", onClick: () => {} }}
            />
          </div>

        </div>
      </LaSection>

      <LaSeparator />

      {/* ── No action variant ── */}
      <LaSection title="No Action — Read-only States">
        <p className="text-sm text-slate-500 -mt-2">
          When the user has no action to take — e.g. admin views, archived sections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="border border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <LaEmpty
              icon={Wrench}
              intent="default"
              category="Services"
              subcategory="Home Repairs"
              title="Coming soon"
              description="We're working on expanding into services. Stay tuned for local tradespeople and home repair listings."
            />
          </div>

          <div className="border border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <LaEmpty
              icon={GraduationCap}
              intent="blue"
              category="Education"
              title="No courses listed"
              description="Tutors and training providers haven't listed here yet. This space will fill up fast once we launch."
            />
          </div>

        </div>
      </LaSection>

    </div>
  );
}
