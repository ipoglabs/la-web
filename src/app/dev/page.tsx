import type { Metadata } from "next";
import { cn } from "@/lib/utils";

/**
 * /dev — internal production-readiness status record ("05. Typical User
 * Journeys and Current Development Status"). Basic-Auth gated in proxy.ts
 * like /design-system, /snippets and /dev-tools — not for public viewing.
 */

export const metadata: Metadata = {
  title: "Development Status",
};

type Status = "Completed" | "In Progress" | "Pending" | "Future";

interface Row {
  capability: string;
  status: Status;
  readiness: string;
}

interface Group {
  area: string;
  rows: Row[];
}

const STATUS_GROUPS: Group[] = [
  {
    area: "User",
    rows: [
      { capability: "Google sign-in", status: "Completed", readiness: "Final security and production-configuration validation required" },
      { capability: "Apple sign-in", status: "Completed", readiness: "Final security and production-configuration validation required" },
      { capability: "Magic-link email authentication", status: "Completed", readiness: "Email delivery and production-flow validation required" },
      { capability: "Phone OTP authentication", status: "Completed", readiness: "OTP delivery, abuse prevention, and production validation required" },
    ],
  },
  {
    area: "Authentication",
    rows: [
      { capability: "Login and authentication journey", status: "Completed", readiness: "Session security, failure handling, and production validation required" },
      { capability: "Logged-in device management", status: "Completed", readiness: "Device revocation and security validation required" },
      { capability: "Email and phone-number updates", status: "Completed", readiness: "Reverification and security validation required" },
    ],
  },
  {
    area: "Landing and Discovery",
    rows: [
      { capability: "Core landing-page structure", status: "Completed", readiness: "Final content, responsive, performance, and accessibility review required" },
      { capability: "Search functionality", status: "Completed", readiness: "Search relevance and performance validation required" },
      { capability: "Popular categories", status: "Completed", readiness: "Final category content and ranking validation required" },
      { capability: "Category hierarchy", status: "Completed", readiness: "Finalise XX main categories and XXX subcategories" },
      { capability: "Recently saved searches", status: "Completed", readiness: "Final usability and data-retention validation required" },
      { capability: "Popular and trending listings", status: "Completed", readiness: "Trending logic and abuse-resistance validation required" },
      { capability: "Create search alert", status: "Completed", readiness: "Notification consent and production validation required" },
    ],
  },
  {
    area: "Listing Discovery",
    rows: [
      { capability: "Category-specific filters", status: "Completed", readiness: "Filter accuracy and category coverage validation required" },
      { capability: "Fact-based sorting", status: "Completed", readiness: "Sorting rules and relevance validation required" },
      { capability: "Elastic pagination", status: "Completed", readiness: "Performance and high-volume data testing required" },
    ],
  },
  {
    area: "Listing Details",
    rows: [
      { capability: "Key listing information", status: "Completed", readiness: "Content validation and responsive testing required" },
      { capability: "Image gallery", status: "Completed", readiness: "Image quality, upload limits, moderation, and performance validation required" },
      { capability: "Seller information", status: "Completed", readiness: "Privacy and seller-information review required" },
      { capability: "ChitChat access", status: "Completed", readiness: "Messaging security and abuse-control validation required" },
      { capability: "Call and email contact options", status: "Completed", readiness: "Privacy, consent, and user-control review required" },
      { capability: "“Good to Know” information", status: "Completed", readiness: "Final content and presentation review required" },
      { capability: "Map and listing location", status: "Completed", readiness: "Location accuracy and privacy validation required" },
    ],
  },
  {
    area: "In-App Messaging",
    rows: [
      { capability: "Buyer-seller ChitChat", status: "Completed", readiness: "End-to-end, security, performance, and moderation testing required" },
      { capability: "Recent chat-history list", status: "Completed", readiness: "Retention, ordering, and high-volume testing required" },
      { capability: "Block-user functionality", status: "Completed", readiness: "End-to-end enforcement validation required" },
      { capability: "Basic messaging security controls", status: "Completed", readiness: "Formal security review and abuse testing required" },
    ],
  },
  {
    area: "Favourites",
    rows: [
      { capability: "Save and remove favourite listings", status: "Completed", readiness: "Synchronisation and cross-device testing required" },
    ],
  },
  {
    area: "Alerts and Notifications",
    rows: [
      { capability: "Create alerts across categories", status: "Completed", readiness: "Alert accuracy and volume testing required" },
      { capability: "Email notifications", status: "Completed", readiness: "Delivery, unsubscribe, consent, and failure testing required" },
      { capability: "WhatsApp notifications", status: "Pending", readiness: "Provider, consent, privacy, and delivery model to be confirmed" },
    ],
  },
  {
    area: "Private Profile",
    rows: [
      { capability: "Update basic profile information", status: "Completed", readiness: "Privacy and validation testing required" },
      { capability: "User-role setup", status: "Completed", readiness: "Role permissions and misuse testing required" },
      { capability: "Save preferred locations", status: "Completed", readiness: "Location privacy and synchronisation testing required" },
      { capability: "Manage logged-in devices", status: "Completed", readiness: "Security and device-revocation testing required" },
      { capability: "Update phone number and email address", status: "Completed", readiness: "OTP, reverification, and account-protection testing required" },
    ],
  },
  {
    area: "Public Profile",
    rows: [
      { capability: "Public seller-profile experience", status: "Pending", readiness: "Profile visibility, privacy, trust, and reporting controls required" },
    ],
  },
  {
    area: "Back Office",
    rows: [
      { capability: "Administrative dashboard", status: "Pending", readiness: "Required before production launch" },
      { capability: "User administration", status: "Pending", readiness: "Account review, restriction, suspension, and audit controls required" },
      { capability: "Listing moderation", status: "Pending", readiness: "Review, removal, restoration, and escalation workflow required" },
      { capability: "User and listing report management", status: "Pending", readiness: "Triage, investigation, action, and status-management workflow required" },
      { capability: "Category and content management", status: "Pending", readiness: "Controlled publishing and change-history capability required" },
      { capability: "Audit logging", status: "Pending", readiness: "Administrative actions and critical changes must be traceable" },
      { capability: "Operational reporting", status: "Pending", readiness: "Marketplace health and moderation reporting required" },
    ],
  },
  {
    area: "Security Readiness",
    rows: [
      { capability: "Security architecture review", status: "Pending", readiness: "Required before production launch" },
      { capability: "Role and access-control review", status: "Pending", readiness: "User and administrator permissions must be validated" },
      { capability: "Rate limiting and abuse prevention", status: "Pending", readiness: "Required for authentication, OTP, search, chat, and listing actions" },
      { capability: "Bot and automated-abuse protection", status: "Pending", readiness: "Required for public-facing journeys" },
      { capability: "Vulnerability assessment", status: "Pending", readiness: "Required before production launch" },
      { capability: "Penetration testing", status: "Pending", readiness: "Required before production launch" },
      { capability: "Security logging and monitoring", status: "Pending", readiness: "Detection and response process required" },
      { capability: "Data backup and recovery validation", status: "Pending", readiness: "Recovery procedure must be tested" },
      { capability: "Incident-response process", status: "Pending", readiness: "Ownership, escalation, communication, and recovery process required" },
    ],
  },
  {
    area: "Trust and Safety",
    rows: [
      { capability: "Prohibited and restricted listing rules", status: "Pending", readiness: "Initial category rules must be defined before launch" },
      { capability: "Fraud and suspicious-activity controls", status: "Pending", readiness: "Detection, reporting, review, and enforcement process required" },
      { capability: "User-reporting operations", status: "Pending", readiness: "Reporting feature must connect to the back-office workflow" },
      { capability: "Seller-status and verification model", status: "Pending", readiness: "Any seller label must state the specific check completed" },
      { capability: "User blocking and enforcement validation", status: "Pending", readiness: "Cross-platform enforcement testing required" },
      { capability: "Moderation and escalation process", status: "Pending", readiness: "Operational ownership and response process required" },
    ],
  },
  {
    area: "Privacy and Compliance",
    rows: [
      { capability: "Privacy notice", status: "Pending", readiness: "Must reflect actual product data processing" },
      { capability: "Terms of Use", status: "Pending", readiness: "Marketplace roles and user responsibilities must be defined" },
      { capability: "Cookie and consent controls", status: "Pending", readiness: "Required according to the final analytics and marketing setup" },
      { capability: "Data-retention rules", status: "Pending", readiness: "Account, listing, chat, report, and log retention must be defined" },
      { capability: "User data and account-deletion journey", status: "Pending", readiness: "User experience and operational process required" },
      { capability: "Notification-preference management", status: "Pending", readiness: "Email, phone, and future WhatsApp preferences must be controllable" },
    ],
  },
  {
    area: "Quality Assurance",
    rows: [
      { capability: "Functional testing", status: "Pending", readiness: "All completed journeys require formal test coverage" },
      { capability: "Integration testing", status: "Pending", readiness: "Authentication, notifications, chat, maps, and external services require validation" },
      { capability: "End-to-end journey testing", status: "Pending", readiness: "Buyer, seller, reporting, and administration journeys require validation" },
      { capability: "Cross-browser testing", status: "Pending", readiness: "Final supported-browser coverage must be defined" },
      { capability: "Mobile and responsive testing", status: "Pending", readiness: "Supported devices and screen sizes must be validated" },
      { capability: "Performance and load testing", status: "Pending", readiness: "Search, listings, images, chat, and notifications require testing" },
      { capability: "Accessibility testing", status: "Pending", readiness: "Keyboard, screen-reader, zoom, contrast, forms, and error handling require validation" },
      { capability: "User acceptance testing", status: "Pending", readiness: "Required before public release" },
      { capability: "Regression testing", status: "Pending", readiness: "Required before each production release" },
    ],
  },
  {
    area: "Production Operations",
    rows: [
      { capability: "Production infrastructure review", status: "Pending", readiness: "Hosting, environments, configuration, and access require validation" },
      { capability: "Development, test, and production separation", status: "Pending", readiness: "Environment controls must be confirmed" },
      { capability: "Monitoring and alerting", status: "Pending", readiness: "Availability, performance, errors, and security events require monitoring" },
      { capability: "Logging and diagnostics", status: "Pending", readiness: "Sufficient diagnostic information must be available for support" },
      { capability: "Backup and disaster-recovery process", status: "Pending", readiness: "Recovery objectives and procedures must be documented and tested" },
      { capability: "Release and rollback process", status: "Pending", readiness: "Controlled production deployment and rollback capability required" },
      { capability: "Customer-support process", status: "Pending", readiness: "Support channels, ownership, and escalation must be defined" },
      { capability: "Operational runbook", status: "Pending", readiness: "Routine operations and incident procedures must be documented" },
    ],
  },
  {
    area: "Analytics",
    rows: [
      { capability: "Product analytics", status: "Pending", readiness: "Production events and privacy controls must be defined" },
      { capability: "Marketplace health indicators", status: "Pending", readiness: "Listing, search, contact, response, and sold-status measures required" },
      { capability: "Error and failure monitoring", status: "Pending", readiness: "Critical journey failures must be observable" },
      { capability: "Launch reporting dashboard", status: "Pending", readiness: "Initial operational and product measures must be available" },
    ],
  },
  {
    area: "Market-Launch Readiness",
    rows: [
      { capability: "Organic user-acquisition strategy", status: "Pending", readiness: "Initial audience, channels, and content plan required" },
      { capability: "Search-engine optimisation", status: "Pending", readiness: "Technical and content SEO review required" },
      { capability: "Initial seller and listing acquisition", status: "Pending", readiness: "Initial marketplace supply plan required" },
      { capability: "Launch categories and locations", status: "Pending", readiness: "Initial scope must be confirmed" },
      { capability: "Marketplace content preparation", status: "Pending", readiness: "Category, help, safety, and guidance content required" },
      { capability: "Pilot or controlled-release plan", status: "Pending", readiness: "Limited release should be considered before wider launch" },
      { capability: "Public-launch checklist", status: "Pending", readiness: "Final business, product, security, operational, and support approval required" },
    ],
  },
];

