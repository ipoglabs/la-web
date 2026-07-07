export const COUNTRIES = [
  { code: "SG", name: "Singapore",   dial: "+65",  flag: "🇸🇬", minLen: 8,  maxLen: 8  },
  { code: "IN", name: "India",       dial: "+91",  flag: "🇮🇳", minLen: 10, maxLen: 10 },
  { code: "GB", name: "UK",          dial: "+44",  flag: "🇬🇧", minLen: 10, maxLen: 10 },
  { code: "US", name: "USA",         dial: "+1",   flag: "🇺🇸", minLen: 10, maxLen: 10 },
  { code: "AU", name: "Australia",   dial: "+61",  flag: "🇦🇺", minLen: 9,  maxLen: 9  },
  { code: "MY", name: "Malaysia",    dial: "+60",  flag: "🇲🇾", minLen: 9,  maxLen: 10 },
  { code: "CA", name: "Canada",      dial: "+1",   flag: "🇨🇦", minLen: 10, maxLen: 10 },
  { code: "NZ", name: "New Zealand", dial: "+64",  flag: "🇳🇿", minLen: 9,  maxLen: 9  },
  { code: "CH", name: "Switzerland", dial: "+41",  flag: "🇨🇭", minLen: 9,  maxLen: 9  },
  { code: "FR", name: "France",      dial: "+33",  flag: "🇫🇷", minLen: 9,  maxLen: 9  },
  { code: "AE", name: "UAE",         dial: "+971", flag: "🇦🇪", minLen: 9,  maxLen: 9  },
  { code: "DE", name: "Germany",     dial: "+49",  flag: "🇩🇪", minLen: 10, maxLen: 12 },
  { code: "AT", name: "Austria",     dial: "+43",  flag: "🇦🇹", minLen: 9,  maxLen: 10 },
] as const;

export type Country = (typeof COUNTRIES)[number];
