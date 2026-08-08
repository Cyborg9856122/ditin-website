"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { permissions } from "@/lib/domain/auth/permissions"
import type { Role } from "@/lib/domain/types"

export function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", show: true },
    { href: "/admin/products", label: "Products", show: true },
    { href: "/admin/inquiries", label: "Inquiries", show: permissions.canViewInquiries(role) },
    { href: "/admin/users", label: "Users", show: permissions.canManageUsers(role) },
  ]

  return (
    <nav className="flex gap-1 border-b border-neutral-200 bg-white px-6">
      {links
        .filter((l) => l.show)
        .map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "border-brand-green text-brand-ink"
                  : "border-transparent text-neutral-500 hover:text-brand-ink"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
    </nav>
  )
}