const STATUS_DEFINITIONS: { status: Status; meaning: string }[] = [
  { status: "Completed", meaning: "Functionality has been implemented in the current product" },
  { status: "In Progress", meaning: "Functionality is currently under development or refinement" },
  { status: "Pending", meaning: "Functionality or readiness activity has not yet been completed" },
  { status: "Future", meaning: "Optional capability planned for a later phase" },
];

const SUMMARY_ROWS: { area: string; status: string }[] = [
  { area: "Core customer-facing marketplace experience", status: "Largely completed" },
  { area: "User onboarding and authentication", status: "Completed, pending production validation" },
  { area: "Search and listing discovery", status: "Completed, pending scale and relevance testing" },
  { area: "Listing-details experience", status: "Completed, pending final validation" },
  { area: "In-app buyer-seller communication", status: "Completed, pending security and moderation validation" },
  { area: "Favourites and alerts", status: "Largely completed" },
  { area: "Private profile management", status: "Completed, pending final validation" },
  { area: "Public profile experience", status: "Pending" },
  { area: "Back-office administration", status: "Pending" },
  { area: "Trust and safety operations", status: "Pending" },
  { area: "Security hardening and independent validation", status: "Pending" },
  { area: "Privacy and compliance documentation", status: "Pending" },
  { area: "Comprehensive quality assurance", status: "Pending" },
  { area: "Production operations and support readiness", status: "Pending" },
  { area: "Analytics and marketplace measurement", status: "Pending" },
  { area: "Market-launch preparation", status: "Pending" },
];

