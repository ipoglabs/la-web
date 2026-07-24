export type MenuItem = { label: string; href: string };
export type MenuSection = { title: string; items: MenuItem[] };

export const DESIGN_SYSTEM_MENU: MenuSection[] = [
  {
    title: "Core UI Components",
    items: [
      { label: "La Icons", href: "/design-system/core/icons" },
      { label: "La Colors", href: "/design-system/core/colors" },
      { label: "La Text", href: "/design-system/core/text" },
      { label: "La Button", href: "/design-system/core/button" },
      { label: "La Input", href: "/design-system/core/input" },
      { label: "La Amount", href: "/design-system/core/amount-input" },
      { label: "La Textarea", href: "/design-system/core/textarea" },
      { label: "La Select", href: "/design-system/core/select" },
      { label: "La List Select", href: "/design-system/core/list-select" },
      { label: "La Responsive Select", href: "/design-system/core/responsive-select" },
      { label: "La Radio", href: "/design-system/core/radio-input" },
      { label: "La Date Input", href: "/design-system/core/date-input" },
      { label: "La Field", href: "/design-system/core/field" },
      { label: "La Toggle Button", href: "/design-system/core/toggle-group" },
      { label: "La Switch", href: "/design-system/core/switch" },
      { label: "La Tag Input", href: "/design-system/core/la-tag-input" },
      { label: "La Badge", href: "/design-system/core/badge" },
      { label: "La Seperator", href: "/design-system/core/seperator" },
      
    ],
  },
  {
    title: "ShadCN Components",
    items: [
      { label: "Alert", href: "/design-system/shadcn/alert" },
      { label: "Alert Dialog", href: "/design-system/shadcn/alert-dialog" },
      { label: "Dialog", href: "/design-system/shadcn/dialog" },
      { label: "Drawer", href: "/design-system/shadcn/drawer" },
      { label: "Responsive Dialog", href: "/design-system/shadcn/responsive-dialog" },
      { label: "Scroll Area", href: "/design-system/shadcn/scroll-area" },
      { label: "Sheet", href: "/design-system/shadcn/sheet" },
      { label: "Tabs", href: "/design-system/shadcn/tabs" },
      { label: "Toast", href: "/design-system/shadcn/toast" },
    ],
  },
  {
    title: "UX Components",
    items: [
      { label: "Avatar", href: "/design-system/uxcomp/avatar" },
      { label: "Location Picker", href: "/design-system/uxcomp/location-picker" },
      { label: "Phone Number Input", href: "/design-system/uxcomp/phone-number-input" },
      { label: "Phone OTP - v2", href: "/design-system/uxcomp/phone-otp-v2" },
      { label: "Email OTP", href: "/design-system/uxcomp/email-otp" },
      { label: "Rich Text Editor", href: "/design-system/uxcomp/rich-text-editor" },
      { label: "Good To Know", href: "/design-system/uxcomp/good-to-know" },
      { label: "Timeline", href: "/design-system/uxcomp/timeline" },
      { label: "Favourites", href: "/design-system/uxcomp/favourite" },
      { label: "Overlay Country Select", href: "/design-system/uxcomp/switch-country" },
      { label: "Empty State", href: "/design-system/uxcomp/empty" },
      { label: "Image Gallery", href: "/design-system/uxcomp/image-gallery" },
      { label: "Chip / Filter Strip", href: "/design-system/uxcomp/chip" },
      { label: "Search Bar", href: "/design-system/uxcomp/search-bar" },
    ],
  },
  {
    title: "LA Blocks",
    items: [
      { label: "Why to use LA ?", href: "/design-system/blocks/why-la" },
      { label: "Thumbnail Listing", href: "/design-system/blocks/thumbnail-listing" },
      { label: "Relative Date", href: "/design-system/blocks/relative-date" },
    ],
  },
  {
    title: "Journey Snippets",
    items: [
      { label: "App Shell", href: "/snippets/app-shell" },
      { label: "Login", href: "/snippets/login" },
      { label: "Public Profile (live route)", href: "/u/anto27" },
      { label: "Donate", href: "/snippets/donate" },
      { label: "Feedback Journey", href: "/snippets/feedback-feature" },
      { label: "Create Alert", href: "/snippets/create-alert" },
      { label: "Landing Category", href: "/snippets/landing-category" },
      { label: "Report Ad", href: "/snippets/report-ad" },
      { label: "Security Blocked", href: "/snippets/security-blocked" },
      { label: "401 - Unauthorized", href: "/snippets/401" },
      { label: "403 - Forbidden", href: "/snippets/403" },
      { label: "404 - Page Not Found Error", href: "/snippets/404" },
      { label: "500 - Internal Server Error", href: "/snippets/500" },
      { label: "503 - Service Unavailable", href: "/snippets/503" },
    ],
  },
  {
    title: "Feature Demos",
    items: [
      { label: "Email Engine", href: "/design-system/feature/email-engine" },
      { label: "Batch Run Engine", href: "/design-system/feature/batch-run" },
      { label: "Feedback Popup", href: "/design-system/feature/feedback-popup-demo" },
      { label: "Feedback Route", href: "/design-system/feature/feedback-route-demo" },
    ],
  },
  {
    title: "Play Ground",
    items: [
      { label: "Landing Category", href: "/design-system/play-ground/landing-category" },
    ],
  },
  {
    title: "POC",
    items: [{ label: "Country Context", href: "/design-system/poc/country-context" }],
  },
];

export const DESIGN_SYSTEM_MENU_MAP: Record<string, MenuItem[]> = DESIGN_SYSTEM_MENU.reduce((acc, s) => {
  acc[s.title] = s.items;
  return acc;
}, {} as Record<string, MenuItem[]>);

export function getAllMenuItems() {
  return DESIGN_SYSTEM_MENU.flatMap((s) => s.items);
}
