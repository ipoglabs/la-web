/**
 * report-ad — barrel export
 * Import everything from "@/components/report-ad"
 */

export { ReportAdPopup }           from "./ReportAdPopup";
export type { ReportAdPopupProps } from "./ReportAdPopup";

export { default as ReportAdJourney } from "./ReportAdJourney";
export type { ReportAdJourneyProps }  from "./ReportAdJourney";

export {
  REPORT_ISSUE_OPTIONS,
  deriveReportPriority,
  generateDemoTicketId,
} from "./types";

export type {
  ReportIssue,
  ReportIssueOption,
  ReportAdTarget,
  ReportAdPayload,
  ReportAdTicket,
} from "./types";
