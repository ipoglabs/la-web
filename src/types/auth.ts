export interface AuthUser {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  role: "member" | "admin"
  /** Display label for the user's primary (first) identity role, e.g.
   *  "Business Owner". Falls back to "Individual". See config/roles.ts. */
  roleLabel?: string
  status: "online" | "busy" | "offline" | "none"
}
