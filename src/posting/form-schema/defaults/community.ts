// Default "Community" post-form schemas — mirror components/form/community/*.

import type { FormSection } from "../types";
import { basics, pairs } from "./shared";

const MODE = pairs([
  ["online", "Online"],
  ["offline", "In Person"],
  ["hybrid", "Hybrid"],
]);

export const COMMUNITY_SUBCATEGORIES = [
  "Lost & Found",
  "Events",
  "Classes",
  "Volunteering & Charity",
  "Classes & Courses",
  "Announcement",
  "Child & Family Activities",
  "General / Others",
  "Rideshare & Carpool",
  "Wanted",
];

export function communitySections(subcategory: string): FormSection[] | null {
  switch (subcategory) {
    case "Lost & Found":
      return [
        basics,
        {
          title: "Report",
          fields: [
            { key: "reportType", type: "select", label: "Report Type", required: true, options: pairs([["lost", "Lost"], ["found", "Found"]]) },
            { key: "lfDate", type: "date", label: "Date", required: true, width: "half" },
            { key: "lastSeenLocation", type: "text", label: "Last Seen Location", required: true },
          ],
        },
      ];

    case "Events":
      return [
        basics,
        {
          title: "Event",
          fields: [
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
            { key: "venue", type: "text", label: "Venue", required: true, width: "half" },
            { key: "price", type: "currency", label: "Entry Fee", min: 0, width: "half" },
          ],
        },
      ];

    case "Classes":
      return [
        basics,
        {
          title: "Class",
          fields: [
            { key: "subject", type: "text", label: "Subject", required: true },
            { key: "level", type: "select", label: "Level", options: pairs([["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"], ["all", "All Levels"]]) },
            { key: "mode", type: "select", label: "Mode", options: MODE },
            { key: "price", type: "currency", label: "Fee", min: 0, width: "half" },
          ],
        },
      ];

    case "Volunteering & Charity":
      return [basics, { title: "Details", fields: [{ key: "availability", type: "text", label: "Availability", placeholder: "e.g. Weekends" }] }];

    case "Classes & Courses":
      return [
        basics,
        {
          title: "Course",
          fields: [
            { key: "qualification", type: "text", label: "Qualification Awarded", required: true, width: "half" },
            { key: "durationText", type: "text", label: "Duration", required: true, placeholder: "e.g. 8 weeks", width: "half" },
            { key: "mode", type: "select", label: "Mode", options: MODE },
            { key: "price", type: "currency", label: "Fee", min: 0, width: "half" },
          ],
        },
      ];

    case "Child & Family Activities":
      return [
        basics,
        {
          title: "Activity",
          fields: [
            { key: "startDate", type: "date", label: "Date", width: "half" },
            { key: "ageGroup", type: "text", label: "Age Group", placeholder: "e.g. 5-10 years", width: "half" },
            { key: "price", type: "currency", label: "Fee", min: 0, width: "half" },
          ],
        },
      ];

    case "Rideshare & Carpool":
      return [
        basics,
        {
          title: "Ride",
          fields: [
            { key: "rideType", type: "select", label: "I am", required: true, options: pairs([["offering", "Offering a ride"], ["seeking", "Looking for a ride"]]) },
            { key: "fromLocation", type: "text", label: "From", required: true, width: "half" },
            { key: "toLocation", type: "text", label: "To", required: true, width: "half" },
            { key: "startDate", type: "date", label: "Date", width: "half" },
            { key: "seatsAvailable", type: "number", label: "Seats", min: 1, width: "half" },
            { key: "price", type: "currency", label: "Cost per Seat", min: 0, width: "half" },
          ],
        },
      ];

    // Title + details are all these need.
    case "Announcement":
    case "General / Others":
    case "Wanted":
      return [basics];

    default:
      return null;
  }
}
