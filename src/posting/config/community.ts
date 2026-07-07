// src/posting/config/categories/community.ts
import type { FieldSpec } from "./types";

export const communityConfig: Record<string, FieldSpec[]> = {
  lostfound: [
    { key: "reportType", type: "string", label: "Report Type" },     // lost/found
    { key: "lfDate", type: "date", label: "Date" },
    { key: "lastSeenLocation", type: "string", label: "Last Seen Location" },
    { key: "description", type: "string", label: "Description" },
  ],
  events: [
    { key: "date", type: "date", label: "Event Date" },
    { key: "locationText", type: "string", label: "Location" },
    { key: "description", type: "string", label: "Details" },
  ],
  classes: [
    { key: "subject", type: "string", label: "Subject" },
    { key: "level", type: "string", label: "Level" },
    { key: "mode", type: "string", label: "Mode" },
    { key: "price", type: "currency", label: "Fee (₹)" },
  ],
  volunteering: [
    { key: "description", type: "string", label: "Volunteer Details" },
    { key: "availability", type: "string", label: "Availability" },
  ],
  courses: [
    { key: "qualification", type: "string", label: "Qualification" },
    { key: "durationText", type: "string", label: "Duration" },
    { key: "price", type: "currency", label: "Fee (₹)" },
  ],
  announcement: [
    { key: "description", type: "string", label: "Announcement" },
  ],
  activities: [
    { key: "description", type: "string", label: "Activity Details" },
    { key: "date", type: "date", label: "Date" },
  ],
  general: [
    { key: "description", type: "string", label: "Details" },
  ],
  wanted: [
    { key: "description", type: "string", label: "Wanted Details" },
  ],
};