const STATUS_BADGE_STYLES: Record<Status, string> = {
  "Completed": "bg-emerald-50 text-emerald-800 border-emerald-300",
  "In Progress": "bg-amber-50 text-amber-800 border-amber-300",
  "Pending": "bg-slate-100 text-slate-700 border-slate-300",
  "Future": "bg-slate-50 text-slate-500 border-slate-300 border-dashed",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-sm font-medium whitespace-nowrap",
        STATUS_BADGE_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function DevStatusPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-app max-w-4xl py-10 flex flex-col gap-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">05</p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Typical User Journeys and Current Development Status
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed">
            ABC has progressed beyond the concept stage, with the principal customer-facing
            marketplace journeys already implemented. These include onboarding, authentication,
            listing discovery, category-specific search, listing details, buyer-seller
            communication, favourites, alerts, and private profile management.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The remaining work is primarily focused on the public profile experience,
            back-office administration, security hardening, comprehensive testing, production
            operations, and market-launch readiness.
          </p>
        </header>

        {/* ── Status definitions ─────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Status Definitions</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-300">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700 w-40">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {STATUS_DEFINITIONS.map((d) => (
                  <tr key={d.status}>
                    <td className="px-4 py-3 align-top"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 align-top text-slate-700">{d.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Important:</span> &ldquo;Completed&rdquo;
            indicates that the functionality has been implemented. It does not mean that
            production security validation, performance testing, accessibility testing, or
            final user acceptance testing has been completed.
          </p>
        </section>

        {/* ── Current product and production-readiness status ──── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Current Product and Production-Readiness Status
          </h2>

          {STATUS_GROUPS.map((group) => (
            <div key={group.area} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {group.area}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-300">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">Capability</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 w-36">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Production-Readiness Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {group.rows.map((row) => (
                      <tr key={row.capability}>
                        <td className="px-4 py-3 align-top text-slate-900 font-medium">{row.capability}</td>
                        <td className="px-4 py-3 align-top"><StatusBadge status={row.status} /></td>
                        <td className="px-4 py-3 align-top text-slate-700">{row.readiness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* ── Overall readiness summary ──────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Overall Readiness Summary</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-300">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Readiness Area</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SUMMARY_ROWS.map((r) => (
                  <tr key={r.area}>
                    <td className="px-4 py-3 align-top text-slate-900 font-medium">{r.area}</td>
                    <td className="px-4 py-3 align-top text-slate-700">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Current position ───────────────────────────────── */}
        <section className="flex flex-col gap-4 pb-10">
          <h2 className="text-lg font-semibold text-slate-900">Current Position</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            As of September 2026, the principal customer-facing marketplace functionality has
            been substantially implemented. The current product supports onboarding,
            authentication, browsing, search, category-specific filtering, listing details,
            in-app buyer-seller communication, favourites, alerts, and private profile
            management.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The product is not yet considered ready for unrestricted public launch. The
            remaining work is focused on completing public profiles and back-office
            administration, strengthening trust and safety controls, formalising privacy and
            compliance documentation, conducting comprehensive security and quality testing,
            establishing production monitoring and support processes, and completing initial
            market-launch preparation.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            The status above will continue to be maintained as a master production-readiness
            record until ABC completes its launch-readiness checks and progresses to public
            release.
          </p>
        </section>

      </div>
    </div>
  );
}
