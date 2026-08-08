// Business-logic layer: what each role is allowed to do. The UI and the
// data-access layer both call into this rather than checking role strings
// inline, so the rules live in exactly one place.
import type { Role } from "@/lib/domain/types"

export const permissions = {
  canManageUsers: (role: Role) => role === "owner",
  canManageSiteSettings: (role: Role) => role === "owner",
  canEditProducts: (role: Role) => role === "owner" || role === "editor",
  canPublishProducts: (role: Role) => role === "owner" || role === "editor",
  canViewInquiries: (role: Role) =>
    role === "owner" || role === "editor" || role === "viewer",
  canUpdateInquiryStatus: (role: Role) => role === "owner" || role === "editor",
} as const

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full access, including user management and site settings.",
  editor: "Create, edit, publish and unpublish products. Can read inquiries.",
  viewer: "Read-only access across the admin panel.",
}
