import { sendEmail } from "@/lib/email";

interface SendAlertCreatedEmailArgs {
  email: string;
  alertName: string;
  categoryLabel: string;
  subCategoryLabel: string;
  keywords?: string[];
  locationLabel?: string;
  notifyVia: string[];
}

/** Wraps the ALERT_CREATED email event — fired once, right after
 * actions/createAlert.ts persists the alert. */
export async function sendAlertCreatedEmail({
  email,
  alertName,
  categoryLabel,
  subCategoryLabel,
  keywords,
  locationLabel,
  notifyVia,
}: SendAlertCreatedEmailArgs) {
  const result = await sendEmail({
    type: "ALERT_CREATED",
    to: email,
    data: {
      alertName,
      categoryLabel,
      subCategoryLabel,
      keywords,
      locationLabel,
      notifyVia,
      manageUrl: "/my-alerts",
    },
  });

  if (!result.success) {
    console.error("[sendAlertCreatedEmail] failed:", result.error);
  }

  return result;
}
