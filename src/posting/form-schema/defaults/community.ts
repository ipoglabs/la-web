// Default "Community" post-form schemas.
//
// Option values are what the Community search filters match
// (components/create-alert/config/community.ts, lib/postFilterQuery.ts
// COMMUNITY_FORM_FILTERS). Fees are `salePrice`, the field listing prices and
// the price filter read; Wanted keeps `budgetAmount`, which its price filter reads.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";

const FORMAT = pairs([["inperson", "In Person"], ["online", "Online"], ["hybrid", "Hybrid"]]);
const format = (options = FORMAT): FormFieldDef => ({ key: "mode", type: "select", label: "Format", required: true, options });
const fee = (label = "Fee"): FormFieldDef => ({ key: "salePrice", type: "currency", label, hint: "Leave blank if free", min: 0, width: "half" });
const feePer = (entries: [string, string][]): FormFieldDef => ({ key: "priceUnit", type: "select", label: "Fee Per", options: pairs(entries), width: "half" });
const yesNo = (key: string, label: string): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half" });
const HOW_OFTEN = pairs([["once", "One-off"], ["weekly", "Weekly"], ["monthly", "Monthly"], ["several", "Several dates"]]);

/** Subjects, shared by Classes and Classes & Courses and matching their Subject filters. */
const SUBJECTS = pairs([
  ["music", "Music"],
  ["art", "Art"],
  ["dance", "Dance"],
  ["fitness", "Fitness"],
  ["language", "Language"],
  ["cooking", "Cooking"],
  ["academic", "Academic"],
  ["other", "Other"],
]);

/** A volunteer's background check in each market's own words; the values are shared. */
const BACKGROUND_CHECK_LABEL: Record<string, string> = { IN: "Police Verification", GB: "DBS Check", SG: "Background Check" };

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

