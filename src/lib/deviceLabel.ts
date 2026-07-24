/**
 * Turns a raw User-Agent string into a short human label ("Chrome on macOS")
 * for the account-settings Devices list. Deliberately not using a UA-parsing
 * package — this repo's device list only needs a friendly label, not full
 * UA capability parsing.
 */
export function parseDeviceLabel(userAgent: string): string {
  const ua = userAgent || "";

  let os = "Unknown OS";
  if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Linux/.test(ua)) os = "Linux";

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/CriOS\//.test(ua)) browser = "Chrome";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/CriOS\//.test(ua)) browser = "Safari";

  return `${browser} on ${os}`;
}
