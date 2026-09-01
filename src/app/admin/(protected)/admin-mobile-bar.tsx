"use client"

import { useState } from "react"
import Image from "next/image"
import { brand } from "@/lib/config/brand"
import type { Role } from "@/lib/domain/types"
import { AdminMobileNavLinks } from "./admin-sidebar"

export function AdminMobileBar({
  role,
  onSignOut,
}: {
  role: Role
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-neutral-200 bg-white md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Image
          src="/brand/ditin-displays-primary.png"
          alt={brand.logo.fullName}
          width={220}
          height={94}
          priority
          className="h-7 w-auto"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-9 w-9 items-center justify-center"
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-brand-ink transition duration-300 ${
              open ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {open ? (
        <div className="border-t border-neutral-100 px-3 py-3">
          <AdminMobileNavLinks role={role} onNavigate={() => setOpen(false)} />
          <form action={onSignOut} className="mt-2 border-t border-neutral-100 pt-3">
            <button
              type="submit"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
