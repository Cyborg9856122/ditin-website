"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { brand } from "@/lib/config/brand"
import { permissions, ROLE_LABELS } from "@/lib/domain/auth/permissions"
import type { Role } from "@/lib/domain/types"

const ICONS: Record<string, ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="12" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="2.5" y="4.5" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 20.5h8M12 17.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  inquiries: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m3.5 6.5 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 20c.7-3.4 3-5.3 5.5-5.3s4.8 1.9 5.5 5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.3c1.4.4 2.4 1.7 2.4 3.2 0 1.5-1 2.8-2.4 3.2M17.8 14.9c2 .6 3.5 2.3 4.1 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  signOut: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 16l4-4-4-4M19 12H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 5.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H20a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

function useNavLinks(role: Role) {
  return [
    { href: "/admin", label: "Dashboard", icon: "dashboard", show: true },
    { href: "/admin/products", label: "Products", icon: "products", show: true },
    {
      href: "/admin/inquiries",
      label: "Inquiries",
      icon: "inquiries",
      show: permissions.canViewInquiries(role),
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: "users",
      show: permissions.canManageUsers(role),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: "settings",
      show: permissions.canManageSiteSettings(role),
    },
  ]
}

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  const links = useNavLinks(role)

  return (
    <nav className="flex flex-col gap-1">
      {links
        .filter((l) => l.show)
        .map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-brand-green bg-brand-green/5 text-brand-ink"
                  : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-brand-ink"
              }`}
            >
              <span className={active ? "text-brand-green" : "text-neutral-400"}>
                {ICONS[link.icon]}
              </span>
              {link.label}
            </Link>
          )
        })}
    </nav>
  )
}

export function AdminSidebar({
  role,
  fullName,
  onSignOut,
}: {
  role: Role
  fullName: string | null
  onSignOut: () => void
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-neutral-100 px-5">
        <Image
          src="/brand/ditin-displays-primary.png"
          alt={brand.logo.fullName}
          width={220}
          height={94}
          priority
          className="h-8 w-auto"
        />
        <span className="ml-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          Admin
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavLinks role={role} />
      </div>

      <div className="border-t border-neutral-100 p-4">
        <p className="truncate text-sm font-medium text-brand-ink">{fullName || "Signed in"}</p>
        <p className="mt-0.5 text-xs text-neutral-400">{ROLE_LABELS[role]}</p>
        <form action={onSignOut} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            {ICONS.signOut}
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}

export { NavLinks as AdminMobileNavLinks }