export function communitySections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Lost & Found":
      return [
        basics,
        {
          title: "Report",
          fields: [
            { key: "reportType", type: "select", label: "Report Type", required: true, options: pairs([["lost", "Lost"], ["found", "Found"]]) },
            {
              key: "itemCategory",
              type: "select",
              label: "Item",
              required: true,
              hint: "Lost or found a pet? Post it in Pets › Lost & Found.",
              options: pairs([
                ["documents", "Documents"],
                ["electronics", "Electronics"],
                ["keys", "Keys"],
                ["bag", "Bag / Wallet"],
                ["jewellery", "Jewellery"],
                ["clothing", "Clothing"],
                ["vehicle", "Vehicle / Bike"],
                ["other", "Other"],
              ]),
            },
            { key: "lfDate", type: "date", label: "Date", required: true, width: "half" },
            { key: "reward", type: "currency", label: "Reward", min: 0, width: "half", showWhen: { field: "reportType", in: ["lost"] } },
            { key: "lastSeenLocation", type: "text", label: "Location", hint: "Where it was lost or found", required: true },
          ],
        },
      ];

    case "Events":
      return [
        basics,
        {
          title: "Event",
          fields: [
            {
              key: "eventType",
              type: "select",
              label: "Event Type",
              required: true,
              options: pairs([
                ["music", "Music & Concerts"],
                ["sports", "Sports & Fitness"],
                ["food", "Food & Drinks"],
                ["arts", "Arts & Culture"],
                ["wellness", "Health & Wellness"],
                ["family", "Kids & Family"],
                ["networking", "Networking"],
                ["comedy", "Comedy & Theatre"],
                ["community", "Community"],
                ["other", "Other"],
              ]),
            },
            format(),
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half" },
            { key: "endDate", type: "date", label: "End Date", hint: "For events over several days", width: "half" },
            { key: "frequency", type: "select", label: "Repeats", options: HOW_OFTEN, defaultValue: "once" },
            { key: "startTime", type: "text", label: "Start Time", placeholder: "e.g. 6:30 pm", width: "half" },
            { key: "venue", type: "text", label: "Venue", required: true, width: "half", showWhen: { field: "mode", in: ["inperson", "hybrid"] } },
            {
              key: "suitableFor",
              type: "select",
              label: "Suitable For",
              options: pairs([["all", "All Ages"], ["family", "Family-Friendly"], ["adults", "Adults Only"], ["kids", "Kids & Teens"]]),
            },
            yesNo("bookingNeeded", "Booking Needed"),
            fee("Entry Fee"),
          ],
        },
      ];

    case "Classes":
      return [
        basics,
        {
          title: "Class",
          fields: [
            { key: "subject", type: "select", label: "Subject", required: true, options: SUBJECTS },
            { key: "level", type: "select", label: "Level", options: pairs([["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"], ["all", "All Levels"]]) },
            format(),
            { key: "ageGroup", type: "select", label: "For", options: pairs([["kids", "Kids"], ["teens", "Teens"], ["adults", "Adults"], ["all", "All Ages"]]) },
            { key: "schedule", type: "text", label: "Schedule", placeholder: "e.g. Tuesdays 6 pm" },
            fee(),
            feePer([["class", "Per class"], ["month", "Per month"], ["term", "Per term"], ["course", "Full course"]]),
          ],
        },
      ];

    case "Volunteering & Charity":
      return [
        basics,
        {
          title: "Role",
          fields: [
            {
              key: "cause",
              type: "select",
              label: "Cause",
              required: true,
              options: pairs([
                ["environment", "Environment"],
                ["animal", "Animal Welfare"],
                ["education", "Education"],
                ["healthcare", "Healthcare"],
                ["elderly", "Elderly Care"],
                ["children", "Children"],
                ["disaster", "Disaster Relief"],
                ["poverty", "Poverty"],
                ["other", "Other"],
              ]),
            },
            { key: "commitment", type: "select", label: "Commitment", required: true, options: pairs([["once", "One-off"], ["recurring", "Recurring"]]) },
            format(pairs([["inperson", "In Person"], ["online", "Online"]])),
            { key: "availability", type: "text", label: "When Needed", placeholder: "e.g. Saturdays 9–12" },
            {
              key: "skillsNeeded",
              type: "multiselect",
              label: "Skills Needed",
              hint: "Leave blank if no skills are needed",
              options: pairs([["teaching", "Teaching"], ["tech", "Tech"], ["medical", "Medical"], ["cooking", "Cooking"], ["driving", "Driving"], ["admin", "Admin"]]),
            },
            { key: "minAge", type: "number", label: "Minimum Age", min: 0, max: 99, width: "half" },
            yesNo("trainingProvided", "Training Provided"),
            {
              key: "backgroundCheck",
              type: "select",
              label: BACKGROUND_CHECK_LABEL[country] ?? BACKGROUND_CHECK_LABEL.SG,
              options: pairs([["none", "Not needed"], ["provided", "We arrange it"], ["required", "Must already have one"]]),
            },
          ],
        },
      ];

    case "Classes & Courses":
      return [
        basics,
        {
          title: "Course",
          fields: [
            { key: "subject", type: "select", label: "Subject", required: true, options: SUBJECTS },
            {
              key: "qualification",
              type: "select",
              label: "Qualification Awarded",
              required: true,
              options: pairs([["certificate", "Certificate"], ["diploma", "Diploma"], ["workshop", "Workshop (no award)"], ["none", "None"]]),
            },
            {
              key: "awardingBody",
              type: "text",
              label: "Awarding Body",
              placeholder: "e.g. City & Guilds",
              showWhen: { field: "qualification", in: ["certificate", "diploma"] },
            },
            {
              key: "duration",
              type: "select",
              label: "Duration",
              required: true,
              options: pairs([["1w", "Under 1 week"], ["4w", "1–4 weeks"], ["3m", "1–3 months"], ["3mup", "3+ months"]]),
            },
            format(),
            { key: "startDate", type: "date", label: "Start Date", immediateOption: "Rolling intake", width: "half" },
            fee("Course Fee"),
          ],
        },
      ];

    case "Announcement":
      return [
        basics,
        {
          title: "Notice",
          fields: [
            {
              key: "annType",
              type: "select",
              label: "Announcement Type",
              required: true,
              options: pairs([
                ["community", "Community Notice"],
                ["government", "Government"],
                ["emergency", "Emergency"],
                ["road", "Road & Traffic"],
                ["infra", "Infrastructure"],
                ["event", "Event Notice"],
                ["general", "General"],
              ]),
            },
            {
              key: "postedBy",
              type: "select",
              label: "Posted By",
              required: true,
              options: pairs([["member", "Resident"], ["authority", "On behalf of a council or authority"], ["ngo", "Charity / NGO"], ["business", "Business"]]),
            },
            // Only an Emergency notice may be Critical.
            {
              key: "urgency",
              type: "select",
              label: "Urgency",
              options: pairs([["normal", "Normal"], ["urgent", "Urgent"]]),
              defaultValue: "normal",
              showWhen: { field: "annType", notIn: ["emergency"] },
            },
            {
              key: "alertLevel",
              type: "select",
              label: "Urgency",
              required: true,
              options: pairs([["urgent", "Urgent"], ["critical", "Critical"]]),
              showWhen: { field: "annType", in: ["emergency"] },
            },
            { key: "startDate", type: "date", label: "From Date", width: "half" },
            { key: "endDate", type: "date", label: "Until Date", hint: "The notice drops out of search after this", width: "half" },
            { key: "reference", type: "text", label: "Reference", placeholder: "e.g. planning ref 26/01234", width: "half" },
          ],
        },
      ];

    case "Child & Family Activities":
      return [
        basics,
        {
          title: "Activity",
          fields: [
            {
              key: "activityType",
              type: "select",
              label: "Activity Type",
              required: true,
              hint: "Paid childcare or babysitting goes in Services.",
              options: pairs([
                ["playdate", "Playgroup / Playdate"],
                ["classes", "Classes"],
                ["sports", "Sports"],
                ["arts", "Arts & Crafts"],
                ["educational", "Educational"],
                ["camps", "Camps"],
                ["cultural", "Cultural"],
                ["birthday", "Birthday Party"],
                ["support", "Support Group"],
                ["other", "Other"],
              ]),
            },
            {
              key: "ageGroup",
              type: "multiselect",
              label: "Age Group",
              options: pairs([["baby", "0–2 yrs"], ["3to5", "3–5 yrs"], ["6to9", "6–9 yrs"], ["10to12", "10–12 yrs"], ["teen", "13–17 yrs"], ["parents", "Parents"]]),
            },
            format(pairs([["inperson", "In Person"], ["online", "Online"]])),
            { key: "frequency", type: "select", label: "How Often", options: HOW_OFTEN, width: "half" },
            { key: "startDate", type: "date", label: "Start Date", width: "half" },
            { key: "startTime", type: "text", label: "Time", placeholder: "e.g. Tues & Thurs 10–12", width: "half" },
            yesNo("bookingNeeded", "Booking Needed"),
            fee(),
            feePer([["session", "Per session"], ["term", "Per term"], ["month", "Per month"]]),
          ],
        },
      ];

    case "General / Others":
      return [
        basics,
        {
          title: "Post",
          fields: [
            {
              key: "topic",
              type: "select",
              label: "Topic",
              required: true,
              options: pairs([
                ["tips", "Local Tips"],
                ["neighbourhood", "Neighbourhood"],
                ["clubs", "Clubs & Groups"],
                ["swap", "Skill Swap"],
                ["charity", "Charity"],
                ["other", "Other"],
              ]),
            },
            { key: "postType", type: "select", label: "Post Type", required: true, options: pairs([["sharing", "Sharing"], ["asking", "Asking"], ["offering", "Offering"]]) },
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
            {
              key: "routeType",
              type: "select",
              label: "Route Type",
              required: true,
              options: pairs([
                ["commute", "Daily Commute"],
                ["oneway", "One-way Trip"],
                ["weekend", "Weekend Trip"],
                ["outstation", country === "IN" ? "Outstation" : "Long Distance"],
              ]),
            },
            { key: "fromLocation", type: "text", label: "From", required: true, width: "half" },
            { key: "toLocation", type: "text", label: "To", required: true, width: "half" },
            {
              key: "days",
              type: "multiselect",
              label: "Days",
              options: pairs([["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]]),
              showWhen: { field: "routeType", in: ["commute"] },
            },
            { key: "startDate", type: "date", label: "Date", required: true, width: "half", showWhen: { field: "routeType", notIn: ["commute"] } },
            { key: "departureTime", type: "text", label: "Departure Time", placeholder: "e.g. 8:15 am", width: "half" },
            yesNo("returnTrip", "Return Trip"),
            { key: "seatsAvailable", type: "number", label: "Seats", hint: "Seats free when offering, seats needed when looking", min: 1, width: "half" },
            {
              ...fee("Cost per Seat"),
              hint: "A share of fuel and tolls only, as charging more can need a taxi licence. 0 for a free ride, blank to split costs.",
            },
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "Looking For",
          fields: [
            {
              key: "lookingFor",
              type: "select",
              label: "Looking For",
              required: true,
              options: pairs([
                ["volunteers", "Volunteers"],
                ["teacher", "A class or teacher"],
                ["people", "People for an event or group"],
                ["venue", "A venue or space"],
                ["ride", "A lift / ride"],
                ["other", "Other"],
              ]),
            },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 0, width: "half" },
            {
              key: "urgency",
              type: "select",
              label: "Needed By",
              options: pairs([["immediate", "As soon as possible"], ["week", "Within a week"], ["month", "Within a month"], ["flexible", "Flexible"]]),
            },
          ],
        },
      ];

    default:
      return null;
  }
}
