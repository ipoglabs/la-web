"use client";

import { FeedbackJourney } from "@/components/feedback";
import AppHeader from "@/components/la-blocks/AppHeader";
import AppFooter from "@/components/la-blocks/AppFooter";

export default function FeedbackPage() {
  return (
    <>
      <div className="bg-slate-950/15 min-w-93.75">
        {/* App Main Header */}
        <AppHeader variant="default" />

        {/* Main Body Section */}
        <div className="max-w-screen-2xl mx-auto sm:px-6 md:px-12 lg:px-20 xl:px-28 flex flex-col gap-y-2 items-stretch flex-nowrap">
          <FeedbackJourney />
        </div>

        {/* App Main Footer */}
        <AppFooter countryCode="in" countryLabel="India" variant="simple" />
      </div>
    </>
  );
}
