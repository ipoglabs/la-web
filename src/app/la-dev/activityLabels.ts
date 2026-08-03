/** Shared between LaDevClient's per-user activity section and ActivityPanel's global feed. */
export const ACTIVITY_LABELS: Record<string, string> = {
  LOGIN: "Logins",
  EMAIL_CHANGED: "Email changes",
  PHONE_CHANGED: "Phone changes",
  NAME_CHANGED: "Name changes",
  USERID_CHANGED: "Profile ID changes",
  ROLE_CHANGED: "Role changes",
  DOB_CHANGED: "Date of birth changes",
  GENDER_CHANGED: "Gender changes",
  POST_CREATED: "Ads posted",
  POST_DELETED: "Ads deleted",
  MESSAGE_SENT: "Messages sent",
};

/** Field name shown in the History revision table — only actions that carry {from, to} metadata need an entry. */
export const FIELD_NAMES: Record<string, string> = {
  EMAIL_CHANGED: "Email",
  PHONE_CHANGED: "Phone",
  NAME_CHANGED: "Full Name",
  USERID_CHANGED: "Profile ID",
  ROLE_CHANGED: "Role",
  DOB_CHANGED: "Date of Birth",
  GENDER_CHANGED: "Gender",
};
