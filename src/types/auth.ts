export interface AuthUser {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  role: "member" | "admin"
  status: "online" | "busy" | "offline" | "none"
}
